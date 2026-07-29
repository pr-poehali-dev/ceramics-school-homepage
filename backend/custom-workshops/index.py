import json
import os
import re

import psycopg2

SCHEMA = 't_p90609946_ceramics_school_home'
ICON_RE = re.compile(r'^[A-Za-z0-9]+$')


def _cors() -> dict:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
        'Access-Control-Max-Age': '86400',
    }


def _slugify(text: str) -> str:
    """Транслитерирует русский текст в латиницу и приводит к формату URL-слага."""
    table = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'x', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    }
    result = []
    for ch in text.lower():
        if ch in table:
            result.append(table[ch])
        elif ch.isalnum() or ch == ' ' or ch == '-':
            result.append(ch)
    slug = ''.join(result)
    slug = re.sub(r'[^a-z0-9]+', '-', slug).strip('-')
    return slug[:150] or 'workshop'


def _row_dict(r):
    return {
        'id': r[0],
        'city': r[1],
        'slug': r[2],
        'label': r[3],
        'badgeIcon': r[4],
        'hidden': r[5],
        'sortOrder': r[6],
        'createdAt': r[7].isoformat() if r[7] else None,
    }


def handler(event: dict, context) -> dict:
    '''
    Реестр мастер-классов, добавленных вручную через админ-панель (сверх изначально
    зашитых в код). Публичный сайт подмешивает эти записи к статичному списку
    мастер-классов (в меню, подвале, на главной, странице списка и по прямой ссылке),
    контент самого мастер-класса (текст, цена, фото) хранится отдельно в page-content
    под ключом {city}-workshops-{slug}.
    GET — публично отдаёт список нескрытых мастер-классов (без авторизации, нужно для
      отображения на сайте). GET ?all=1 с валидным X-Session-Token — отдаёт все записи
      (включая скрытые) для админки.
    POST { action: 'create', city, label, badgeIcon } — создаёт новый мастер-класс,
      slug генерируется автоматически транслитерацией label (с проверкой на уникальность
      в рамках города), требует авторизации менеджера роли 'vdnh'.
    POST { action: 'toggle_hidden', id, hidden } — скрывает/показывает мастер-класс на
      сайте без удаления данных, требует авторизации.
    POST { action: 'delete', id } — полностью удаляет мастер-класс из реестра (контент
      в page-content остаётся, но перестаёт быть доступен со страниц сайта), требует
      авторизации.
    Args: event с httpMethod, headers (X-Session-Token), queryStringParameters, body
          context — объект с request_id
    Returns: HTTP-ответ со списком мастер-классов либо результатом операции
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
            want_all = params.get('all') == '1'

            if want_all:
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
                cur.execute(
                    f"SELECT id, city, slug, label, badge_icon, hidden, sort_order, created_at "
                    f"FROM {SCHEMA}.custom_workshops ORDER BY city, sort_order, created_at",
                )
            else:
                cur.execute(
                    f"SELECT id, city, slug, label, badge_icon, hidden, sort_order, created_at "
                    f"FROM {SCHEMA}.custom_workshops WHERE hidden = false ORDER BY city, sort_order, created_at",
                )
            rows = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': _cors(),
                'body': json.dumps({'workshops': [_row_dict(r) for r in rows]}, ensure_ascii=False),
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
        auth_row = cur.fetchone()
        if not auth_row:
            return {'statusCode': 401, 'headers': _cors(), 'body': json.dumps({'error': 'Сессия истекла, войдите снова'}, ensure_ascii=False)}
        manager_id = auth_row[0]

        body = json.loads(event.get('body') or '{}')
        action = body.get('action')

        if action == 'create':
            city = (body.get('city') or '').strip()
            label = (body.get('label') or '').strip()
            badge_icon = (body.get('badgeIcon') or 'Sparkles').strip()

            if city not in ('moscow', 'suzdal'):
                return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Укажите город: moscow или suzdal'}, ensure_ascii=False)}
            if not label:
                return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Укажите название мастер-класса'}, ensure_ascii=False)}
            if not ICON_RE.match(badge_icon):
                badge_icon = 'Sparkles'

            base_slug = _slugify(label)
            slug = base_slug
            for i in range(2, 50):
                cur.execute(
                    f"SELECT id FROM {SCHEMA}.custom_workshops WHERE city = %s AND slug = %s",
                    (city, slug),
                )
                if not cur.fetchone():
                    break
                slug = f'{base_slug}-{i}'

            cur.execute(
                f"SELECT COALESCE(MAX(sort_order), 0) FROM {SCHEMA}.custom_workshops WHERE city = %s",
                (city,),
            )
            next_order = (cur.fetchone()[0] or 0) + 1

            cur.execute(
                f"INSERT INTO {SCHEMA}.custom_workshops (city, slug, label, badge_icon, sort_order, created_by) "
                f"VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                (city, slug, label, badge_icon, next_order, manager_id),
            )
            new_id = cur.fetchone()[0]
            conn.commit()

            return {
                'statusCode': 200,
                'headers': _cors(),
                'body': json.dumps({'ok': True, 'id': new_id, 'slug': slug, 'city': city}, ensure_ascii=False),
            }

        if action == 'toggle_hidden':
            workshop_id = body.get('id')
            hidden = bool(body.get('hidden'))
            if not workshop_id:
                return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Не указан мастер-класс'}, ensure_ascii=False)}
            cur.execute(
                f"UPDATE {SCHEMA}.custom_workshops SET hidden = %s, updated_at = NOW() WHERE id = %s",
                (hidden, workshop_id),
            )
            if cur.rowcount == 0:
                return {'statusCode': 404, 'headers': _cors(), 'body': json.dumps({'error': 'Мастер-класс не найден'}, ensure_ascii=False)}
            conn.commit()
            return {'statusCode': 200, 'headers': _cors(), 'body': json.dumps({'ok': True}, ensure_ascii=False)}

        if action == 'delete':
            workshop_id = body.get('id')
            if not workshop_id:
                return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Не указан мастер-класс'}, ensure_ascii=False)}
            cur.execute(f"DELETE FROM {SCHEMA}.custom_workshops WHERE id = %s", (workshop_id,))
            if cur.rowcount == 0:
                return {'statusCode': 404, 'headers': _cors(), 'body': json.dumps({'error': 'Мастер-класс не найден'}, ensure_ascii=False)}
            conn.commit()
            return {'statusCode': 200, 'headers': _cors(), 'body': json.dumps({'ok': True}, ensure_ascii=False)}

        return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Неизвестное действие'}, ensure_ascii=False)}
    finally:
        conn.close()
