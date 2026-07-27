export interface MessengerLink {
  key: string;
  name: string;
  icon: string;
  href: string;
}

/**
 * Собирает список активных мессенджеров из редактируемых полей страницы
 * (whatsappLink, telegramLink, maxLink). Пустое поле — мессенджер скрыт.
 */
export const buildMessengerLinks = (fields: Record<string, string>): MessengerLink[] => {
  const list: MessengerLink[] = [];
  if (fields.whatsappLink?.trim()) {
    list.push({ key: 'whatsapp', name: 'WhatsApp', icon: 'MessageCircle', href: fields.whatsappLink.trim() });
  }
  if (fields.telegramLink?.trim()) {
    list.push({ key: 'telegram', name: 'Telegram', icon: 'Send', href: fields.telegramLink.trim() });
  }
  if (fields.maxLink?.trim()) {
    list.push({ key: 'max', name: 'MAX', icon: 'MessageSquare', href: fields.maxLink.trim() });
  }
  return list;
};
