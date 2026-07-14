import json
import os
import smtplib
import ssl
import psycopg2
from email.mime.text import MIMEText
from email.header import Header


def _recipient_for_city(city: str) -> str:
    if city == 'suzdal':
        return os.environ.get('NOTIFY_EMAIL_SUZDAL') or os.environ.get('NOTIFY_EMAIL') or ''
    return os.environ.get('NOTIFY_EMAIL') or ''


def _send_notification(name: str, email: str, phone: str, comment: str, payment: str, total: int, items: list, city: str) -> None:
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT') or 465)
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    recipient = _recipient_for_city(city)

    if not all([smtp_host, smtp_user, smtp_password, recipient]):
        return

    lines_text = '\n'.join(
        f"- {i.get('title', '')} x{i.get('qty', 1)} — {i.get('price', 0)} ₽" for i in items
    )
    text = (
        'Новый заказ с сайта.\n\n'
        f'Имя: {name}\n'
        f'Email: {email}\n'
        f'Телефон: {phone}\n'
        f'Способ оплаты: {payment}\n'
        f'Комментарий: {comment or "—"}\n'
        f'Сумма: {total} ₽\n\n'
        f'Состав заказа:\n{lines_text}'
    )

    msg = MIMEText(text, 'plain', 'utf-8')
    msg['Subject'] = Header('Новый заказ с сайта', 'utf-8')
    msg['From'] = smtp_user
    msg['To'] = recipient
    msg['Reply-To'] = email

    context_ssl = ssl.create_default_context()

    if smtp_port == 465:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context_ssl) as server:
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [recipient], msg.as_string())
    else:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls(context=context_ssl)
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [recipient], msg.as_string())


def handler(event: dict, context) -> dict:
    '''
    Сохраняет оформленный на сайте заказ в базу данных и отправляет уведомление сотруднику на почту.
    Для города Суздаль письмо уходит на отдельный адрес (NOTIFY_EMAIL_SUZDAL).
    Args: event с httpMethod, body (JSON: number, name, email, phone, comment, payment, total, items, city)
          context — объект с request_id
    Returns: HTTP-ответ с результатом сохранения
    '''
    method = event.get('httpMethod', 'GET')

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Invalid JSON'}),
        }

    number = str(body.get('number') or '')
    name = (body.get('name') or '').strip()
    email = (body.get('email') or '').strip()
    phone = (body.get('phone') or '').strip()
    comment = (body.get('comment') or '').strip()
    payment = (body.get('payment') or '').strip()
    total = int(body.get('total') or 0)
    items = body.get('items') or []
    city = (body.get('city') or 'moscow').strip()

    if not name or not email or not phone:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Обязательные поля не заполнены'}),
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO orders (number, customer_name, email, phone, comment, payment, total, items) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (number, name, email, phone, comment, payment, total, json.dumps(items, ensure_ascii=False)),
        )
        order_id = cur.fetchone()[0]
        conn.commit()
    finally:
        conn.close()

    try:
        _send_notification(name, email, phone, comment, payment, total, items, city)
    except Exception:
        pass

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'success': True, 'id': order_id}),
    }