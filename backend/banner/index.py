import json
import os

import psycopg2

SCHEMA = 't_p90609946_ceramics_school_home'


def handler(event: dict, context) -> dict:
    '''
    Публичная функция: возвращает настройки информационной плашки (баннера) над шапкой сайта.
    GET — читает запись announcement_banner из site_settings и возвращает {enabled, text}.
    Args: event с httpMethod
          context — объект с request_id
    Returns: HTTP-ответ с {enabled: bool, text: str}
    '''
    method = event.get('httpMethod', 'GET')

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
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

    result = {'enabled': False, 'text': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute(
            f"SELECT value FROM {SCHEMA}.site_settings WHERE key = 'announcement_banner'"
        )
        row = cur.fetchone()
        if row and row[0]:
            value = row[0]
            result = {
                'enabled': bool(value.get('enabled', False)),
                'text': str(value.get('text', '')),
            }
    finally:
        conn.close()

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps(result, ensure_ascii=False),
    }
