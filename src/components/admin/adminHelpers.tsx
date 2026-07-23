import Icon from '@/components/ui/icon';

export interface OrderItem {
  id?: string;
  title: string;
  details?: string;
  qty: number;
  price: number;
}

export interface Order {
  id: number;
  number: string;
  name: string;
  email: string;
  phone: string;
  comment?: string;
  payment: string;
  total: number;
  items: OrderItem[];
  created_at: string;
  status: string;
  city: string;
  certificate_number: string | null;
  yookassa_payment_id?: string | null;
}

export interface Lead {
  id: number;
  service?: string;
  people?: number;
  email?: string;
  phone?: string;
  created_at: string;
}

export const fmtDate = (s: string) => {
  try {
    return new Date(s).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return s;
  }
};

export const paymentLabel = (p: string) =>
  p === 'online' ? 'Онлайн (ЮKassa)' : 'Наличными на кассе';

export const cityLabel = (c: string) => (c === 'suzdal' ? 'Суздаль' : 'Москва');

export const cityBadge = (c: string) => {
  const isSuzdal = c === 'suzdal';
  return (
    <span
      className={`flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium ${
        isSuzdal ? 'bg-violet-100 text-violet-700' : 'bg-sky-100 text-sky-700'
      }`}
    >
      <Icon name="MapPin" size={12} />
      {cityLabel(c)}
    </span>
  );
};

export const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  new: { label: 'Новый', className: 'bg-primary/10 text-primary' },
  pending: { label: 'Ожидает оплаты', className: 'bg-amber-100 text-amber-700' },
  paid: { label: 'Оплачен', className: 'bg-emerald-100 text-emerald-700' },
  completed: { label: 'Выполнен', className: 'bg-emerald-100 text-emerald-700' },
  canceled: { label: 'Отменён', className: 'bg-red-100 text-red-700' },
  booked: { label: 'Записан на МК', className: 'bg-blue-100 text-blue-700' },
  pickup: { label: 'Самовывоз', className: 'bg-secondary text-muted-foreground' },
};

export const statusBadge = (status: string) => {
  const s = STATUS_LABELS[status] || { label: status, className: 'bg-secondary text-muted-foreground' };
  return (
    <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${s.className}`}>
      {s.label}
    </span>
  );
};