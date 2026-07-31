/**
 * СПРАВОЧНИК всех email-рассылок проекта — для раздела админки «Email-рассылки».
 *
 * ВАЖНО: при добавлении/изменении/удалении любой отправки письма в папке backend
 * (любой вызов server.sendmail в index.py) — обязательно обновляй этот файл в
 * том же наборе правок, чтобы справочник в админке не расходился с кодом.
 */

export type EmailTrigger = 'auto' | 'manual' | 'form';

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
  },
  {
    id: 'sent-to-vdnh',
    subject: 'Ваше изделие готово к выдаче в Москве',
    recipient: 'Клиент (email из заявки на посылку, Суздаль)',
    triggerType: 'manual',
    triggerLabel: 'Менеджер Суздаля нажимает «Отправить на ВДНХ» или «Отправить повторно» на изделии в разделе «Изделия (Суздаль)»',
    content:
      'Сообщает, что изделие из Суздаля прибыло в Москву и готово к выдаче: номер заявки, адрес и время работы студии на ВДНХ, ссылка на отслеживание и контакты, телефон администратора Школы в Москве.',
    conditions:
      'Отправляется только если у клиента указан email в заявке. Письмо намеренно отправляется с формулировкой «прибыло и готово», а не «отправлено», так как реальная доставка занимает около 1 дня и к моменту письма изделие уже физически в Москве. Копия уходит на kolesnikov.denis@dymovceramic.ru.',
    sourceFile: 'backend/shipments-admin/index.py — _send_sent_to_vdnh_email',
    active: true,
  },
  {
    id: 'gift-hint',
    subject: 'Вам письмо — маленький секрет...',
    recipient: 'Получатель подарка (email из формы «Намекнуть на подарок»)',
    triggerType: 'form',
    triggerLabel: 'Клиент отправляет форму «Намекнуть на подарок» на странице мастер-класса или сертификатов',
    content:
      'Анонимное письмо-намёк: «кто-то хочет вас порадовать», без раскрытия, что именно и кто отправитель. Если в форме было заполнено поле «Сообщение» — оно добавляется отдельным блоком в конце письма.',
    conditions: 'Копия уходит на kolesnikov.denis@dymovceramic.ru.',
    sourceFile: 'backend/gift-hint/index.py — _send_gift_hint_email',
    active: true,
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
  },
];