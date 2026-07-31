export interface Shipment {
  id: number;
  trackingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveredAt: string | null;
  status: string;
  issuedAt: string | null;
  photoUrl?: string | null;
  createdAt?: string | null;
}

export const SUZDAL_STATUS_LABEL: Record<string, { label: string; className: string }> = {
  in_progress: { label: 'В работе', className: 'text-amber-600' },
  shipped: { label: 'Отправлено в Москву', className: 'text-sky-600' },
  issued: { label: 'Выдано', className: 'text-emerald-600' },
};

export const SUZDAL_STATUS_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'Все статусы' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'shipped', label: 'Отправлено в Москву' },
  { value: 'issued', label: 'Выдано' },
];

export const fmtDate = (s: string | null) => {
  if (!s) return '—';
  try {
    return new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return s;
  }
};