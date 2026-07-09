import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    '''
    Сохраняет оформленный на сайте заказ в базу данных.
    Args: event с httpMethod, body (JSON: number, name, email, phone, comment, payment, total, items)
          context — объект с request_id
    Returns: HTTP-ответ с результатом сохранения
    '''
    method = event.get('httpMethod', 'GET')

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Invalid JSON'}),
        }

    number = str(body.get('number') or '')
    name = (body.get('name') or '').strip()
    email = (body.get('email') or '').strip()
    phone = (body.get('phone') or '').strip()
    comment = (body.get('comment') or '').strip()
    payment = (body.get('payment') or '').strip()
    total = int(body.get('total') or 0)
    items = body.get('items') or []

    if not name or not email or not phone:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Обязательные поля не заполнены'}),
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO orders (number, customer_name, email, phone, comment, payment, total, items) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (number, name, email, phone, comment, payment, total, json.dumps(items, ensure_ascii=False)),
        )
        order_id = cur.fetchone()[0]
        conn.commit()
    finally:
        conn.close()

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'success': True, 'id': order_id}),
    }
