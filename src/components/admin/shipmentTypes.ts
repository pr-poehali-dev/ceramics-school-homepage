export interface Shipment {
  id: number;
  trackingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveredAt: string | null;
  returnAt: string | null;
  status: string;
  issuedAt: string | null;
}

export const fmtDate = (s: string | null) => {
  if (!s) return '—';
  try {
    return new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return s;
  }
};
