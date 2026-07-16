import json
import os
import psycopg2
from orders_data import ORDERS as orders



def handler(event: dict, context) -> dict:
    '''
    Одноразовая техническая функция: импортирует исторические заказы из data.json
    в таблицу orders (source='legacy_import'). Защищена паролем ADMIN_PASSWORD.
    Args: event с httpMethod, headers (X-Admin-Password), queryStringParameters (offset, limit)
          context - объект с request_id
    Returns: HTTP-ответ с количеством вставленных строк
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

    headers = event.get('headers') or {}
    provided = headers.get('X-Admin-Password') or headers.get('x-admin-password') or ''
    expected = 'yIMJ_Kb-bdB17YAAyafl1B0sSIjsAL-8'
    if not expected or provided != expected:
        return {'statusCode': 401, 'headers': cors_headers, 'body': json.dumps({'error': 'Неверный пароль'})}

    params = event.get('queryStringParameters') or {}
    offset = int(params.get('offset', 0))
    limit = int(params.get('limit', 500))

    

    batch = orders[offset:offset + limit]

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    inserted = 0
    try:
        cur = conn.cursor()
        for o in batch:
            paid_at = o['created_at'] if o['status'] == 'paid' else None
            cur.execute(
                "INSERT INTO orders (number, customer_name, email, phone, comment, payment, total, "
                "items, created_at, status, paid_at, city, source) "
                "VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,'legacy_import')",
                (
                    o['number'], o['name'], '', o['phone'], o['comment'], o['payment'], o['total'],
                    json.dumps(o['items'], ensure_ascii=False), o['created_at'], o['status'],
                    paid_at, o['city'],
                ),
            )
            inserted += 1
        conn.commit()
    finally:
        conn.close()

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({
            'inserted': inserted,
            'offset': offset,
            'limit': limit,
            'total': len(orders),
            'done': offset + limit >= len(orders),
        }),
    }
