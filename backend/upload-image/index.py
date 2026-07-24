import base64
import json
import os
import secrets

import boto3
import psycopg2


def _cors() -> dict:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
        'Access-Control-Max-Age': '86400',
    }


ALLOWED_TYPES = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
}

MAX_SIZE_BY_TYPE = {
    'video/mp4': 40 * 1024 * 1024,
    'video/webm': 40 * 1024 * 1024,
}
DEFAULT_MAX_SIZE = 8 * 1024 * 1024


def handler(event: dict, context) -> dict:
    '''
    Загружает картинку (base64) в S3 для использования в редактируемом контенте
    страниц сайта. Требует авторизации менеджера.
    Args: event с httpMethod, headers (X-Session-Token), body (fileData base64, contentType)
          context - объект с request_id
    Returns: HTTP-ответ с публичной CDN-ссылкой на загруженный файл
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'body': ''}

    if method != 'POST':
        return {'statusCode': 405, 'headers': _cors(), 'body': json.dumps({'error': 'Method not allowed'})}

    headers = event.get('headers') or {}
    token = headers.get('X-Session-Token') or headers.get('x-session-token') or ''
    if not token:
        return {'statusCode': 401, 'headers': _cors(), 'body': json.dumps({'error': 'Требуется авторизация'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT manager_id FROM manager_sessions WHERE token = %s AND expires_at > NOW()",
            (token,),
        )
        if not cur.fetchone():
            return {'statusCode': 401, 'headers': _cors(), 'body': json.dumps({'error': 'Сессия истекла, войдите снова'})}
    finally:
        conn.close()

    body = json.loads(event.get('body') or '{}')
    file_data = body.get('fileData') or ''
    content_type = body.get('contentType') or 'image/png'

    if content_type not in ALLOWED_TYPES:
        return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Недопустимый тип файла'})}

    if not file_data:
        return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Файл не передан'})}

    if ',' in file_data:
        file_data = file_data.split(',', 1)[1]

    try:
        raw = base64.b64decode(file_data)
    except Exception:
        return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Некорректные данные файла'})}

    max_size = MAX_SIZE_BY_TYPE.get(content_type, DEFAULT_MAX_SIZE)
    if len(raw) > max_size:
        return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': f'Файл больше {max_size // (1024 * 1024)}МБ'})}

    ext = ALLOWED_TYPES[content_type]
    key = f'page-content/{secrets.token_hex(12)}.{ext}'

    access_key = os.environ['AWS_ACCESS_KEY_ID']
    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=access_key,
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=content_type)

    cdn_url = f'https://cdn.poehali.dev/projects/{access_key}/bucket/{key}'

    return {
        'statusCode': 200,
        'headers': _cors(),
        'body': json.dumps({'ok': True, 'url': cdn_url}),
    }