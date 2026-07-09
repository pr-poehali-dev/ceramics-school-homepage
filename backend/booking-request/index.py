import json
import os
import smtplib
import ssl
from email.mime.text import MIMEText
from email.header import Header


def handler(event: dict, context) -> dict:
    '''
    Отправляет заявку на групповую запись (детская группа, разовый билет, >1 участника)
    на почту школы керамики hello@dymovceramic.ru.
    Args: event с httpMethod, body (JSON: name, email, phone, people, comment)
          context — объект с request_id
    Returns: HTTP-ответ с результатом отправки
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
    people = body.get('people')
    service = (body.get('service') or 'Детская группа (сб/вс)').strip()

    if not email or not phone:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Email и телефон обязательны'}),
        }

    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT') or 465)
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')

    recipient = 'hello@dymovceramic.ru'

    if not all([smtp_host, smtp_user, smtp_password]):
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'error': 'SMTP не настроен'}),
        }

    text = (
        'Новая заявка на групповую запись с сайта.\n\n'
        f'Услуга: {service}\n'
        f'Количество участников: {people}\n'
        f'Email клиента: {email}\n'
        f'Телефон клиента: {phone}\n\n'
        'Свяжитесь с клиентом, чтобы уточнить дату посещения.'
    )

    msg = MIMEText(text, 'plain', 'utf-8')
    msg['Subject'] = Header('Заявка на групповую запись', 'utf-8')
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
        'body': json.dumps({'success': True}),
    }
