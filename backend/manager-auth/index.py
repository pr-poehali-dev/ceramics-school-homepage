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
    Авторизация менеджера по email и паролю. Используется и панелью /admin (роль 'vdnh'),
    и панелью /manager (роль 'suzdal') — общая таблица managers, разные фронтенд-роуты.
    POST { email, password, portal } — проверяет учётные данные и что роль соответствует
      порталу ('admin' требует role='vdnh', 'manager' требует role='suzdal'), создаёт сессию.
    GET с заголовком X-Session-Token — проверяет валидность текущей сессии, возвращает role.
    Args: event с httpMethod, headers, body
          context — объект с request_id
    Returns: HTTP-ответ с token, email, name, role менеджера, либо ошибкой
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
            # portal: 'admin' (панель ВДНХ) или 'manager' (панель Суздаля) — ограничивает вход по роли
            portal = body.get('portal') or ''

            if not email or not password:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Укажите email и пароль'}),
                }

            cur.execute(
                "SELECT id, password_hash, name, role FROM managers WHERE lower(email) = %s",
                (email,),
            )
            row = cur.fetchone()

            if not row or not verify_password(password, row[1]):
                return {
                    'statusCode': 401,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Неверный email или пароль'}),
                }

            manager_id, _, name, role = row

            if portal == 'admin' and role != 'vdnh':
                return {
                    'statusCode': 403,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'У вас нет доступа к этой панели'}),
                }
            if portal == 'manager' and role != 'suzdal':
                return {
                    'statusCode': 403,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'У вас нет доступа к этой панели'}),
                }

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
                'body': json.dumps({'token': token, 'email': email, 'name': name, 'role': role}),
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
                "SELECT m.email, m.name, m.role FROM manager_sessions s "
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
                'body': json.dumps({'email': row[0], 'name': row[1], 'role': row[2]}),
            }

        return {
            'statusCode': 405,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Method not allowed'}),
        }
    finally:
        conn.close()