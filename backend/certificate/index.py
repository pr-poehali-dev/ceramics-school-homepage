import json
import os
import io
import secrets
from datetime import datetime, timedelta

import boto3
from reportlab.lib.pagesizes import A5, landscape
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas


def _cors_headers() -> dict:
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }


def _wrap(text: str, max_chars: int) -> list:
    words = text.split()
    lines: list = []
    current = ''
    for word in words:
        candidate = (current + ' ' + word).strip()
        if len(candidate) <= max_chars:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines[:4]


def _build_pdf(amount: int, message: str, recipient: str, sender: str, code: str, valid_until: str) -> bytes:
    buffer = io.BytesIO()
    width, height = landscape(A5)
    c = canvas.Canvas(buffer, pagesize=landscape(A5))

    primary = HexColor('#B45309')
    dark = HexColor('#44403C')
    muted = HexColor('#78716C')

    c.setFillColor(HexColor('#FBF7F0'))
    c.rect(0, 0, width, height, fill=1, stroke=0)

    c.setStrokeColor(primary)
    c.setLineWidth(2)
    c.rect(10 * mm, 10 * mm, width - 20 * mm, height - 20 * mm, fill=0, stroke=1)

    c.setFillColor(primary)
    c.setFont('Helvetica-Bold', 11)
    c.drawCentredString(width / 2, height - 24 * mm, 'DYMOV CERAMICS  |  VDNH, MOSCOW')

    c.setFillColor(dark)
    c.setFont('Helvetica-Bold', 26)
    c.drawCentredString(width / 2, height - 42 * mm, 'GIFT CERTIFICATE')

    c.setFillColor(primary)
    c.setFont('Helvetica-Bold', 40)
    c.drawCentredString(width / 2, height - 66 * mm, f'{amount:,} RUB'.replace(',', ' '))

    y = height - 82 * mm
    if recipient:
        c.setFillColor(dark)
        c.setFont('Helvetica-Oblique', 14)
        c.drawCentredString(width / 2, y, f'For: {recipient}')
        y -= 9 * mm

    if message:
        c.setFillColor(muted)
        c.setFont('Helvetica-Oblique', 12)
        for line in _wrap(message, 60):
            c.drawCentredString(width / 2, y, line)
            y -= 7 * mm

    if sender:
        c.setFillColor(muted)
        c.setFont('Helvetica', 11)
        c.drawCentredString(width / 2, y - 2 * mm, f'From: {sender}')

    c.setFillColor(muted)
    c.setFont('Helvetica', 9)
    c.drawString(16 * mm, 16 * mm, f'Code: {code}')
    c.drawRightString(width - 16 * mm, 16 * mm, f'Valid until: {valid_until}')

    c.showPage()
    c.save()
    return buffer.getvalue()


def handler(event: dict, context) -> dict:
    '''
    Business: генерирует PDF подарочного сертификата с персональной фразой, сохраняет в S3 и возвращает ссылку.
    Args: event с httpMethod, body (amount, message, recipientName, senderName, recipientEmail)
    Returns: HTTP-ответ с url PDF, кодом сертификата и сроком действия
    '''
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors_headers(), 'body': ''}

    if method != 'POST':
        return {'statusCode': 405, 'headers': _cors_headers(), 'body': json.dumps({'error': 'Method not allowed'})}

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return {'statusCode': 400, 'headers': _cors_headers(), 'body': json.dumps({'error': 'Invalid JSON'})}

    amount = int(body.get('amount') or 0)
    if amount < 1000 or amount > 1000000:
        return {'statusCode': 400, 'headers': _cors_headers(), 'body': json.dumps({'error': 'Номинал должен быть от 1000 до 1000000'})}

    message = str(body.get('message') or '')[:200]
    recipient = str(body.get('recipientName') or '')[:60]
    sender = str(body.get('senderName') or '')[:60]

    code = 'DK-' + secrets.token_hex(4).upper()
    valid_until = (datetime.utcnow() + timedelta(days=365)).strftime('%d.%m.%Y')

    pdf_bytes = _build_pdf(amount, message, recipient, sender, code, valid_until)

    access_key = os.environ['AWS_ACCESS_KEY_ID']
    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=access_key,
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    key = f'certificates/{code}.pdf'
    s3.put_object(Bucket='files', Key=key, Body=pdf_bytes, ContentType='application/pdf')

    cdn_url = f'https://cdn.poehali.dev/projects/{access_key}/bucket/{key}'

    return {
        'statusCode': 200,
        'headers': {**_cors_headers(), 'Content-Type': 'application/json'},
        'body': json.dumps({
            'success': True,
            'code': code,
            'amount': amount,
            'validUntil': valid_until,
            'pdfUrl': cdn_url,
        }),
    }
