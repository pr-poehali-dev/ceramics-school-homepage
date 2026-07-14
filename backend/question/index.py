import json
import os
import smtplib
import ssl
import psycopg2
from email.mime.text import MIMEText
from email.header import Header


def handler(event: dict, context) -> dict:
    '''
    Сохраняет вопрос с сайта (форма "Задать вопрос") и отправляет письмо сотруднику на почту.
    Args: event с httpMethod, body (JSON: email, phone, comment)
          context — объект с request_id
    Returns: HTTP-ответ с результатом сохранения и отправки письма
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

    email = (body.get('email') or '').strip()
    phone = (body.get('phone') or '').strip()
    comment = (body.get('comment') or '').strip()

    if not email or not phone:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Email и телефон обязательны'}),
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO questions (email, phone, comment) VALUES (%s, %s, %s)",
            (email, phone, comment),
        )
        conn.commit()
    finally:
        conn.close()

    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT') or 465)
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    recipient = os.environ.get('NOTIFY_EMAIL')

    if not all([smtp_host, smtp_user, smtp_password, recipient]):
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps({'success': True, 'emailSent': False}),
        }

    text = (
        'Новый вопрос с сайта.\n\n'
        f'Email клиента: {email}\n'
        f'Телефон клиента: {phone}\n'
        f'Комментарий: {comment or "—"}\n'
    )

    msg = MIMEText(text, 'plain', 'utf-8')
    msg['Subject'] = Header('Новый вопрос с сайта', 'utf-8')
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

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'success': True, 'emailSent': True}),
    }
