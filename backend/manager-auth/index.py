import hashlib
import hmac
import json
import os
import secrets
from datetime import datetime, timedelta

import psycopg2


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        algo, iterations, salt_hex, hash_hex = stored_hash.split('$')
        iterations = int(iterations)
        salt = bytes.fromhex(salt_hex)
        expected = bytes.fromhex(hash_hex)
    except ValueError:
        return False
    dk = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, iterations)
    return hmac.compare_digest(dk, expected)


def handler(event: dict, context) -> dict:
    '''
    Авторизация менеджера по email и паролю для доступа к /admin.
    POST { email, password } — проверяет учётные данные, создаёт сессию, возвращает token.
    GET с заголовком X-Session-Token — проверяет валидность текущей сессии.
    Args: event с httpMethod, headers, body
          context — объект с request_id
    Returns: HTTP-ответ с token и данными менеджера, либо ошибкой
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

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()

        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''

            if not email or not password:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Укажите email и пароль'}),
                }

            cur.execute(
                "SELECT id, password_hash, name FROM managers WHERE lower(email) = %s",
                (email,),
            )
            row = cur.fetchone()

            if not row or not verify_password(password, row[1]):
                return {
                    'statusCode': 401,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Неверный email или пароль'}),
                }

            manager_id, _, name = row
            token = secrets.token_hex(32)
            expires_at = datetime.utcnow() + timedelta(days=30)

            cur.execute(
                "INSERT INTO manager_sessions (manager_id, token, expires_at) VALUES (%s, %s, %s)",
                (manager_id, token, expires_at),
            )
            conn.commit()

            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'token': token, 'email': email, 'name': name}),
            }

        if method == 'GET':
            headers = event.get('headers') or {}
            token = headers.get('X-Session-Token') or headers.get('x-session-token') or ''

            if not token:
                return {
                    'statusCode': 401,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Нет токена'}),
                }

            cur.execute(
                "SELECT m.email, m.name FROM manager_sessions s "
                "JOIN managers m ON m.id = s.manager_id "
                "WHERE s.token = %s AND s.expires_at > NOW()",
                (token,),
            )
            row = cur.fetchone()

            if not row:
                return {
                    'statusCode': 401,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Сессия истекла, войдите снова'}),
                }

            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'email': row[0], 'name': row[1]}),
            }

        return {
            'statusCode': 405,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Method not allowed'}),
        }
    finally:
        conn.close()
