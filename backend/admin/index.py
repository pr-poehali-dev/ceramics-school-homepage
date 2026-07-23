import json
import os
import base64
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import psycopg2

SCHEMA = 't_p90609946_ceramics_school_home'
YOOKASSA_API_URL = "https://api.yookassa.ru/v3/payments"


def _check_yookassa_payment(payment_id: str) -> dict | None:
    """Запрашивает у ЮKassa реальный статус платежа по его id."""
    shop_id = os.environ.get('YOOKASSA_SHOP_ID', '')
    secret_key = os.environ.get('YOOKASSA_SECRET_KEY', '')
    if not shop_id or not secret_key or not payment_id:
        return None

    auth_bytes = base64.b64encode(f"{shop_id}:{secret_key}".encode()).decode()
    request = Request(
        f"{YOOKASSA_API_URL}/{payment_id}",
        headers={'Authorization': f'Basic {auth_bytes}', 'Content-Type': 'application/json'},
        method='GET',
    )
    try:
        with urlopen(request, timeout=10) as response:
            return json.loads(response.read().decode())
    except (HTTPError, Exception):
        return None


def handler(event: dict, context) -> dict:
    '''
    Возвращает список заказов и заявок для админ-панели, либо сохраняет номер
    сертификата, проданного клиенту по заказу (POST).
    Доступ защищён сессионным токеном менеджера: заголовок X-Session-Token должен
    соответствовать активной записи в таблице manager_sessions.
    Args: event с httpMethod, headers (X-Session-Token), body (для POST: order_id, certificate_number)
          context - объект с request_id
    Returns: HTTP-ответ со списками orders и leads, либо результатом сохранения
    '''
    method = event.get('httpMethod', 'GET')

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if method not in ('GET', 'POST'):
        return {
            'statusCode': 405,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    headers = event.get('headers') or {}
    token = headers.get('X-Session-Token') or headers.get('x-session-token') or ''

    if not token:
        return {
            'statusCode': 401,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Требуется авторизация'}),
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()

        cur.execute(
            "SELECT manager_id FROM manager_sessions WHERE token = %s AND expires_at > NOW()",
            (token,),
        )
        if not cur.fetchone():
            return {
                'statusCode': 401,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Сессия истекла, войдите снова'}),
            }

        if method == 'POST':
            body = json.loads(event.get('body') or '{}')

            if body.get('action') == 'check_payment':
                order_id = body.get('order_id')
                if not order_id:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Не указан заказ'}),
                    }

                cur.execute(
                    "SELECT status, yookassa_payment_id FROM orders WHERE id = %s",
                    (order_id,),
                )
                row = cur.fetchone()
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Заказ не найден'}),
                    }

                current_status, payment_id = row
                if not payment_id:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'У заказа нет привязанного платежа ЮKassa'}),
                    }

                payment = _check_yookassa_payment(payment_id)
                if not payment:
                    return {
                        'statusCode': 502,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Не удалось получить статус от ЮKassa'}),
                    }

                yk_status = payment.get('status', '')
                new_status = current_status
                now = datetime.utcnow().isoformat()

                if yk_status == 'succeeded' and current_status != 'paid':
                    cur.execute(
                        "UPDATE orders SET status = 'paid', paid_at = %s, updated_at = %s WHERE id = %s",
                        (now, now, order_id),
                    )
                    conn.commit()
                    new_status = 'paid'
                elif yk_status == 'canceled' and current_status not in ('paid', 'canceled'):
                    cur.execute(
                        "UPDATE orders SET status = 'canceled', updated_at = %s WHERE id = %s",
                        (now, order_id),
                    )
                    conn.commit()
                    new_status = 'canceled'

                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({
                        'ok': True,
                        'order_id': order_id,
                        'yookassa_status': yk_status,
                        'status': new_status,
                    }, ensure_ascii=False),
                }

            if 'banner' in body:
                banner = body.get('banner') or {}
                value = {
                    'enabled': bool(banner.get('enabled', False)),
                    'text': str(banner.get('text', '')),
                }
                cur.execute(
                    f"INSERT INTO {SCHEMA}.site_settings (key, value, updated_at) "
                    "VALUES ('announcement_banner', %s, NOW()) "
                    "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
                    (json.dumps(value),),
                )
                conn.commit()
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'ok': True, 'banner': value}, ensure_ascii=False),
                }

            order_id = body.get('order_id')
            raw_certificate_number = (body.get('certificate_number') or '').strip()
            # Несколько номеров сертификатов вводятся через запятую — нормализуем пробелы
            certificate_number = ', '.join(
                part.strip() for part in raw_certificate_number.split(',') if part.strip()
            )

            if not order_id:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Не указан заказ'}),
                }

            cur.execute(
                "UPDATE orders SET certificate_number = %s WHERE id = %s",
                (certificate_number or None, order_id),
            )
            conn.commit()

            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'ok': True, 'certificate_number': certificate_number}),
            }

        cur.execute(
            "SELECT id, number, customer_name, email, phone, comment, payment, total, items, "
            "created_at, status, city, certificate_number, yookassa_payment_id "
            "FROM orders ORDER BY created_at DESC LIMIT 500"
        )
        orders = []
        for r in cur.fetchall():
            orders.append({
                'id': r[0],
                'number': r[1],
                'name': r[2],
                'email': r[3],
                'phone': r[4],
                'comment': r[5],
                'payment': r[6],
                'total': r[7],
                'items': r[8],
                'created_at': r[9].isoformat() if r[9] else None,
                'status': r[10],
                'city': r[11],
                'certificate_number': r[12],
                'yookassa_payment_id': r[13],
            })

        cur.execute(
            "SELECT id, service, people, email, phone, created_at "
            "FROM leads ORDER BY created_at DESC LIMIT 500"
        )
        leads = []
        for r in cur.fetchall():
            leads.append({
                'id': r[0],
                'service': r[1],
                'people': r[2],
                'email': r[3],
                'phone': r[4],
                'created_at': r[5].isoformat() if r[5] else None,
            })

        banner = {'enabled': False, 'text': ''}
        cur.execute(
            f"SELECT value FROM {SCHEMA}.site_settings WHERE key = 'announcement_banner'"
        )
        brow = cur.fetchone()
        if brow and brow[0]:
            banner = {
                'enabled': bool(brow[0].get('enabled', False)),
                'text': str(brow[0].get('text', '')),
            }
    finally:
        conn.close()

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'orders': orders, 'leads': leads, 'banner': banner}, ensure_ascii=False),
    }