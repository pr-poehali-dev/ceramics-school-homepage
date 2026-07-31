/**
 * СПРАВОЧНИК всех email-рассылок проекта — для раздела админки «Email-рассылки».
 *
 * ВАЖНО: при добавлении/изменении/удалении любой отправки письма в папке backend
 * (любой вызов server.sendmail в index.py) — обязательно обновляй этот файл в
 * том же наборе правок, чтобы справочник в админке не расходился с кодом.
 *
 * id каждой записи совпадает с template_key в БД (таблица email_templates) — именно
 * по этому ключу backend ищет кастомный текст, сохранённый через админку, и подставляет
 * его вместо defaultSubject/defaultBody. variables — список плейсхолдеров вида
 * {tracking_number}, которые можно использовать в тексте и которые backend подставит
 * реальными значениями при отправке.
 */

export type EmailTrigger = 'auto' | 'manual' | 'form';

export interface EmailVariable {
  key: string;
  label: string;
}

export interface EmailNotification {
  id: string;
  subject: string;
  recipient: string;
  triggerType: EmailTrigger;
  triggerLabel: string;
  content: string;
  conditions?: string;
  sourceFile: string;
  active: boolean;
  defaultSubject: string;
  defaultBody: string;
  variables: EmailVariable[];
}

export const EMAIL_NOTIFICATIONS: EmailNotification[] = [
  {
    id: 'painting-reminder',
    subject: 'Ваше изделие прошло обжиг',
    recipient: 'Клиент (email из заявки на посылку)',
    triggerType: 'auto',
    triggerLabel: 'Автоматически, раз в 16 дней после подтверждения заявки',
    content:
      'Сообщает, что изделие прошло обжиг, и предлагает записаться на мастер-класс «Роспись ангобами» (ссылка + телефон) либо просто забрать изделие без росписи.',
    conditions:
      'Заявка подтверждена с пометкой «Требуется роспись» (requires_painting=true), прошло 16+ дней с момента подтверждения, письмо ещё не отправлялось. Проверяется автоматически при каждом открытии вкладки «Изделия (Москва)» → «Подтверждённые» в админке. Копия уходит на kolesnikov.denis@dymovceramic.ru.',
    sourceFile: 'backend/shipments-admin/index.py — _send_painting_reminder_email / _auto_send_painting_reminders',
    active: true,
    defaultSubject: 'Ваше изделие прошло обжиг',
    defaultBody:
      'Уважаемый клиент!\n\n' +
      'Школа керамики Дымов Керамики рада сообщить, что Ваше изделие прошло обжиг.\n\n' +
      'Номер заявки: {tracking_number}\n\n' +
      'Если Вы хотите расписать изделие — запишитесь на мастер-класс «Роспись ангобами» ' +
      'на сайте {site_url}/moscow/workshops/angoby или по телефону {phone}.\n\n' +
      'Если роспись не требуется — Вы можете просто приехать и забрать готовое изделие.\n\n' +
      'Контакты: {site_url}/moscow/contacts',
    variables: [
      { key: 'tracking_number', label: 'Номер заявки' },
      { key: 'phone', label: 'Телефон администратора' },
      { key: 'site_url', label: 'Адрес сайта' },
    ],
  },
  {
    id: 'ready-for-pickup',
    subject: 'Ваше изделие готово к выдаче',
    recipient: 'Клиент (email из заявки на посылку)',
    triggerType: 'manual',
    triggerLabel: 'Менеджер ВДНХ нажимает «Готово» на изделии в разделе «Изделия (Москва)»',
    content:
      'Сообщает, что изделие готово к выдаче: адрес и время работы студии, срок хранения (60 дней с даты заявки) и дата, до которой нужно забрать.',
    conditions: 'Отправляется только если у клиента указан email в заявке. Копия уходит на kolesnikov.denis@dymovceramic.ru.',
    sourceFile: 'backend/shipments-admin/index.py — _send_ready_email',
    active: true,
    defaultSubject: 'Ваше изделие готово к выдаче',
    defaultBody:
      'Уважаемый клиент!\n\n' +
      'Школа керамики Дымов Керамики рада сообщить, что Ваше изделие прошло обжиг ' +
      'и готово к выдаче.\n\n' +
      'Номер заявки: {tracking_number}\n' +
      'Адрес: {address}\n' +
      'Время работы: {work_hours}\n\n' +
      'Срок хранения изделия — 60 календарных дней с даты оформления заявки. ' +
      'Пожалуйста, заберите изделие до {storage_until} включительно. ' +
      'По истечении этого срока мы оставляем за собой право утилизировать изделие ' +
      'либо передать его на благотворительную ярмарку.\n\n' +
      'Контакты: {site_url}/moscow/contacts',
    variables: [
      { key: 'tracking_number', label: 'Номер заявки' },
      { key: 'address', label: 'Адрес выдачи' },
      { key: 'work_hours', label: 'Время работы' },
      { key: 'storage_until', label: 'Дата, до которой хранится изделие' },
      { key: 'site_url', label: 'Адрес сайта' },
    ],
  },
  {
    id: 'sent-to-vdnh',
    subject: 'Ваше изделие готово к выдаче в Москве',
    recipient: 'Клиент (email из заявки на посылку, Суздаль)',
    triggerType: 'manual',
    triggerLabel: 'Менеджер Суздаля нажимает «Отправить на ВДНХ» на изделии в разделе «Изделия (Суздаль)»',
    content:
      'Сообщает, что изделие из Суздаля прибыло в Москву и готово к выдаче: номер заявки, адрес и время работы студии на ВДНХ, ссылка на отслеживание и контакты, телефон администратора Школы в Москве.',
    conditions:
      'Отправляется только если у клиента указан email в заявке. Письмо намеренно отправляется с формулировкой «прибыло и готово», а не «отправлено», так как реальная доставка занимает около 1 дня и к моменту письма изделие уже физически в Москве. Копия уходит на kolesnikov.denis@dymovceramic.ru.',
    sourceFile: 'backend/shipments-admin/index.py — _send_sent_to_vdnh_email',
    active: true,
    defaultSubject: 'Ваше изделие готово к выдаче в Москве',
    defaultBody:
      'Уважаемый клиент!\n\n' +
      'Школа керамики Дымов Керамики сообщает, что Ваше изделие из Суздаля прибыло в Москву и готово к выдаче\n\n' +
      'Номер заявки: {tracking_number}\n\n' +
      'Забрать изделие можно будет по адресу: {address}\n' +
      'Время работы: {work_hours}\n\n' +
      'Отследить статус изделия можно на сайте: {site_url}/tracking\n' +
      'Контакты: {site_url}/moscow/contacts\n\n' +
      'Телефон администратора Школы в Москве: +7 (985) 419-89-03',
    variables: [
      { key: 'tracking_number', label: 'Номер заявки' },
      { key: 'address', label: 'Адрес выдачи' },
      { key: 'work_hours', label: 'Время работы' },
      { key: 'site_url', label: 'Адрес сайта' },
    ],
  },
  {
    id: 'pickup-reminder',
    subject: 'Напоминаем: заберите изделие из Суздаля',
    recipient: 'Клиент (email из заявки на посылку, Суздаль)',
    triggerType: 'auto',
    triggerLabel: 'Автоматически, каждые 10 дней после письма «Отправлено на ВДНХ», пока изделие не выдано',
    content:
      'Повторное напоминание забрать изделие из Суздаля, которое ждёт клиента на ВДНХ в Москве: номер заявки, адрес и время работы студии, дата, после которой изделие утилизируется (60 дней с даты отправки в Москву), ссылка на отслеживание и контакты.',
    conditions:
      'Первое напоминание уходит через 10 дней после отправки на ВДНХ, затем каждые 10 дней. Останавливается, когда изделие выдано (статус «Выдано») либо истёк срок хранения (60 дней с даты прибытия в Москву). Проверяется автоматически при каждом открытии вкладки «Изделия (Суздаль)» в панели менеджера. Копия уходит на kolesnikov.denis@dymovceramic.ru.',
    sourceFile: 'backend/shipments-admin/index.py — _send_pickup_reminder_email / _auto_send_pickup_reminders',
    active: true,
    defaultSubject: 'Напоминаем: заберите изделие из Суздаля',
    defaultBody:
      'Уважаемый клиент!\n\n' +
      'Напоминаем, что Ваше изделие из Суздаля ждёт Вас в Москве, в школе керамики на ВДНХ.\n\n' +
      'Номер заявки: {tracking_number}\n\n' +
      'Забрать изделие можно по адресу: {address}\n' +
      'Время работы: {work_hours}\n\n' +
      'Обращаем внимание: изделие хранится 60 дней с момента прибытия в Москву. ' +
      'После {utilize_date} мы будем вынуждены утилизировать изделие либо передать его на ' +
      'благотворительную ярмарку — пожалуйста, заберите его до этой даты.\n\n' +
      'Отследить статус изделия можно на сайте: {site_url}/tracking\n' +
      'Контакты: {site_url}/moscow/contacts\n\n' +
      'Телефон администратора Школы в Москве: +7 (985) 419-89-03',
    variables: [
      { key: 'tracking_number', label: 'Номер заявки' },
      { key: 'address', label: 'Адрес выдачи' },
      { key: 'work_hours', label: 'Время работы' },
      { key: 'utilize_date', label: 'Дата утилизации (60 дней с прибытия)' },
      { key: 'site_url', label: 'Адрес сайта' },
    ],
  },
  {
    id: 'gift-hint',
    subject: 'Вам письмо — маленький секрет...',
    recipient: 'Получатель подарка (email из формы «Намекнуть на подарок»)',
    triggerType: 'form',
    triggerLabel: 'Клиент отправляет форму «Намекнуть на подарок» на странице мастер-класса или сертификатов',
    content:
      'Анонимное письмо-намёк: «кто-то хочет вас порадовать», без раскрытия, что именно и кто отправитель. Если в форме было заполнено поле «Сообщение» — оно добавляется отдельным блоком в конце письма.',
    conditions: 'Копия уходит на kolesnikov.denis@dymovceramic.ru. Блок с сообщением от отправителя добавляется автоматически после основного текста и не входит в редактируемый шаблон.',
    sourceFile: 'backend/gift-hint/index.py — _send_gift_hint_email',
    active: true,
    defaultSubject: 'Вам письмо — маленький секрет...',
    defaultBody:
      'Здравствуйте!\n\n' +
      'Это письмо — тайный намёк от человека, которому Вы небезразличны.\n\n' +
      'В ближайшее время Вас ждёт приятный сюрприз. Что это будет — пока секрет. ' +
      'Но обещаем: Вам точно понравится.\n\n' +
      'Осталось совсем немного — и Вы узнаете всё сами.\n\n' +
      'А пока просто знайте: кто-то очень хочет Вас порадовать.\n\n' +
      'С уважением и самыми тёплыми пожеланиями,\n' +
      'Ваш тайный отправитель',
    variables: [],
  },
  {
    id: 'order-notify',
    subject: 'Новый заказ с сайта',
    recipient: 'Менеджер (NOTIFY_EMAIL / NOTIFY_EMAIL_SUZDAL) + копия на uxdesign30@gmail.com и kolesnikov.denis@dymovceramic.ru',
    triggerType: 'form',
    triggerLabel: 'Клиент оформляет заказ в корзине (мастер-класс, сертификат)',
    content: 'Город, имя/email/телефон клиента, способ оплаты, комментарий, сумма и полный состав заказа.',
    sourceFile: 'backend/orders/index.py — _send_notification',
    active: true,
    defaultSubject: 'Новый заказ с сайта',
    defaultBody:
      'Новый заказ с сайта.\n\n' +
      'Город: {city_label}\n' +
      'Имя: {name}\n' +
      'Email: {email}\n' +
      'Телефон: {phone}\n' +
      'Способ оплаты: {payment}\n' +
      'Комментарий: {comment}\n' +
      'Сумма: {total} ₽\n\n' +
      'Состав заказа:\n{items_text}',
    variables: [
      { key: 'city_label', label: 'Город' },
      { key: 'name', label: 'Имя клиента' },
      { key: 'email', label: 'Email клиента' },
      { key: 'phone', label: 'Телефон клиента' },
      { key: 'payment', label: 'Способ оплаты' },
      { key: 'comment', label: 'Комментарий клиента' },
      { key: 'total', label: 'Сумма заказа' },
      { key: 'items_text', label: 'Состав заказа (список позиций)' },
    ],
  },
  {
    id: 'question-notify',
    subject: 'Новый вопрос с сайта',
    recipient: 'Менеджер (NOTIFY_EMAIL / NOTIFY_EMAIL_SUZDAL) + копия на uxdesign30@gmail.com и kolesnikov.denis@dymovceramic.ru',
    triggerType: 'form',
    triggerLabel: 'Клиент отправляет форму «Задать вопрос»',
    content: 'Город, email и телефон клиента, текст вопроса/комментария.',
    sourceFile: 'backend/question/index.py',
    active: true,
    defaultSubject: 'Новый вопрос с сайта',
    defaultBody:
      'Новый вопрос с сайта.\n\n' +
      'Город: {city_label}\n' +
      'Email клиента: {email}\n' +
      'Телефон клиента: {phone}\n' +
      'Комментарий: {comment}\n',
    variables: [
      { key: 'city_label', label: 'Город' },
      { key: 'email', label: 'Email клиента' },
      { key: 'phone', label: 'Телефон клиента' },
      { key: 'comment', label: 'Комментарий клиента' },
    ],
  },
  {
    id: 'booking-request-notify',
    subject: 'Заявка на групповую запись',
    recipient: 'Менеджер (NOTIFY_EMAIL / NOTIFY_EMAIL_SUZDAL) + копия на uxdesign30@gmail.com и kolesnikov.denis@dymovceramic.ru',
    triggerType: 'form',
    triggerLabel: 'Клиент отправляет заявку на групповую/детскую запись',
    content: 'Город, название услуги, количество участников, email и телефон клиента.',
    sourceFile: 'backend/booking-request/index.py',
    active: true,
    defaultSubject: 'Заявка на групповую запись',
    defaultBody:
      'Новая заявка на групповую запись с сайта.\n\n' +
      'Город: {city_label}\n' +
      'Услуга: {service}\n' +
      'Количество участников: {people}\n' +
      'Email клиента: {email}\n' +
      'Телефон клиента: {phone}\n\n' +
      'Свяжитесь с клиентом, чтобы уточнить дату посещения.',
    variables: [
      { key: 'city_label', label: 'Город' },
      { key: 'service', label: 'Название услуги' },
      { key: 'people', label: 'Количество участников' },
      { key: 'email', label: 'Email клиента' },
      { key: 'phone', label: 'Телефон клиента' },
    ],
  },
];