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
    Хранит кастомные тексты (тема + текст письма) для email-рассылок сайта — позволяет
    менеджеру ВДНХ править формулировки прямо в админке без участия разработчика.
    Если для template_key нет сохранённой записи — соответствующая backend-функция
    использует текст по умолчанию, зашитый в её коде.
    GET ?key=<template_key> — отдаёт сохранённый шаблон { subject, body } либо {} если
      правок ещё не было. Публично, без авторизации (нужно самим функциям отправки писем).
    GET без key — список всех сохранённых шаблонов (для админки), требует X-Session-Token
      с ролью 'vdnh'.
    POST { key, subject, body } — сохраняет кастомный текст письма, требует X-Session-Token
      с ролью 'vdnh'.
    POST { key, reset: true } — удаляет кастомный текст, письмо возвращается к тексту
      по умолчанию из кода, требует X-Session-Token с ролью 'vdnh'.
    Args: event с httpMethod, queryStringParameters, headers, body
          context — объект с request_id
    Returns: HTTP-ответ с шаблоном письма либо результатом сохранения
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
                    f"SELECT subject, body, updated_at FROM {SCHEMA}.email_templates WHERE template_key = %s",
                    (key,),
                )
                row = cur.fetchone()
                if not row:
                    return {'statusCode': 200, 'headers': _cors(), 'body': json.dumps({}, ensure_ascii=False)}
                return {
                    'statusCode': 200,
                    'headers': _cors(),
                    'body': json.dumps({
                        'subject': row[0],
                        'body': row[1],
                        'updatedAt': row[2].isoformat() if row[2] else None,
                    }, ensure_ascii=False),
                }

            headers = event.get('headers') or {}
            token = headers.get('X-Session-Token') or headers.get('x-session-token') or ''
            if not token:
                return {'statusCode': 401, 'headers': _cors(), 'body': json.dumps({'error': 'Требуется авторизация'}, ensure_ascii=False)}
            cur.execute(
                f"SELECT m.id FROM {SCHEMA}.manager_sessions s "
                f"JOIN {SCHEMA}.managers m ON m.id = s.manager_id "
                f"WHERE s.token = %s AND s.expires_at > NOW() AND m.role = 'vdnh'",
                (token,),
            )
            if not cur.fetchone():
                return {'statusCode': 401, 'headers': _cors(), 'body': json.dumps({'error': 'Сессия истекла, войдите снова'}, ensure_ascii=False)}

            cur.execute(f"SELECT template_key, subject, body, updated_at FROM {SCHEMA}.email_templates")
            templates = {
                r[0]: {'subject': r[1], 'body': r[2], 'updatedAt': r[3].isoformat() if r[3] else None}
                for r in cur.fetchall()
            }
            return {
                'statusCode': 200,
                'headers': _cors(),
                'body': json.dumps({'templates': templates}, ensure_ascii=False),
            }

        # POST — требует авторизации менеджера ВДНХ
        headers = event.get('headers') or {}
        token = headers.get('X-Session-Token') or headers.get('x-session-token') or ''
        if not token:
            return {'statusCode': 401, 'headers': _cors(), 'body': json.dumps({'error': 'Требуется авторизация'}, ensure_ascii=False)}
        cur.execute(
            f"SELECT m.id FROM {SCHEMA}.manager_sessions s "
            f"JOIN {SCHEMA}.managers m ON m.id = s.manager_id "
            f"WHERE s.token = %s AND s.expires_at > NOW() AND m.role = 'vdnh'",
            (token,),
        )
        if not cur.fetchone():
            return {'statusCode': 401, 'headers': _cors(), 'body': json.dumps({'error': 'Сессия истекла, войдите снова'}, ensure_ascii=False)}

        body = json.loads(event.get('body') or '{}')
        key = (body.get('key') or '').strip()
        if not key:
            return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Не указан ключ шаблона'}, ensure_ascii=False)}

        if body.get('reset'):
            cur.execute(f"DELETE FROM {SCHEMA}.email_templates WHERE template_key = %s", (key,))
            conn.commit()
            return {'statusCode': 200, 'headers': _cors(), 'body': json.dumps({'ok': True}, ensure_ascii=False)}

        subject = (body.get('subject') or '').strip()
        text = (body.get('body') or '').strip()
        if not subject or not text:
            return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Тема и текст письма обязательны'}, ensure_ascii=False)}

        cur.execute(
            f"INSERT INTO {SCHEMA}.email_templates (template_key, subject, body, updated_at) "
            "VALUES (%s, %s, %s, NOW()) "
            "ON CONFLICT (template_key) DO UPDATE SET subject = EXCLUDED.subject, body = EXCLUDED.body, updated_at = NOW()",
            (key, subject, text),
        )
        conn.commit()

        return {
            'statusCode': 200,
            'headers': _cors(),
            'body': json.dumps({'ok': True}, ensure_ascii=False),
        }
    finally:
        conn.close()
