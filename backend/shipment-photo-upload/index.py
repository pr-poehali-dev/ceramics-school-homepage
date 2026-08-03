import base64
import json
import os
import secrets

import boto3

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


def handler(event: dict, context) -> dict:
    '''
    Публичная загрузка одного фото для заявки клиента (shipment-request) в S3. Вынесена в
    отдельную лёгкую функцию, чтобы клиент отправлял каждое фото отдельным запросом —
    так форма с несколькими фото (до 10) не упирается в лимит размера тела HTTP-запроса
    на прокси (413 Payload Too Large), с которым сталкивался единый запрос со всеми фото
    сразу. Фронтенд сначала загружает все фото по одному через эту функцию, получая их
    CDN-ссылки, а затем отправляет уже готовые ссылки в shipment-request вместе с
    остальными данными заявки.
    POST { photoData (base64), contentType }
    Args: event с httpMethod, body
          context — объект с request_id
    Returns: HTTP-ответ с публичной CDN-ссылкой на загруженное фото, либо ошибкой
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'body': ''}

    if method != 'POST':
        return {'statusCode': 405, 'headers': _cors(), 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    photo_data = body.get('photoData') or ''
    content_type = body.get('contentType') or 'image/jpeg'

    if not photo_data:
        return {
            'statusCode': 400,
            'headers': _cors(),
            'body': json.dumps({'error': 'Фото не передано'}, ensure_ascii=False),
        }

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
            'body': json.dumps({'error': 'Фото должно быть не больше 8МБ'}, ensure_ascii=False),
        }

    ext = ALLOWED_TYPES[content_type]
    key = f'shipment-requests/{secrets.token_hex(12)}.{ext}'

    access_key = os.environ['AWS_ACCESS_KEY_ID']
    try:
        s3 = boto3.client(
            's3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=access_key,
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        )
        s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=content_type)
    except Exception:
        return {
            'statusCode': 502,
            'headers': _cors(),
            'body': json.dumps(
                {'error': 'Не удалось сохранить фото на сервере. Попробуйте ещё раз через пару минут.'},
                ensure_ascii=False,
            ),
        }

    photo_url = f'https://cdn.poehali.dev/projects/{access_key}/bucket/{key}'

    return {
        'statusCode': 200,
        'headers': _cors(),
        'body': json.dumps({'ok': True, 'url': photo_url}, ensure_ascii=False),
    }
