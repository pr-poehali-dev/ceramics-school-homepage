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


def _generate_tracking_number(cur, phone_digits: str, schema: str) -> str | None:
    """Генерирует номер заявки в формате ДДММ-XXXX: дата создания + последние 4 цифры
    телефона клиента (например, 3107-9771). При коллизии (тот же день + те же 4 цифры
    телефона — повторное посещение в тот же день) добавляет суффикс -2, -3 и т.д."""
    today_part = datetime.utcnow().strftime('%d%m')
    phone_part = phone_digits[-4:] if len(phone_digits) >= 4 else phone_digits.rjust(4, '0')
    base = f'{today_part}-{phone_part}'
    candidate = base
    for i in range(2, 20):
        cur.execute(f"SELECT id FROM {schema}.shipments WHERE tracking_number = %s", (candidate,))
        if not cur.fetchone():
            return candidate
        candidate = f'{base}-{i}'
    return None


def handler(event: dict, context) -> dict:
    '''
    Публичная подача заявки клиентом на добавление посылки с готовым (или ещё не обожжённым)
    керамическим изделием: ФИО, телефон, email и фото. Форма общая для Москвы и Суздаля,
    город передаётся явно полем city ('moscow' или 'suzdal') — определяется на фронтенде
    автоматически по разделу сайта, без ручного выбора клиентом.

    Для Москвы (city='moscow'): заявка попадает в очередь на подтверждение менеджеру ВДНХ
    (статус 'pending_review'), после подтверждения (approve_request) становится обычной
    отслеживаемой посылкой. Клиент сам выбирает в форме тип изделия — requiresPainting=true
    («Изделие с росписью», ещё не расписано) или false («Изделие без росписи», нужен только
    обжиг) — этот выбор сохраняется в requires_painting сразу при создании заявки и менеджер
    ВДНХ при подтверждении его больше не переопределяет.

    Для Суздаля (city='suzdal'): поле requiresPainting не используется (в Суздале нет
    росписи через эту форму) — ФИО и email всегда обязательны. Заявка сразу видна менеджеру
    Суздаля со статусом 'in_progress' ("В работе") без отдельного этапа подтверждения — только
    менеджер Суздаля решает, когда нажать «Отправить на ВДНХ» (см. shipments-admin, action
    send_to_vdnh), после чего статус меняется на 'shipped' и заявка попадает в общую систему
    отслеживания наравне с московскими.

    tracking_number генерируется в формате ДДММ-XXXX (дата создания + последние 4 цифры
    телефона клиента, например 3107-9771).
    visitDate — дата посещения мастер-класса/студии, указывается клиентом обязательно.
    Фото: можно передать несколько (до 10) — массив photos: [{photoData (base64), contentType}].
    Для обратной совместимости также поддерживается одиночный photoData/contentType на верхнем
    уровне body (эквивалентно photos с одним элементом). Каждое фото загружается в S3, все URL
    сохраняются в таблице shipment_photos (shipment_id, photo_url, sort_order) — первое фото
    также дублируется в shipments.photo_url для обратной совместимости со старым кодом.
    POST { customerName, customerPhone, customerEmail, photos: [{photoData, contentType}],
           requiresPainting, visitDate, city }
    Args: event с httpMethod, body
          context — объект с request_id
    Returns: HTTP-ответ с номером заявки, либо ошибкой
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'body': ''}

    if method != 'POST':
        return {'statusCode': 405, 'headers': _cors(), 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    city = (body.get('city') or 'moscow').strip()
    if city not in ('moscow', 'suzdal'):
        city = 'moscow'
    # В Суздале нет выбора росписи через эту форму — requiresPainting применим только к Москве
    requires_painting = bool(body.get('requiresPainting')) if city == 'moscow' else False
    customer_name = (body.get('customerName') or '').strip()
    customer_phone = (body.get('customerPhone') or '').strip()
    customer_email = (body.get('customerEmail') or '').strip()
    visit_date_raw = (body.get('visitDate') or '').strip()

    photos = body.get('photos')
    if not isinstance(photos, list) or not photos:
        # Обратная совместимость со старым форматом с одним фото
        single_photo_data = body.get('photoData') or ''
        if single_photo_data:
            photos = [{'photoData': single_photo_data, 'contentType': body.get('contentType') or 'image/jpeg'}]
        else:
            photos = []

    if len(photos) > 10:
        return {
            'statusCode': 400,
            'headers': _cors(),
            'body': json.dumps({'error': 'Можно приложить не более 10 фото'}, ensure_ascii=False),
        }

    if not customer_name or not customer_email:
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

    if not photos:
        return {
            'statusCode': 400,
            'headers': _cors(),
            'body': json.dumps({'error': 'Приложите хотя бы одно фото изделия'}, ensure_ascii=False),
        }

    decoded_photos = []
    for photo in photos:
        photo_data = (photo.get('photoData') if isinstance(photo, dict) else None) or ''
        content_type = (photo.get('contentType') if isinstance(photo, dict) else None) or 'image/jpeg'

        if not photo_data:
            continue

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
                'body': json.dumps({'error': 'Каждое фото должно быть не больше 8МБ'}, ensure_ascii=False),
            }

        decoded_photos.append((raw, content_type))

    if not decoded_photos:
        return {
            'statusCode': 400,
            'headers': _cors(),
            'body': json.dumps({'error': 'Приложите хотя бы одно фото изделия'}, ensure_ascii=False),
        }

    access_key = os.environ['AWS_ACCESS_KEY_ID']
    try:
        s3 = boto3.client(
            's3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=access_key,
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        )
    except Exception:
        return {
            'statusCode': 502,
            'headers': _cors(),
            'body': json.dumps(
                {'error': 'Не удалось сохранить фото на сервере. Попробуйте отправить заявку ещё раз через пару минут.'},
                ensure_ascii=False,
            ),
        }

    photo_urls = []
    for raw, content_type in decoded_photos:
        ext = ALLOWED_TYPES[content_type]
        key = f'shipment-requests/{secrets.token_hex(12)}.{ext}'
        try:
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
        photo_urls.append(f'https://cdn.poehali.dev/projects/{access_key}/bucket/{key}')

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

        tracking_number = _generate_tracking_number(cur, phone_digits, SCHEMA)
        if not tracking_number:
            return {
                'statusCode': 500,
                'headers': _cors(),
                'body': json.dumps({'error': 'Не удалось создать заявку, попробуйте ещё раз'}, ensure_ascii=False),
            }

        if city == 'suzdal':
            # В Суздале нет этапа подтверждения менеджером ВДНХ — заявка сразу видна
            # менеджеру Суздаля со статусом "В работе", он сам решает, когда отправить в Москву.
            status = 'in_progress'
        else:
            status = 'pending_review'

        cur.execute(
            f"INSERT INTO {SCHEMA}.shipments "
            f"(tracking_number, customer_name, customer_phone, customer_email, photo_url, "
            f"delivered_at, return_at, status, source, city, visit_date, requires_painting) "
            f"VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'client', %s, %s, %s) RETURNING id",
            (tracking_number, customer_name, customer_phone, customer_email, photo_urls[0],
             today, placeholder_return, status, city, visit_date, requires_painting),
        )
        shipment_id = cur.fetchone()[0]

        for idx, url in enumerate(photo_urls):
            cur.execute(
                f"INSERT INTO {SCHEMA}.shipment_photos (shipment_id, photo_url, sort_order) "
                f"VALUES (%s, %s, %s)",
                (shipment_id, url, idx),
            )
        conn.commit()

        return {
            'statusCode': 200,
            'headers': _cors(),
            'body': json.dumps(
                {'ok': True, 'trackingNumber': tracking_number},
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