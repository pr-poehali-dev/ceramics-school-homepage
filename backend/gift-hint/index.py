import json
import os
import re
import smtplib
import ssl
from email.header import Header
from email.mime.text import MIMEText

import psycopg2

SCHEMA = 't_p90609946_ceramics_school_home'


def _cors() -> dict:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
        'Access-Control-Max-Age': '86400',
    }


def _row_dict(r):
    return {
        'id': r[0],
        'senderName': r[1],
        'recipientName': r[2],
        'recipientEmail': r[3],
        'recipientContact': r[4],
        'giftType': r[5],
        'giftSlug': r[6],
        'giftLabel': r[7],
        'message': r[8],
        'emailSent': r[9],
        'emailError': r[10],
        'city': r[11],
        'createdAt': r[12].isoformat() if r[12] else None,
    }


def _send_gift_hint_email(recipient_email: str, sender_name: str, message: str) -> None:
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT') or 465)
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')

    missing = [
        name for name, val in [
            ('SMTP_HOST', smtp_host), ('SMTP_USER', smtp_user),
            ('SMTP_PASSWORD', smtp_password),
        ] if not val
    ]
    if missing:
        raise RuntimeError(f"Не заданы параметры: {', '.join(missing)}")

    text = (
        'Здравствуйте!\n\n'
        'Это письмо — тайный намёк от человека, которому Вы небезразличны.\n\n'
        'В ближайшее время Вас ждёт приятный сюрприз. Что это будет — пока секрет. '
        'Но обещаем: Вам точно понравится.\n\n'
        'Осталось совсем немного — и Вы узнаете всё сами.\n\n'
        'А пока просто знайте: кто-то очень хочет Вас порадовать.\n\n'
        'С уважением и самыми тёплыми пожеланиями,\n'
        'Ваш тайный отправитель'
    )

    if message.strip():
        text += f'\n\n---\n\nОтправитель просил передать: «{message.strip()}»'

    msg = MIMEText(text, 'plain', 'utf-8')
    msg['Subject'] = Header('Вам письмо — маленький секрет...', 'utf-8')
    msg['From'] = smtp_user
    msg['To'] = recipient_email

    context_ssl = ssl.create_default_context()
    if smtp_port == 465:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context_ssl) as server:
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [recipient_email], msg.as_string())
    else:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls(context=context_ssl)
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [recipient_email], msg.as_string())


def handler(event: dict, context) -> dict:
    '''
    Форма "Намекнуть на подарок": клиент отправляет близкому анонимное письмо-намёк
    про мастер-класс или сертификат, который хочет получить в подарок. Если указан
    email получателя — письмо отправляется реально; если указана только ссылка на
    мессенджер — она сохраняется для менеджера (сама отправка в мессенджер не
    автоматизирована). Согласие на обработку персональных данных обязательно —
    в будущем по этой базе будут отправляться другие триггерные письма.
    POST { senderName, recipientName, recipientEmail, recipientContact, giftType
      ('workshop'|'certificate'), giftSlug, giftLabel, message, consent, city } —
      сохраняет заявку и отправляет письмо (если указан recipientEmail).
    GET ?all=1 с заголовком X-Session-Token (роль 'vdnh') — список всех заявок для админки.
    Args: event с httpMethod, headers, queryStringParameters, body
          context — объект с request_id
    Returns: HTTP-ответ с результатом отправки либо списком заявок
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
                f"SELECT id, sender_name, recipient_name, recipient_email, recipient_contact, "
                f"gift_type, gift_slug, gift_label, message, email_sent, email_error, city, created_at "
                f"FROM {SCHEMA}.gift_hints ORDER BY created_at DESC LIMIT 500",
            )
            rows = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': _cors(),
                'body': json.dumps({'hints': [_row_dict(r) for r in rows]}, ensure_ascii=False),
            }

        # POST — публичная отправка намёка
        body = json.loads(event.get('body') or '{}')
        sender_name = (body.get('senderName') or '').strip()
        recipient_name = (body.get('recipientName') or '').strip()
        recipient_email = (body.get('recipientEmail') or '').strip()
        recipient_contact = (body.get('recipientContact') or '').strip()
        gift_type = (body.get('giftType') or '').strip()
        gift_slug = (body.get('giftSlug') or '').strip() or None
        gift_label = (body.get('giftLabel') or '').strip()
        message = (body.get('message') or '').strip()
        consent = bool(body.get('consent'))
        city = (body.get('city') or 'moscow').strip()

        if not sender_name or not recipient_name:
            return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Укажите имя отправителя и получателя'}, ensure_ascii=False)}
        if gift_type not in ('workshop', 'certificate'):
            return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Не указан тип подарка'}, ensure_ascii=False)}
        if not gift_label:
            return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Не указан подарок'}, ensure_ascii=False)}
        if not recipient_email and not recipient_contact:
            return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Укажите email получателя или ссылку на мессенджер'}, ensure_ascii=False)}
        if recipient_email and not re.match(r'^\S+@\S+\.\S+$', recipient_email):
            return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Некорректный email получателя'}, ensure_ascii=False)}
        if not consent:
            return {'statusCode': 400, 'headers': _cors(), 'body': json.dumps({'error': 'Нужно согласие на обработку персональных данных'}, ensure_ascii=False)}

        email_sent = False
        email_error = None
        if recipient_email:
            try:
                _send_gift_hint_email(recipient_email, sender_name, message)
                email_sent = True
            except Exception as e:
                email_error = str(e)

        cur.execute(
            f"INSERT INTO {SCHEMA}.gift_hints "
            f"(sender_name, recipient_name, recipient_email, recipient_contact, gift_type, "
            f"gift_slug, gift_label, message, consent, email_sent, email_error, city) "
            f"VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (sender_name, recipient_name, recipient_email or None, recipient_contact or None,
             gift_type, gift_slug, gift_label, message or None, consent, email_sent, email_error, city),
        )
        conn.commit()

        return {
            'statusCode': 200,
            'headers': _cors(),
            'body': json.dumps({'ok': True, 'emailSent': email_sent}, ensure_ascii=False),
        }
    finally:
        conn.close()
