import base64
import json
import os
import re
import secrets
from datetime import datetime, timedelta

import boto3
import psycopg2

SCHEMA = 't_p90609946_ceramics_school_home'

ALLOWED_TYPES = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
}
MAX_SIZE = 8 * 1024 * 1024


def _cors() -> dict:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }


def _normalize_phone(phone: str) -> str:
    digits = re.sub(r'\D', '', phone or '')
    if len(digits) == 11 and digits[0] == '8':
        digits = '7' + digits[1:]
    return digits


def handler(event: dict, context) -> dict:
    '''
    Публичная подача заявки клиентом на добавление посылки с готовым (или ещё не обожжённым)
    керамическим изделием: ФИО, телефон, email и фото. Заявка попадает в очередь на
    подтверждение менеджеру ВДНХ (статус 'pending_review'), после подтверждения становится
    обычной отслеживаемой посылкой.
    Если isRepeatVisit=true (клиент уже расписывал ранее слепленное изделие и снова сдаёт
    его на обжиг) — требуются только телефон и фото; заявка автоматически привязывается
    (parent_id) к последней заявке этого клиента по номеру телефона, ФИО/email берутся из
    неё же, и сразу получает статус 'shipped' без проверки менеджером.
    visitDate — дата посещения мастер-класса/студии, указывается клиентом обязательно.
    POST { customerName, customerPhone, customerEmail, photoData (base64), contentType,
           isRepeatVisit, visitDate }
    Args: event с httpMethod, body
          context — объект с request_id
    Returns: HTTP-ответ с временным номером заявки, либо ошибкой
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'body': ''}

    if method != 'POST':
        return {'statusCode': 405, 'headers': _cors(), 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    is_repeat_visit = bool(body.get('isRepeatVisit'))
    customer_name = (body.get('customerName') or '').strip()
    customer_phone = (body.get('customerPhone') or '').strip()
    customer_email = (body.get('customerEmail') or '').strip()
    photo_data = body.get('photoData') or ''
    content_type = body.get('contentType') or 'image/jpeg'
    visit_date_raw = (body.get('visitDate') or '').strip()

    if not is_repeat_visit and (not customer_name or not customer_email):
        return {
            'statusCode': 400,
            'headers': _cors(),
            'body': json.dumps({'error': 'Укажите ФИО и email'}, ensure_ascii=False),
        }

    if not visit_date_raw:
        return {
            'statusCode': 400,
            'headers': _cors(),
            'body': json.dumps({'error': 'Укажите дату посещения'}, ensure_ascii=False),
        }
    try:
        visit_date = datetime.strptime(visit_date_raw[:10], '%Y-%m-%d').date()
    except ValueError:
        return {
            'statusCode': 400,
            'headers': _cors(),
            'body': json.dumps({'error': 'Неверный формат даты посещения'}, ensure_ascii=False),
        }

    phone_digits = _normalize_phone(customer_phone)
    if len(phone_digits) < 11:
        return {
            'statusCode': 400,
            'headers': _cors(),
            'body': json.dumps({'error': 'Укажите корректный номер телефона'}, ensure_ascii=False),
        }

    if not photo_data:
        return {
            'statusCode': 400,
            'headers': _cors(),
            'body': json.dumps({'error': 'Приложите фото изделия'}, ensure_ascii=False),
        }

    if content_type not in ALLOWED_TYPES:
        return {
            'statusCode': 400,
            'headers': _cors(),
            'body': json.dumps({'error': 'Недопустимый формат фото (используйте JPG, PNG или WEBP)'}, ensure_ascii=False),
        }

    if ',' in photo_data:
        photo_data = photo_data.split(',', 1)[1]

    try:
        raw = base64.b64decode(photo_data)
    except Exception:
        return {
            'statusCode': 400,
            'headers': _cors(),
            'body': json.dumps({'error': 'Некорректные данные фото'}, ensure_ascii=False),
        }

    if len(raw) > MAX_SIZE:
        return {
            'statusCode': 400,
            'headers': _cors(),
            'body': json.dumps({'error': 'Фото больше 8МБ'}, ensure_ascii=False),
        }

    ext = ALLOWED_TYPES[content_type]
    key = f'shipment-requests/{secrets.token_hex(12)}.{ext}'

    access_key = os.environ['AWS_ACCESS_KEY_ID']
    try:
        s3 = boto3.client(
            's3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=access_key,
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        )
        s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=content_type)
    except Exception:
        return {
            'statusCode': 502,
            'headers': _cors(),
            'body': json.dumps(
                {'error': 'Не удалось сохранить фото на сервере. Попробуйте отправить заявку ещё раз через пару минут.'},
                ensure_ascii=False,
            ),
        }
    photo_url = f'https://cdn.poehali.dev/projects/{access_key}/bucket/{key}'

    today = datetime.utcnow().date()
    placeholder_return = today + timedelta(days=30)

    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
    except Exception:
        return {
            'statusCode': 503,
            'headers': _cors(),
            'body': json.dumps(
                {'error': 'Сервер временно недоступен. Попробуйте отправить заявку ещё раз через пару минут.'},
                ensure_ascii=False,
            ),
        }
    try:
        cur = conn.cursor()

        parent_id = None
        visit_number = 1
        if is_repeat_visit:
            cur.execute(
                f"SELECT id, customer_name, customer_email, visit_number FROM {SCHEMA}.shipments "
                f"WHERE regexp_replace(customer_phone, '[^0-9]', '', 'g') LIKE %s "
                f"ORDER BY created_at DESC LIMIT 1",
                ('%' + phone_digits[-10:],),
            )
            parent_row = cur.fetchone()
            if not parent_row:
                return {
                    'statusCode': 404,
                    'headers': _cors(),
                    'body': json.dumps(
                        {'error': 'Не нашли предыдущую заявку по этому номеру телефона. Проверьте номер или заполните форму как первое посещение.'},
                        ensure_ascii=False,
                    ),
                }
            parent_id, parent_name, parent_email, parent_visit_number = parent_row
            customer_name = parent_name
            customer_email = parent_email or customer_email
            visit_number = (parent_visit_number or 1) + 1

        tracking_number = None
        for _ in range(5):
            candidate = f'REQ-{secrets.token_hex(3).upper()}'
            cur.execute(
                f"SELECT id FROM {SCHEMA}.shipments WHERE tracking_number = %s", (candidate,),
            )
            if not cur.fetchone():
                tracking_number = candidate
                break
        if not tracking_number:
            return {
                'statusCode': 500,
                'headers': _cors(),
                'body': json.dumps({'error': 'Не удалось создать заявку, попробуйте ещё раз'}, ensure_ascii=False),
            }

        status = 'shipped' if is_repeat_visit else 'pending_review'

        cur.execute(
            f"INSERT INTO {SCHEMA}.shipments "
            f"(tracking_number, customer_name, customer_phone, customer_email, photo_url, "
            f"delivered_at, return_at, status, source, parent_id, visit_number, visit_date) "
            f"VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'client', %s, %s, %s)",
            (tracking_number, customer_name, customer_phone, customer_email, photo_url,
             today, placeholder_return, status, parent_id, visit_number, visit_date),
        )
        conn.commit()

        return {
            'statusCode': 200,
            'headers': _cors(),
            'body': json.dumps(
                {'ok': True, 'trackingNumber': tracking_number, 'isRepeatVisit': is_repeat_visit},
                ensure_ascii=False,
            ),
        }
    except Exception:
        return {
            'statusCode': 500,
            'headers': _cors(),
            'body': json.dumps(
                {'error': 'Не удалось сохранить заявку на сервере. Попробуйте отправить её ещё раз.'},
                ensure_ascii=False,
            ),
        }
    finally:
        conn.close()