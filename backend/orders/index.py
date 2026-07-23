import json
import os
import smtplib
import ssl
from datetime import datetime
import psycopg2
from email.mime.text import MIMEText
from email.header import Header


EXTRA_RECIPIENT = 'uxdesign30@gmail.com'


def _generate_order_number(cur) -> str:
    """Атомарно генерирует следующий номер заказа в формате ГГММ/N (сквозной за месяц)."""
    year_month = datetime.utcnow().strftime('%y%m')
    cur.execute(
        "INSERT INTO order_number_counters (year_month, counter) VALUES (%s, 1) "
        "ON CONFLICT (year_month) DO UPDATE SET counter = order_number_counters.counter + 1 "
        "RETURNING counter",
        (year_month,),
    )
    counter = cur.fetchone()[0]
    return f"{year_month}/{counter}"


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

    recipients = [recipient, EXTRA_RECIPIENT]

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
            server.sendmail(smtp_user, recipients, msg.as_string())
    else:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls(context=context_ssl)
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, recipients, msg.as_string())


def handler(event: dict, context) -> dict:
    '''
    Сохраняет оформленный на сайте заказ в базу данных и отправляет уведомление сотруднику на почту.
    Номер заказа генерируется на сервере атомарно в формате ГГММ/N (год, месяц, сквозной
    порядковый номер за месяц), например "2607/22".
    Для города Суздаль письмо уходит на отдельный адрес (NOTIFY_EMAIL_SUZDAL).
    GET с параметром number возвращает статус оплаты заказа (для страницы после оплаты ЮKassa).
    Args: event с httpMethod, body (JSON: name, email, phone, comment, payment, total, items, city),
          queryStringParameters (number) для GET
          context — объект с request_id
    Returns: HTTP-ответ с результатом сохранения или статусом заказа
    '''
    method = event.get('httpMethod', 'GET')

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        number = (params.get('number') or '').strip()
        if not number:
            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({'error': 'number is required'}),
            }
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        try:
            cur = conn.cursor()
            cur.execute(
                "SELECT number, customer_name, payment, total, status, paid_at "
                "FROM orders WHERE number = %s",
                (number,),
            )
            row = cur.fetchone()
        finally:
            conn.close()
        if not row:
            return {
                'statusCode': 404,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Order not found'}),
            }
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps({
                'number': row[0],
                'name': row[1],
                'payment': row[2],
                'total': row[3],
                'status': row[4] or 'pending',
                'paid_at': row[5].isoformat() if row[5] else None,
            }),
        }

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

    # Онлайн-оплата ЮKassa доступна только для заказов из Москвы
    if payment == 'online' and city != 'moscow':
        payment = 'cash'

    order_status = 'pending' if payment == 'online' else 'new'

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        number = _generate_order_number(cur)
        cur.execute(
            "INSERT INTO orders (number, customer_name, email, phone, comment, payment, total, items, status, city) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (number, name, email, phone, comment, payment, total, json.dumps(items, ensure_ascii=False), order_status, city),
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
        'body': json.dumps({'success': True, 'id': order_id, 'number': number}),
    }