import json
import os
import psycopg2

SCHEMA = 't_p90609946_ceramics_school_home'


def _cors() -> dict:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
        'Access-Control-Max-Age': '86400',
    }


def handler(event: dict, context) -> dict:
    '''
    Хранит редактируемый контент страниц сайта (тексты, цены, картинки) для
    самостоятельной правки через админ-панель без участия разработчика.
    GET ?key=<page_key> — публично отдаёт сохранённые поля страницы (без авторизации,
        нужно для отображения контента на живом сайте). Без key — список всех страниц.
    POST { key, title, fields } — сохраняет контент страницы, требует заголовок
        X-Session-Token с валидной сессией менеджера.
    Args: event с httpMethod, queryStringParameters, headers, body
          context - объект с request_id
    Returns: HTTP-ответ с полями страницы либо результатом сохранения
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'body': ''}

    if method not in ('GET', 'POST'):
        return {'statusCode': 405, 'headers': _cors(), 'body': json.dumps({'error': 'Method not allowed'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()

        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            key = (params.get('key') or '').strip()

            if key:
                cur.execute(
                    f"SELECT page_key, title, fields, updated_at FROM {SCHEMA}.page_content WHERE page_key = %s",
                    (key,),
                )
                row = cur.fetchone()
                if not row:
                    return {
                        'statusCode': 200,
                        'headers': _cors(),
                        'body': json.dumps({'key': key, 'title': '', 'fields': {}}, ensure_ascii=False),
                    }
                return {
                    'statusCode': 200,
                    'headers': _cors(),
                    'body': json.dumps({
                        'key': row[0],
                        'title': row[1],
                        'fields': row[2],
                        'updated_at': row[3].isoformat() if row[3] else None,
                    }, ensure_ascii=False),
                }

            cur.execute(f"SELECT page_key, title, updated_at FROM {SCHEMA}.page_content ORDER BY page_key")
            pages = [
                {'key': r[0], 'title': r[1], 'updated_at': r[2].isoformat() if r[2] else None}
                for r in cur.fetchall()
            ]
            return {
                'statusCode': 200,
                'headers': _cors(),
                'body': json.dumps({'pages': pages}, ensure_ascii=False),
            }

        # POST — требует авторизации менеджера
        headers = event.get('headers') or {}
        token = headers.get('X-Session-Token') or headers.get('x-session-token') or ''
        if not token:
            return {'statusCode': 401, 'headers': _cors(), 'body': json.dumps({'error': 'Требуется авторизация'})}

        cur.execute(
            "SELECT manager_id FROM manager_sessions WHERE token = %s AND expires_at > NOW()",
            (token,),
        )
        if not cur.fetchone():
            return {'statusCode': 401, 'headers': _cors(), 'body': json.dumps({'error': 'Сессия истекла, войдите снова'})}

        body = json.loads(event.get('body') or '{}')
        key = (body.get('key') or '').strip()
        title = (body.get('title') or '').strip()
        fields = body.get('fields') or {}

        if not key:
            return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Не указан ключ страницы'})}

        cur.execute(
            f"INSERT INTO {SCHEMA}.page_content (page_key, title, fields, updated_at) "
            "VALUES (%s, %s, %s, NOW()) "
            "ON CONFLICT (page_key) DO UPDATE SET title = EXCLUDED.title, fields = EXCLUDED.fields, updated_at = NOW()",
            (key, title, json.dumps(fields)),
        )
        conn.commit()

        return {
            'statusCode': 200,
            'headers': _cors(),
            'body': json.dumps({'ok': True, 'key': key}, ensure_ascii=False),
        }
    finally:
        conn.close()
