import json
import os
import re

import psycopg2

SCHEMA = 't_p90609946_ceramics_school_home'


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
    return slug[:190] or 'post'


def _row_dict(r, full=True):
    d = {
        'id': r[0],
        'slug': r[1],
        'title': r[2],
        'excerpt': r[3],
        'coverImage': r[5],
        'published': r[6],
        'createdAt': r[7].isoformat() if r[7] else None,
        'updatedAt': r[8].isoformat() if r[8] else None,
        'publishedAt': r[9].isoformat() if r[9] else None,
    }
    if full:
        d['content'] = r[4]
    return d


def _auth_manager(cur, headers) -> int | None:
    """Проверяет X-Session-Token, возвращает manager_id для роли 'vdnh', либо None."""
    token = headers.get('X-Session-Token') or headers.get('x-session-token') or ''
    if not token:
        return None
    cur.execute(
        f"SELECT m.id FROM {SCHEMA}.manager_sessions s "
        f"JOIN {SCHEMA}.managers m ON m.id = s.manager_id "
        f"WHERE s.token = %s AND s.expires_at > NOW() AND m.role = 'vdnh'",
        (token,),
    )
    row = cur.fetchone()
    return row[0] if row else None


def handler(event: dict, context) -> dict:
    '''
    Статьи и новости блога сайта (общий блог на Москву и Суздаль). Управляется менеджером
    ВДНХ через раздел админки «Блог».
    GET — публично отдаёт список опубликованных статей (без содержимого, только превью),
      отсортированных по дате публикации. GET ?slug=... — отдаёт одну опубликованную статью
      с полным содержимым (для страницы статьи). GET ?all=1 с валидным X-Session-Token —
      отдаёт все статьи (включая черновики) для админки.
    POST { action: 'create', title, excerpt, content, coverImage } — создаёт статью
      (изначально черновик, published=false), slug генерируется автоматически из title.
    POST { action: 'update', id, title, excerpt, content, coverImage } — редактирует статью.
    POST { action: 'toggle_published', id, published } — публикует/снимает с публикации,
      при первой публикации проставляет published_at.
    POST { action: 'delete', id } — удаляет статью.
    Все POST-действия требуют авторизации менеджера роли 'vdnh'.
    Args: event с httpMethod, headers (X-Session-Token), queryStringParameters, body
          context — объект с request_id
    Returns: HTTP-ответ со списком/статьёй либо результатом операции
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
            slug = (params.get('slug') or '').strip()
            want_all = params.get('all') == '1'

            if slug:
                cur.execute(
                    f"SELECT id, slug, title, excerpt, content, cover_image, published, "
                    f"created_at, updated_at, published_at "
                    f"FROM {SCHEMA}.blog_posts WHERE slug = %s AND published = true",
                    (slug,),
                )
                row = cur.fetchone()
                if not row:
                    return {'statusCode': 404, 'headers': _cors(), 'body': json.dumps({'error': 'Статья не найдена'}, ensure_ascii=False)}
                return {'statusCode': 200, 'headers': _cors(), 'body': json.dumps({'post': _row_dict(row)}, ensure_ascii=False)}

            if want_all:
                headers = event.get('headers') or {}
                if not _auth_manager(cur, headers):
                    return {'statusCode': 401, 'headers': _cors(), 'body': json.dumps({'error': 'Требуется авторизация'}, ensure_ascii=False)}
                cur.execute(
                    f"SELECT id, slug, title, excerpt, content, cover_image, published, "
                    f"created_at, updated_at, published_at "
                    f"FROM {SCHEMA}.blog_posts ORDER BY created_at DESC",
                )
            else:
                cur.execute(
                    f"SELECT id, slug, title, excerpt, content, cover_image, published, "
                    f"created_at, updated_at, published_at "
                    f"FROM {SCHEMA}.blog_posts WHERE published = true "
                    f"ORDER BY published_at DESC LIMIT 200",
                )
            rows = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': _cors(),
                'body': json.dumps({'posts': [_row_dict(r, full=want_all) for r in rows]}, ensure_ascii=False),
            }

        # POST — требует авторизации менеджера ВДНХ
        headers = event.get('headers') or {}
        manager_id = _auth_manager(cur, headers)
        if not manager_id:
            return {'statusCode': 401, 'headers': _cors(), 'body': json.dumps({'error': 'Требуется авторизация'}, ensure_ascii=False)}

        body = json.loads(event.get('body') or '{}')
        action = body.get('action')

        if action == 'create':
            title = (body.get('title') or '').strip()
            excerpt = (body.get('excerpt') or '').strip()
            content = (body.get('content') or '').strip()
            cover_image = (body.get('coverImage') or '').strip() or None

            if not title:
                return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Укажите заголовок статьи'}, ensure_ascii=False)}

            base_slug = _slugify(title)
            slug = base_slug
            for i in range(2, 50):
                cur.execute(f"SELECT id FROM {SCHEMA}.blog_posts WHERE slug = %s", (slug,))
                if not cur.fetchone():
                    break
                slug = f'{base_slug}-{i}'

            cur.execute(
                f"INSERT INTO {SCHEMA}.blog_posts (slug, title, excerpt, content, cover_image, created_by) "
                f"VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                (slug, title, excerpt or None, content, cover_image, manager_id),
            )
            new_id = cur.fetchone()[0]
            conn.commit()

            return {'statusCode': 200, 'headers': _cors(), 'body': json.dumps({'ok': True, 'id': new_id, 'slug': slug}, ensure_ascii=False)}

        if action == 'update':
            post_id = body.get('id')
            title = (body.get('title') or '').strip()
            excerpt = (body.get('excerpt') or '').strip()
            content = (body.get('content') or '').strip()
            cover_image = (body.get('coverImage') or '').strip() or None

            if not post_id:
                return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Не указана статья'}, ensure_ascii=False)}
            if not title:
                return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Укажите заголовок статьи'}, ensure_ascii=False)}

            cur.execute(
                f"UPDATE {SCHEMA}.blog_posts SET title = %s, excerpt = %s, content = %s, "
                f"cover_image = %s, updated_at = NOW() WHERE id = %s",
                (title, excerpt or None, content, cover_image, post_id),
            )
            if cur.rowcount == 0:
                return {'statusCode': 404, 'headers': _cors(), 'body': json.dumps({'error': 'Статья не найдена'}, ensure_ascii=False)}
            conn.commit()
            return {'statusCode': 200, 'headers': _cors(), 'body': json.dumps({'ok': True}, ensure_ascii=False)}

        if action == 'toggle_published':
            post_id = body.get('id')
            published = bool(body.get('published'))
            if not post_id:
                return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Не указана статья'}, ensure_ascii=False)}

            if published:
                cur.execute(
                    f"UPDATE {SCHEMA}.blog_posts SET published = true, "
                    f"published_at = COALESCE(published_at, NOW()), updated_at = NOW() WHERE id = %s",
                    (post_id,),
                )
            else:
                cur.execute(
                    f"UPDATE {SCHEMA}.blog_posts SET published = false, updated_at = NOW() WHERE id = %s",
                    (post_id,),
                )
            if cur.rowcount == 0:
                return {'statusCode': 404, 'headers': _cors(), 'body': json.dumps({'error': 'Статья не найдена'}, ensure_ascii=False)}
            conn.commit()
            return {'statusCode': 200, 'headers': _cors(), 'body': json.dumps({'ok': True}, ensure_ascii=False)}

        if action == 'delete':
            post_id = body.get('id')
            if not post_id:
                return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Не указана статья'}, ensure_ascii=False)}
            cur.execute(f"DELETE FROM {SCHEMA}.blog_posts WHERE id = %s", (post_id,))
            if cur.rowcount == 0:
                return {'statusCode': 404, 'headers': _cors(), 'body': json.dumps({'error': 'Статья не найдена'}, ensure_ascii=False)}
            conn.commit()
            return {'statusCode': 200, 'headers': _cors(), 'body': json.dumps({'ok': True}, ensure_ascii=False)}

        return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Неизвестное действие'}, ensure_ascii=False)}
    finally:
        conn.close()