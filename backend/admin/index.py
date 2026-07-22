import json
import os
import psycopg2

SCHEMA = 't_p90609946_ceramics_school_home'


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
            certificate_number = (body.get('certificate_number') or '').strip()

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
            "created_at, status, city, certificate_number "
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