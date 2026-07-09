import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    '''
    Возвращает список заказов и заявок для админ-панели.
    Доступ защищён паролем: заголовок X-Admin-Password должен совпадать с секретом ADMIN_PASSWORD.
    Args: event с httpMethod, headers (X-Admin-Password)
          context — объект с request_id
    Returns: HTTP-ответ со списками orders и leads
    '''
    method = event.get('httpMethod', 'GET')

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    headers = event.get('headers') or {}
    provided = headers.get('X-Admin-Password') or headers.get('x-admin-password') or ''
    expected = os.environ.get('ADMIN_PASSWORD') or ''

    if not expected or provided != expected:
        return {
            'statusCode': 401,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Неверный пароль'}),
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, number, customer_name, email, phone, comment, payment, total, items, created_at "
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
    finally:
        conn.close()

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'orders': orders, 'leads': leads}, ensure_ascii=False),
    }
