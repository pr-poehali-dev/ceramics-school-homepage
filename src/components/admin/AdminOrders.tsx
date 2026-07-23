import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Order, fmtDate, paymentLabel, cityBadge, statusBadge } from './adminHelpers';

interface Props {
  orders: Order[];
  filteredOrders: Order[];
  paginatedOrders: Order[];
  cityFilter: 'moscow' | 'suzdal' | 'all';
  setCityFilter: (v: 'moscow' | 'suzdal' | 'all') => void;
  ordersPage: number;
  setOrdersPage: (updater: (p: number) => number) => void;
  totalOrdersPages: number;
  certDrafts: Record<number, string>;
  setCertDrafts: (updater: (prev: Record<number, string>) => Record<number, string>) => void;
  savingCertId: number | null;
  onSaveCertificateNumber: (orderId: number) => void;
}

const AdminOrders = ({
  orders,
  filteredOrders,
  paginatedOrders,
  cityFilter,
  setCityFilter,
  ordersPage,
  setOrdersPage,
  totalOrdersPages,
  certDrafts,
  setCertDrafts,
  savingCertId,
  onSaveCertificateNumber,
}: Props) => {
  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        {(['moscow', 'suzdal', 'all'] as const).map((c) => (
          <button
            key={c}
            onClick={() => {
              setCityFilter(c);
              setOrdersPage(() => 1);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              cityFilter === c
                ? 'bg-foreground text-background'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            {c === 'moscow' ? 'Москва' : c === 'suzdal' ? 'Суздаль' : 'Все города'}
            {' '}({(c === 'all' ? orders : orders.filter((o) => o.city === c)).length})
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filteredOrders.length === 0 && (
          <p className="text-sm text-muted-foreground">Заказов пока нет.</p>
        )}
        {paginatedOrders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-lg font-semibold">Заказ № {o.number}</span>
                {statusBadge(o.status)}
                {cityBadge(o.city)}
              </div>
              <span className="text-sm text-muted-foreground">{fmtDate(o.created_at)}</span>
            </div>
            <div className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
              <p><span className="text-muted-foreground">Клиент:</span> {o.name}</p>
              <p><span className="text-muted-foreground">Телефон:</span> {o.phone}</p>
              {o.email && <p><span className="text-muted-foreground">Email:</span> {o.email}</p>}
              <p><span className="text-muted-foreground">Оплата:</span> {paymentLabel(o.payment)}</p>
            </div>
            {o.comment && (
              <p className="mt-2 text-sm">
                <span className="text-muted-foreground">Комментарий:</span> {o.comment}
              </p>
            )}
            <div className="mt-3 divide-y divide-border rounded-xl border border-border">
              {(o.items || []).map((it, i) => (
                <div key={i} className="flex items-center justify-between gap-3 px-4 py-2 text-sm">
                  <span>
                    {it.title}
                    {it.details ? ` · ${it.details}` : ''} × {it.qty}
                  </span>
                  <span className="shrink-0 font-medium">
                    {(it.price * it.qty).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-right font-semibold text-primary">
              Итого: {o.total.toLocaleString('ru-RU')} ₽
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
              <label className="text-sm text-muted-foreground shrink-0">
                Номер сертификата:
              </label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={certDrafts[o.id] ?? ''}
                onChange={(e) =>
                  setCertDrafts((prev) => ({
                    ...prev,
                    [o.id]: e.target.value.replace(/\D/g, ''),
                  }))
                }
                placeholder="Введите номер"
                className="h-9 w-40 rounded-full"
              />
              <Button
                size="sm"
                className="rounded-full"
                onClick={() => onSaveCertificateNumber(o.id)}
                disabled={savingCertId === o.id}
              >
                {savingCertId === o.id ? 'Сохраняем…' : 'Сохранить'}
              </Button>
            </div>
          </div>
        ))}

        {filteredOrders.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
              disabled={ordersPage <= 1}
            >
              <Icon name="ChevronLeft" size={15} />
            </Button>
            <span className="px-3 text-sm text-muted-foreground">
              Страница {ordersPage} из {totalOrdersPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setOrdersPage((p) => Math.min(totalOrdersPages, p + 1))}
              disabled={ordersPage >= totalOrdersPages}
            >
              <Icon name="ChevronRight" size={15} />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOrders;
