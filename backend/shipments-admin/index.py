import base64
import csv
import io
import json
import os
import smtplib
import ssl
from datetime import date, datetime, timedelta
from email.header import Header
from email.mime.text import MIMEText

import openpyxl
import psycopg2

SCHEMA = 't_p90609946_ceramics_school_home'
SITE_URL = 'https://dymovceramicschool.ru'


def _auth(cur, token: str):
    """Возвращает (manager_id, role) по токену сессии, либо None если сессия невалидна."""
    if not token:
        return None
    cur.execute(
        f"SELECT m.id, m.role FROM {SCHEMA}.manager_sessions s "
        f"JOIN {SCHEMA}.managers m ON m.id = s.manager_id "
        f"WHERE s.token = %s AND s.expires_at > NOW()",
        (token,),
    )
    row = cur.fetchone()
    return row


def _shipment_dict(r):
    return {
        'id': r[0],
        'trackingNumber': r[1],
        'customerName': r[2],
        'customerPhone': r[3],
        'deliveredAt': r[4].isoformat() if r[4] else None,
        'returnAt': r[5].isoformat() if r[5] else None,
        'status': r[6],
        'issuedAt': r[7].isoformat() if r[7] else None,
        'customerEmail': r[8],
    }


def _request_dict(r):
    return {
        'id': r[0],
        'trackingNumber': r[1],
        'customerName': r[2],
        'customerPhone': r[3],
        'customerEmail': r[4],
        'photoUrl': r[5],
        'createdAt': r[6].isoformat() if r[6] else None,
        'visitNumber': r[7],
        'parentId': r[8],
        'parentTrackingNumber': r[9],
        'visitDate': r[10].isoformat() if r[10] else None,
    }


def _confirmed_dict(r):
    created_at = r[10]
    return {
        'id': r[0],
        'trackingNumber': r[1],
        'customerName': r[2],
        'customerPhone': r[3],
        'customerEmail': r[4],
        'photoUrl': r[5],
        'deliveredAt': r[6].isoformat() if r[6] else None,
        'returnAt': r[7].isoformat() if r[7] else None,
        'status': r[8],
        'readyAt': r[9].isoformat() if r[9] else None,
        'createdAt': created_at.isoformat() if created_at else None,
        'storageUntil': (created_at.date() + timedelta(days=60)).isoformat() if created_at else None,
        'visitNumber': r[11],
        'parentId': r[12],
        'parentTrackingNumber': r[13],
        'requiresPainting': r[14],
        'paintingReminderSentAt': r[15].isoformat() if r[15] else None,
        'visitDate': r[16].isoformat() if r[16] else None,
    }


def _archived_dict(r):
    created_at = r[10]
    return {
        'id': r[0],
        'trackingNumber': r[1],
        'customerName': r[2],
        'customerPhone': r[3],
        'customerEmail': r[4],
        'photoUrl': r[5],
        'deliveredAt': r[6].isoformat() if r[6] else None,
        'returnAt': r[7].isoformat() if r[7] else None,
        'status': r[8],
        'readyAt': r[9].isoformat() if r[9] else None,
        'createdAt': created_at.isoformat() if created_at else None,
        'archivedAt': r[11].isoformat() if r[11] else None,
    }


def _auto_archive(cur):
    """Переносит в архив подтверждённые заявки клиентов (source='client'), у которых
    прошло более 3 месяцев с момента отметки «Готово к выдаче» (ready_at)."""
    cur.execute(
        f"UPDATE {SCHEMA}.shipments SET archived_at = NOW() "
        f"WHERE source = 'client' AND archived_at IS NULL "
        f"AND ready_at IS NOT NULL AND ready_at < NOW() - INTERVAL '3 months'",
    )


def _auto_return(cur):
    """Переводит посылки в статус 'returned' (Возврат), если с даты доставки в Москву
    (delivered_at) прошло 30 дней (return_at < текущей даты), а клиент так и не забрал
    изделие (статус всё ещё 'shipped'). Такие посылки попадают в раздел «Закрытые»."""
    cur.execute(
        f"UPDATE {SCHEMA}.shipments SET status = 'returned' "
        f"WHERE status = 'shipped' AND return_at < CURRENT_DATE",
    )


def _fetch_pickup_info(cur):
    """Достаёт адрес и часы работы выдачи из CMS-контента страницы moscow-info (с фолбэком)."""
    address = 'ВДНХ, проспект Мира, 119, строение 186'
    work_hours = 'Ежедневно с 11:00 до 20:00'
    try:
        cur.execute(
            f"SELECT fields->>'address', fields->>'workHours' "
            f"FROM {SCHEMA}.page_content WHERE page_key = 'moscow-info'",
        )
        row = cur.fetchone()
        if row:
            address = row[0] or address
            work_hours = row[1] or work_hours
    except Exception:
        pass
    return address, work_hours


def _send_painting_reminder_email(customer_email: str, tracking_number: str, phone: str) -> None:
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT') or 465)
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')

    missing = [
        name for name, val in [
            ('SMTP_HOST', smtp_host), ('SMTP_USER', smtp_user),
            ('SMTP_PASSWORD', smtp_password), ('customerEmail', customer_email),
        ] if not val
    ]
    if missing:
        raise RuntimeError(f"Не заданы параметры: {', '.join(missing)}")

    text = (
        'Уважаемый клиент!\n\n'
        'Школа керамики Дымов Керамики рада сообщить, что Ваше изделие прошло обжиг.\n\n'
        f'Номер заявки: {tracking_number}\n\n'
        'Если Вы хотите расписать изделие — запишитесь на мастер-класс «Роспись ангобами» '
        f'на сайте {SITE_URL}/moscow/workshops/angoby или по телефону {phone}.\n\n'
        'Если роспись не требуется — Вы можете просто приехать и забрать готовое изделие.\n\n'
        f'Контакты: {SITE_URL}/moscow/contacts'
    )

    msg = MIMEText(text, 'plain', 'utf-8')
    msg['Subject'] = Header('Ваше изделие прошло обжиг', 'utf-8')
    msg['From'] = smtp_user
    msg['To'] = customer_email

    context_ssl = ssl.create_default_context()
    if smtp_port == 465:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context_ssl) as server:
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [customer_email], msg.as_string())
    else:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls(context=context_ssl)
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [customer_email], msg.as_string())


def _auto_send_painting_reminders(cur):
    """Отправляет письмо «изделие прошло обжиг, запишитесь на роспись» по заявкам,
    подтверждённым как «требует росписи» (requires_painting=true), у которых прошло
    16 дней с момента подтверждения (confirmed_at) и письмо ещё не отправлялось."""
    cur.execute(
        f"SELECT id, tracking_number, customer_email FROM {SCHEMA}.shipments "
        f"WHERE source = 'client' AND requires_painting = true AND status = 'shipped' "
        f"AND painting_reminder_sent_at IS NULL "
        f"AND confirmed_at IS NOT NULL AND confirmed_at < NOW() - INTERVAL '16 days'",
    )
    rows = cur.fetchall()
    if not rows:
        return
    try:
        cur.execute(
            f"SELECT fields->>'phone' FROM {SCHEMA}.page_content WHERE page_key = 'moscow-info'",
        )
        phone_row = cur.fetchone()
        phone = (phone_row[0] if phone_row else None) or '+7 (985) 419-89-03'
    except Exception:
        phone = '+7 (985) 419-89-03'

    for shipment_id, tracking_number, customer_email in rows:
        if customer_email:
            try:
                _send_painting_reminder_email(customer_email, tracking_number, phone)
                print(f"[painting_reminder] email sent to {customer_email} for {tracking_number}")
            except Exception as e:
                print(f"[painting_reminder] email send failed for {customer_email}: {e!r}")
                continue
        cur.execute(
            f"UPDATE {SCHEMA}.shipments SET painting_reminder_sent_at = NOW() WHERE id = %s",
            (shipment_id,),
        )


def _send_ready_email(customer_email: str, tracking_number: str, address: str, work_hours: str, storage_until: str) -> None:
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT') or 465)
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')

    missing = [
        name for name, val in [
            ('SMTP_HOST', smtp_host), ('SMTP_USER', smtp_user),
            ('SMTP_PASSWORD', smtp_password), ('customerEmail', customer_email),
        ] if not val
    ]
    if missing:
        raise RuntimeError(f"Не заданы параметры: {', '.join(missing)}")

    text = (
        'Уважаемый клиент!\n\n'
        'Школа керамики Дымов Керамики рада сообщить, что Ваше изделие прошло обжиг '
        'и готово к выдаче.\n\n'
        f'Номер заявки: {tracking_number}\n'
        f'Адрес: {address}\n'
        f'Время работы: {work_hours}\n\n'
        f'Срок хранения изделия — 60 календарных дней с даты оформления заявки. '
        f'Пожалуйста, заберите изделие до {storage_until} включительно. '
        'По истечении этого срока мы оставляем за собой право утилизировать изделие '
        'либо передать его на благотворительную ярмарку.\n\n'
        f'Контакты: {SITE_URL}/moscow/contacts'
    )

    msg = MIMEText(text, 'plain', 'utf-8')
    msg['Subject'] = Header('Ваше изделие готово к выдаче', 'utf-8')
    msg['From'] = smtp_user
    msg['To'] = customer_email

    context_ssl = ssl.create_default_context()
    if smtp_port == 465:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context_ssl) as server:
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [customer_email], msg.as_string())
    else:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls(context=context_ssl)
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [customer_email], msg.as_string())


def handler(event: dict, context) -> dict:
    '''
    Управление посылками с готовыми керамическими изделиями для менеджеров Суздаля и ВДНХ.
    Доступ защищён токеном сессии менеджера (общая таблица managers/manager_sessions).
    GET ?status=active|closed — список посылок, добавленных менеджером Суздаля вручную
      (source='manager'; активные или закрытые: выданные/возврат), доступно обеим ролям.
      Заявки клиентов с сайта (source='client', раздел «Изделия (Москва)») сюда не попадают —
      это два независимых списка. При каждом вызове автоматически переводит в статус
      'returned' (Возврат) посылки, не выданные клиенту в течение 30 дней с даты доставки
      в Москву (return_at < текущей даты) — такие посылки попадают в раздел «Закрытые».
    GET ?status=requests — заявки клиентов на подтверждение (статус 'pending_review'),
      доступно только роли 'vdnh'.
    GET ?status=confirmed — заявки клиентов, подтверждённые администратором (статус 'shipped'
      или 'issued', source='client', archived_at IS NULL); ready_at показывает, отмечено ли
      изделие готовым к выдаче, доступно только роли 'vdnh'. При каждом вызове автоматически
      архивирует (archived_at=NOW()) заявки, у которых ready_at был более 3 месяцев назад,
      и отправляет письмо-напоминание про роспись (requires_painting=true, 16 дней после
      confirmed_at, см. _auto_send_painting_reminders).
      visitNumber/parentId/parentTrackingNumber показывают связь с предыдущим посещением
      клиента (повторная заявка после росписи, source shipment-request с isRepeatVisit=true).
      requiresPainting=true — заявка на необожжённое изделие под роспись: кнопки «Готово» нет,
      клиенту автоматически летит письмо с приглашением записаться на роспись через 16 дней.
      requiresPainting=false — обычная заявка на готовое изделие: доступна кнопка «Готово».
    GET ?status=archived — архив заявок клиентов (source='client', archived_at IS NOT NULL) —
      заявки, отмеченные готовыми к выдаче более 3 месяцев назад, доступно только роли 'vdnh'.
    GET ?export=csv&status=... — выгрузка CSV, доступно только роли 'vdnh'.
    POST { action: 'create', trackingNumber, customerName, customerPhone, customerEmail (необязательно),
      deliveredAt } — добавление посылки, доступно только роли 'suzdal'.
    POST { action: 'import_excel', fileData (base64 .xlsx) } — массовая загрузка посылок из
      Excel-файла с колонками «Номер посылки», «ФИО клиента», «Телефон клиента», «Email»
      (необязательно), «Дата доставки в Москву», доступно только роли 'suzdal'.
    POST { action: 'issue', id } — пометить посылку выданной, доступно только роли 'vdnh'.
    POST { action: 'approve_request', id, deliveredAt, requiresPainting } — подтвердить заявку
      клиента и перевести её в обычную посылку (статус 'shipped'), доступно только роли 'vdnh'.
      requiresPainting=true — изделие сдано под роспись (пока просто обожжено): без кнопки
      «Готово», через 16 дней после подтверждения клиенту автоматически уходит письмо с
      приглашением записаться на роспись. requiresPainting=false — обычное готовое изделие,
      доступна кнопка «Готово» (ready_for_pickup).
    POST { action: 'reject_request', id } — отклонить заявку клиента, доступно только роли 'vdnh'.
    POST { action: 'ready_for_pickup', id } — отметить заявку клиента (source='client') готовой
      к выдаче после обжига (ready_at=NOW()) и отправить клиенту email-уведомление с адресом,
      часами работы студии и сроком хранения (60 календарных дней с даты оформления заявки),
      доступно только роли 'vdnh'.
    Args: event с httpMethod, headers (X-Session-Token), queryStringParameters, body
          context — объект с request_id
    Returns: HTTP-ответ со списком посылок либо результатом операции
    '''
    method = event.get('httpMethod', 'GET')

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if method not in ('GET', 'POST'):
        return {
            'statusCode': 405,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    headers = event.get('headers') or {}
    token = headers.get('X-Session-Token') or headers.get('x-session-token') or ''

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()

        auth = _auth(cur, token)
        if not auth:
            return {
                'statusCode': 401,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Требуется авторизация'}, ensure_ascii=False),
            }
        manager_id, role = auth

        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            action = body.get('action')

            if action == 'create':
                if role != 'suzdal':
                    return {
                        'statusCode': 403,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Добавлять посылки может только менеджер Суздаля'}, ensure_ascii=False),
                    }

                tracking_number = (body.get('trackingNumber') or '').strip()
                customer_name = (body.get('customerName') or '').strip()
                customer_phone = (body.get('customerPhone') or '').strip()
                customer_email = (body.get('customerEmail') or '').strip() or None
                delivered_at = body.get('deliveredAt') or datetime.utcnow().date().isoformat()

                if not tracking_number or not customer_name or not customer_phone:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Заполните номер посылки, ФИО и телефон'}, ensure_ascii=False),
                    }

                try:
                    delivered_date = datetime.strptime(delivered_at[:10], '%Y-%m-%d').date()
                except ValueError:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Неверный формат даты'}, ensure_ascii=False),
                    }
                return_date = delivered_date + timedelta(days=30)

                cur.execute(
                    f"SELECT id FROM {SCHEMA}.shipments WHERE tracking_number = %s",
                    (tracking_number,),
                )
                if cur.fetchone():
                    return {
                        'statusCode': 409,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Посылка с таким номером уже существует'}, ensure_ascii=False),
                    }

                cur.execute(
                    f"INSERT INTO {SCHEMA}.shipments "
                    f"(tracking_number, customer_name, customer_phone, customer_email, delivered_at, return_at, status, created_by) "
                    f"VALUES (%s, %s, %s, %s, %s, %s, 'shipped', %s) RETURNING id",
                    (tracking_number, customer_name, customer_phone, customer_email, delivered_date, return_date, manager_id),
                )
                new_id = cur.fetchone()[0]
                conn.commit()

                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'ok': True, 'id': new_id}, ensure_ascii=False),
                }

            if action == 'import_excel':
                if role != 'suzdal':
                    return {
                        'statusCode': 403,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Загружать посылки может только менеджер Суздаля'}, ensure_ascii=False),
                    }

                file_data = body.get('fileData') or ''
                if not file_data:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Файл не передан'}, ensure_ascii=False),
                    }
                if ',' in file_data:
                    file_data = file_data.split(',', 1)[1]

                try:
                    raw = base64.b64decode(file_data)
                    workbook = openpyxl.load_workbook(io.BytesIO(raw), data_only=True)
                    sheet = workbook.active
                except Exception:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Не удалось прочитать Excel-файл'}, ensure_ascii=False),
                    }

                # Ожидаемые колонки (в любом порядке, по заголовку первой строки):
                # Номер посылки | ФИО клиента | Телефон | Email | Дата доставки в Москву
                header_map = {
                    'номер посылки': 'trackingNumber',
                    'фио клиента': 'customerName',
                    'телефон': 'customerPhone',
                    'телефон клиента': 'customerPhone',
                    'email': 'customerEmail',
                    'e-mail': 'customerEmail',
                    'почта': 'customerEmail',
                    'дата доставки в москву': 'deliveredAt',
                    'дата доставки': 'deliveredAt',
                }

                rows_iter = sheet.iter_rows(values_only=True)
                try:
                    header_row = next(rows_iter)
                except StopIteration:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Файл пуст'}, ensure_ascii=False),
                    }

                col_index = {}
                for idx, cell in enumerate(header_row):
                    key = str(cell or '').strip().lower()
                    if key in header_map:
                        col_index[header_map[key]] = idx

                required_cols = {'trackingNumber', 'customerName', 'customerPhone'}
                if not required_cols.issubset(col_index.keys()):
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({
                            'error': 'В файле должны быть колонки: Номер посылки, ФИО клиента, Телефон клиента, Дата доставки в Москву',
                        }, ensure_ascii=False),
                    }

                created = 0
                skipped = []
                today = datetime.utcnow().date()

                for row in rows_iter:
                    if row is None or all(c is None or str(c).strip() == '' for c in row):
                        continue

                    def _get(field):
                        idx = col_index.get(field)
                        if idx is None or idx >= len(row):
                            return None
                        val = row[idx]
                        return val

                    tracking_number = str(_get('trackingNumber') or '').strip()
                    customer_name = str(_get('customerName') or '').strip()
                    customer_phone = str(_get('customerPhone') or '').strip()
                    customer_email = str(_get('customerEmail') or '').strip() or None
                    delivered_raw = _get('deliveredAt')

                    if not tracking_number or not customer_name or not customer_phone:
                        skipped.append(tracking_number or '(без номера)')
                        continue

                    if isinstance(delivered_raw, datetime):
                        delivered_date = delivered_raw.date()
                    elif isinstance(delivered_raw, date):
                        delivered_date = delivered_raw
                    elif delivered_raw:
                        try:
                            delivered_date = datetime.strptime(str(delivered_raw)[:10], '%Y-%m-%d').date()
                        except ValueError:
                            delivered_date = today
                    else:
                        delivered_date = today

                    return_date = delivered_date + timedelta(days=30)

                    cur.execute(
                        f"SELECT id FROM {SCHEMA}.shipments WHERE tracking_number = %s",
                        (tracking_number,),
                    )
                    if cur.fetchone():
                        skipped.append(tracking_number)
                        continue

                    cur.execute(
                        f"INSERT INTO {SCHEMA}.shipments "
                        f"(tracking_number, customer_name, customer_phone, customer_email, delivered_at, return_at, status, created_by) "
                        f"VALUES (%s, %s, %s, %s, %s, %s, 'shipped', %s)",
                        (tracking_number, customer_name, customer_phone, customer_email, delivered_date, return_date, manager_id),
                    )
                    created += 1

                conn.commit()

                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'ok': True, 'created': created, 'skipped': skipped}, ensure_ascii=False),
                }

            if action == 'approve_request':
                if role != 'vdnh':
                    return {
                        'statusCode': 403,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Подтверждать заявки может только менеджер ВДНХ'}, ensure_ascii=False),
                    }

                request_id = body.get('id')
                delivered_at = body.get('deliveredAt') or datetime.utcnow().date().isoformat()
                requires_painting = bool(body.get('requiresPainting'))
                if not request_id:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Не указана заявка'}, ensure_ascii=False),
                    }
                try:
                    delivered_date = datetime.strptime(delivered_at[:10], '%Y-%m-%d').date()
                except ValueError:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Неверный формат даты'}, ensure_ascii=False),
                    }
                return_date = delivered_date + timedelta(days=30)

                cur.execute(
                    f"UPDATE {SCHEMA}.shipments SET status = 'shipped', delivered_at = %s, return_at = %s, "
                    f"requires_painting = %s, confirmed_at = NOW() "
                    f"WHERE id = %s AND status = 'pending_review'",
                    (delivered_date, return_date, requires_painting, request_id),
                )
                if cur.rowcount == 0:
                    return {
                        'statusCode': 404,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Заявка не найдена или уже обработана'}, ensure_ascii=False),
                    }
                conn.commit()

                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'ok': True}, ensure_ascii=False),
                }

            if action == 'reject_request':
                if role != 'vdnh':
                    return {
                        'statusCode': 403,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Отклонять заявки может только менеджер ВДНХ'}, ensure_ascii=False),
                    }

                request_id = body.get('id')
                if not request_id:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Не указана заявка'}, ensure_ascii=False),
                    }

                cur.execute(
                    f"UPDATE {SCHEMA}.shipments SET status = 'rejected' "
                    f"WHERE id = %s AND status = 'pending_review'",
                    (request_id,),
                )
                if cur.rowcount == 0:
                    return {
                        'statusCode': 404,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Заявка не найдена или уже обработана'}, ensure_ascii=False),
                    }
                conn.commit()

                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'ok': True}, ensure_ascii=False),
                }

            if action == 'ready_for_pickup':
                if role != 'vdnh':
                    return {
                        'statusCode': 403,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Отмечать готовность может только менеджер ВДНХ'}, ensure_ascii=False),
                    }

                shipment_id = body.get('id')
                if not shipment_id:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Не указана заявка'}, ensure_ascii=False),
                    }

                cur.execute(
                    f"UPDATE {SCHEMA}.shipments SET ready_at = NOW() "
                    f"WHERE id = %s AND source = 'client' AND status = 'shipped' AND ready_at IS NULL "
                    f"RETURNING tracking_number, customer_email, created_at",
                    (shipment_id,),
                )
                row = cur.fetchone()
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Заявка не найдена или уже отмечена готовой'}, ensure_ascii=False),
                    }
                conn.commit()

                tracking_number, customer_email, created_at = row
                storage_until = (created_at.date() + timedelta(days=60)).strftime('%d.%m.%Y')
                email_error = None
                if not customer_email:
                    email_error = 'У заявки не указан email клиента'
                else:
                    try:
                        address, work_hours = _fetch_pickup_info(cur)
                        _send_ready_email(customer_email, tracking_number, address, work_hours, storage_until)
                        print(f"[ready_for_pickup] email sent to {customer_email} for {tracking_number}")
                    except Exception as e:
                        email_error = str(e)
                        print(f"[ready_for_pickup] email send failed for {customer_email}: {e!r}")

                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'ok': True, 'emailError': email_error}, ensure_ascii=False),
                }

            if action == 'issue':
                if role != 'vdnh':
                    return {
                        'statusCode': 403,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Выдавать посылки может только менеджер ВДНХ'}, ensure_ascii=False),
                    }

                shipment_id = body.get('id')
                if not shipment_id:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Не указана посылка'}, ensure_ascii=False),
                    }

                cur.execute(
                    f"UPDATE {SCHEMA}.shipments SET status = 'issued', issued_at = NOW(), issued_by = %s "
                    f"WHERE id = %s AND status = 'shipped' AND source = 'manager'",
                    (manager_id, shipment_id),
                )
                if cur.rowcount == 0:
                    return {
                        'statusCode': 404,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Посылка не найдена или уже выдана'}, ensure_ascii=False),
                    }
                conn.commit()

                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'ok': True}, ensure_ascii=False),
                }

            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Неизвестное действие'}, ensure_ascii=False),
            }

        # GET — список посылок
        params = event.get('queryStringParameters') or {}
        status_filter = params.get('status') or 'active'
        export = params.get('export') or ''

        if status_filter == 'requests' and role != 'vdnh':
            return {
                'statusCode': 403,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Заявки клиентов доступны только менеджеру ВДНХ'}, ensure_ascii=False),
            }
        if status_filter == 'confirmed' and role != 'vdnh':
            return {
                'statusCode': 403,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Заявки клиентов доступны только менеджеру ВДНХ'}, ensure_ascii=False),
            }
        if status_filter == 'archived' and role != 'vdnh':
            return {
                'statusCode': 403,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Архив доступен только менеджеру ВДНХ'}, ensure_ascii=False),
            }
        if export and role != 'vdnh':
            return {
                'statusCode': 403,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Экспорт доступен только менеджеру ВДНХ'}, ensure_ascii=False),
            }

        if status_filter == 'requests':
            cur.execute(
                f"SELECT s.id, s.tracking_number, s.customer_name, s.customer_phone, s.customer_email, "
                f"s.photo_url, s.created_at, s.visit_number, s.parent_id, p.tracking_number, s.visit_date "
                f"FROM {SCHEMA}.shipments s LEFT JOIN {SCHEMA}.shipments p ON p.id = s.parent_id "
                f"WHERE s.status = 'pending_review' ORDER BY s.created_at DESC LIMIT 500",
            )
            requests_rows = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'requests': [_request_dict(r) for r in requests_rows], 'role': role}, ensure_ascii=False),
            }

        if status_filter == 'confirmed':
            _auto_archive(cur)
            _auto_send_painting_reminders(cur)
            conn.commit()
            cur.execute(
                f"SELECT s.id, s.tracking_number, s.customer_name, s.customer_phone, s.customer_email, s.photo_url, "
                f"s.delivered_at, s.return_at, s.status, s.ready_at, s.created_at, "
                f"s.visit_number, s.parent_id, p.tracking_number, "
                f"s.requires_painting, s.painting_reminder_sent_at, s.visit_date "
                f"FROM {SCHEMA}.shipments s LEFT JOIN {SCHEMA}.shipments p ON p.id = s.parent_id "
                f"WHERE s.source = 'client' AND s.status IN ('shipped', 'issued') "
                f"AND s.archived_at IS NULL "
                f"ORDER BY s.created_at DESC LIMIT 500",
            )
            confirmed_rows = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'requests': [_confirmed_dict(r) for r in confirmed_rows], 'role': role}, ensure_ascii=False),
            }

        if status_filter == 'archived':
            _auto_archive(cur)
            conn.commit()
            cur.execute(
                f"SELECT id, tracking_number, customer_name, customer_phone, customer_email, photo_url, "
                f"delivered_at, return_at, status, ready_at, created_at, archived_at "
                f"FROM {SCHEMA}.shipments WHERE source = 'client' AND archived_at IS NOT NULL "
                f"ORDER BY archived_at DESC LIMIT 500",
            )
            archived_rows = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'requests': [_archived_dict(r) for r in archived_rows], 'role': role}, ensure_ascii=False),
            }

        _auto_return(cur)
        conn.commit()

        if status_filter == 'closed':
            order_clause = 'issued_at DESC, return_at DESC, delivered_at DESC'
            cur.execute(
                f"SELECT id, tracking_number, customer_name, customer_phone, delivered_at, return_at, status, issued_at, customer_email "
                f"FROM {SCHEMA}.shipments WHERE status IN ('issued', 'returned') AND source = 'manager' "
                f"ORDER BY {order_clause} LIMIT 2000",
            )
        else:
            cur.execute(
                f"SELECT id, tracking_number, customer_name, customer_phone, delivered_at, return_at, status, issued_at, customer_email "
                f"FROM {SCHEMA}.shipments WHERE status = 'shipped' AND source = 'manager' "
                f"ORDER BY delivered_at DESC, created_at DESC LIMIT 2000",
            )
        rows = cur.fetchall()
        shipments = [_shipment_dict(r) for r in rows]

        if export == 'csv':
            buffer = io.StringIO()
            writer = csv.writer(buffer, delimiter=';')
            writer.writerow(['Номер посылки', 'ФИО клиента', 'Телефон', 'Email', 'Дата доставки', 'Дата возврата', 'Статус', 'Дата выдачи'])
            status_labels = {'issued': 'Выдано', 'returned': 'Возврат', 'shipped': 'Отправлено в Москву'}
            for s in shipments:
                writer.writerow([
                    s['trackingNumber'], s['customerName'], s['customerPhone'], s.get('customerEmail') or '',
                    s['deliveredAt'] or '', s['returnAt'] or '',
                    status_labels.get(s['status'], s['status']),
                    s['issuedAt'] or '',
                ])
            csv_content = '\ufeff' + buffer.getvalue()
            return {
                'statusCode': 200,
                'headers': {
                    **cors_headers,
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="shipments.csv"',
                },
                'body': csv_content,
            }

        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps({'shipments': shipments, 'role': role}, ensure_ascii=False),
        }
    finally:
        conn.close()