import json
import os
import re

import psycopg2

SCHEMA = 't_p90609946_ceramics_school_home'


def _normalize_phone(phone: str) -> str:
    """Оставляет только цифры номера телефона для сравнения."""
    digits = re.sub(r'\D', '', phone or '')
    if len(digits) == 11 and digits[0] == '8':
        digits = '7' + digits[1:]
    return digits


def handler(event: dict, context) -> dict:
    '''
    Публичный поиск активных посылок с готовыми керамическими изделиями по номеру телефона клиента.
    GET ?phone=+79991234567 — возвращает список посылок в статусе "shipped" (не выданных).
    Args: event с httpMethod, queryStringParameters
          context — объект с request_id
    Returns: HTTP-ответ со списком посылок клиента
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

    params = event.get('queryStringParameters') or {}
    phone_raw = params.get('phone') or ''
    phone_digits = _normalize_phone(phone_raw)

    if len(phone_digits) < 10:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Укажите корректный номер телефона'}, ensure_ascii=False),
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute(
            f"SELECT tracking_number, status, delivered_at, return_at "
            f"FROM {SCHEMA}.shipments "
            f"WHERE regexp_replace(customer_phone, '[^0-9]', '', 'g') LIKE %s "
            f"AND status = 'shipped' "
            f"ORDER BY delivered_at DESC",
            ('%' + phone_digits[-10:],),
        )
        rows = cur.fetchall()

        shipments = [
            {
                'trackingNumber': r[0],
                'status': r[1],
                'deliveredAt': r[2].isoformat() if r[2] else None,
                'returnAt': r[3].isoformat() if r[3] else None,
            }
            for r in rows
        ]

        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps({'shipments': shipments}, ensure_ascii=False),
        }
    finally:
        conn.close()
