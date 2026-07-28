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
    }


def _confirmed_dict(r):
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
    }


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


def _send_ready_email(customer_email: str, tracking_number: str, address: str, work_hours: str) -> None:
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
        f'Номер посылки: {tracking_number}\n'
        f'Адрес: {address}\n'
        f'Время работы: {work_hours}\n\n'
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
    GET ?status=active|closed — список посылок (активные или выданные), доступно обеим ролям.
    GET ?status=requests — заявки клиентов на подтверждение (статус 'pending_review'),
      доступно только роли 'vdnh'.
    GET ?status=confirmed — заявки клиентов, подтверждённые администратором (статус 'shipped'
      или 'issued', source='client'); ready_at показывает, отмечено ли изделие готовым к выдаче,
      доступно только роли 'vdnh'.
    GET ?export=csv&status=... — выгрузка CSV, доступно только роли 'vdnh'.
    POST { action: 'create', trackingNumber, customerName, customerPhone, deliveredAt } —
      добавление посылки, доступно только роли 'suzdal'.
    POST { action: 'import_excel', fileData (base64 .xlsx) } — массовая загрузка посылок из
      Excel-файла с колонками «Номер посылки», «ФИО клиента», «Телефон клиента»,
      «Дата доставки в Москву», доступно только роли 'suzdal'.
    POST { action: 'issue', id } — пометить посылку выданной, доступно только роли 'vdnh'.
    POST { action: 'approve_request', id, deliveredAt } — подтвердить заявку клиента и
      перевести её в обычную посылку (статус 'shipped'), доступно только роли 'vdnh'.
    POST { action: 'reject_request', id } — отклонить заявку клиента, доступно только роли 'vdnh'.
    POST { action: 'ready_for_pickup', id } — отметить заявку клиента (source='client') готовой
      к выдаче после обжига (ready_at=NOW()) и отправить клиенту email-уведомление с адресом
      и часами работы студии, доступно только роли 'vdnh'.
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
                    f"(tracking_number, customer_name, customer_phone, delivered_at, return_at, status, created_by) "
                    f"VALUES (%s, %s, %s, %s, %s, 'shipped', %s) RETURNING id",
                    (tracking_number, customer_name, customer_phone, delivered_date, return_date, manager_id),
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
                # Номер посылки | ФИО клиента | Телефон | Дата доставки в Москву
                header_map = {
                    'номер посылки': 'trackingNumber',
                    'фио клиента': 'customerName',
                    'телефон': 'customerPhone',
                    'телефон клиента': 'customerPhone',
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
                        f"(tracking_number, customer_name, customer_phone, delivered_at, return_at, status, created_by) "
                        f"VALUES (%s, %s, %s, %s, %s, 'shipped', %s)",
                        (tracking_number, customer_name, customer_phone, delivered_date, return_date, manager_id),
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
                    f"UPDATE {SCHEMA}.shipments SET status = 'shipped', delivered_at = %s, return_at = %s "
                    f"WHERE id = %s AND status = 'pending_review'",
                    (delivered_date, return_date, request_id),
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
                    f"RETURNING tracking_number, customer_email",
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

                tracking_number, customer_email = row
                email_error = None
                if not customer_email:
                    email_error = 'У заявки не указан email клиента'
                else:
                    try:
                        address, work_hours = _fetch_pickup_info(cur)
                        _send_ready_email(customer_email, tracking_number, address, work_hours)
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
                    f"WHERE id = %s AND status = 'shipped'",
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

        if status_filter == 'closed' and role != 'vdnh':
            return {
                'statusCode': 403,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Раздел «Закрытые» доступен только менеджеру ВДНХ'}, ensure_ascii=False),
            }
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
        if export and role != 'vdnh':
            return {
                'statusCode': 403,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Экспорт доступен только менеджеру ВДНХ'}, ensure_ascii=False),
            }

        if status_filter == 'requests':
            cur.execute(
                f"SELECT id, tracking_number, customer_name, customer_phone, customer_email, photo_url, created_at "
                f"FROM {SCHEMA}.shipments WHERE status = 'pending_review' ORDER BY created_at DESC LIMIT 500",
            )
            requests_rows = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'requests': [_request_dict(r) for r in requests_rows], 'role': role}, ensure_ascii=False),
            }

        if status_filter == 'confirmed':
            cur.execute(
                f"SELECT id, tracking_number, customer_name, customer_phone, customer_email, photo_url, "
                f"delivered_at, return_at, status, ready_at "
                f"FROM {SCHEMA}.shipments WHERE source = 'client' AND status IN ('shipped', 'issued') "
                f"ORDER BY delivered_at DESC LIMIT 500",
            )
            confirmed_rows = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({'requests': [_confirmed_dict(r) for r in confirmed_rows], 'role': role}, ensure_ascii=False),
            }

        db_status = 'issued' if status_filter == 'closed' else 'shipped'

        cur.execute(
            f"SELECT id, tracking_number, customer_name, customer_phone, delivered_at, return_at, status, issued_at "
            f"FROM {SCHEMA}.shipments WHERE status = %s ORDER BY delivered_at DESC LIMIT 2000",
            (db_status,),
        )
        rows = cur.fetchall()
        shipments = [_shipment_dict(r) for r in rows]

        if export == 'csv':
            buffer = io.StringIO()
            writer = csv.writer(buffer, delimiter=';')
            writer.writerow(['Номер посылки', 'ФИО клиента', 'Телефон', 'Дата доставки', 'Дата возврата', 'Статус', 'Дата выдачи'])
            for s in shipments:
                writer.writerow([
                    s['trackingNumber'], s['customerName'], s['customerPhone'],
                    s['deliveredAt'] or '', s['returnAt'] or '',
                    'Выдано' if s['status'] == 'issued' else 'Отправлено в Москву',
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