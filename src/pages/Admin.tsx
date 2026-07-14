import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { usePageMeta } from '@/hooks/usePageMeta';
import func2url from '../../backend/func2url.json';

interface OrderItem {
  id?: string;
  title: string;
  details?: string;
  qty: number;
  price: number;
}

interface Order {
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
}

interface Lead {
  id: number;
  service?: string;
  people?: number;
  email?: string;
  phone?: string;
  created_at: string;
}

const fmtDate = (s: string) => {
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

const paymentLabel = (p: string) =>
  p === 'online' ? 'Онлайн (ЮKassa)' : 'Наличными на кассе';

const Admin = () => {
  usePageMeta({
    title: 'Админ-панель «Дымов Керамика»',
    description: 'Служебная страница управления заказами и заявками.',
    noindex: true,
  });
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tab, setTab] = useState<'orders' | 'leads'>('orders');

  const load = async (pwd: string) => {
    setLoading(true);
    try {
      const resp = await fetch(func2url.admin, {
        headers: { 'X-Admin-Password': pwd },
      });
      if (resp.status === 401) {
        toast({ title: 'Неверный пароль' });
        return;
      }
      if (!resp.ok) throw new Error('fail');
      const data = await resp.json();
      setOrders(data.orders || []);
      setLeads(data.leads || []);
      setAuthed(true);
    } catch {
      toast({ title: 'Ошибка загрузки', description: 'Попробуйте позже.' });
    } finally {
      setLoading(false);
    }
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="Lock" size={26} />
            </span>
            <h1 className="mt-5 font-display text-2xl font-semibold">Панель управления</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Введите пароль для доступа к заказам и заявкам
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              load(password);
            }}
            className="mt-6 space-y-3"
          >
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              autoFocus
            />
            <Button type="submit" className="w-full rounded-full" disabled={loading || !password}>
              {loading ? 'Проверяем…' : 'Войти'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-semibold">Заказы и заявки</h1>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => load(password)}
            disabled={loading}
          >
            <Icon name="RefreshCcw" size={15} className="mr-2" /> Обновить
          </Button>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setTab('orders')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              tab === 'orders' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}
          >
            Заказы ({orders.length})
          </button>
          <button
            onClick={() => setTab('leads')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              tab === 'leads' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}
          >
            Заявки ({leads.length})
          </button>
        </div>

        {tab === 'orders' && (
          <div className="mt-6 space-y-4">
            {orders.length === 0 && (
              <p className="text-sm text-muted-foreground">Заказов пока нет.</p>
            )}
            {orders.map((o) => (
              <div key={o.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-lg font-semibold">Заказ № {o.number}</span>
                  <span className="text-sm text-muted-foreground">{fmtDate(o.created_at)}</span>
                </div>
                <div className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                  <p><span className="text-muted-foreground">Клиент:</span> {o.name}</p>
                  <p><span className="text-muted-foreground">Телефон:</span> {o.phone}</p>
                  <p><span className="text-muted-foreground">Email:</span> {o.email}</p>
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
              </div>
            ))}
          </div>
        )}

        {tab === 'leads' && (
          <div className="mt-6 space-y-3">
            {leads.length === 0 && (
              <p className="text-sm text-muted-foreground">Заявок пока нет.</p>
            )}
            {leads.map((l) => (
              <div key={l.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{l.service || 'Заявка'}</span>
                  <span className="text-sm text-muted-foreground">{fmtDate(l.created_at)}</span>
                </div>
                <div className="mt-2 grid gap-1 text-sm sm:grid-cols-3">
                  {l.people != null && (
                    <p><span className="text-muted-foreground">Участников:</span> {l.people}</p>
                  )}
                  <p><span className="text-muted-foreground">Телефон:</span> {l.phone}</p>
                  <p><span className="text-muted-foreground">Email:</span> {l.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;