import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { usePageMeta } from '@/hooks/usePageMeta';
import func2url from '../../backend/func2url.json';

const SESSION_KEY = 'manager-session-token';

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
  status: string;
  city: string;
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

const cityLabel = (c: string) => (c === 'suzdal' ? 'Суздаль' : 'Москва');

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  new: { label: 'Новый', className: 'bg-primary/10 text-primary' },
  pending: { label: 'Ожидает оплаты', className: 'bg-amber-100 text-amber-700' },
  paid: { label: 'Оплачен', className: 'bg-emerald-100 text-emerald-700' },
  completed: { label: 'Выполнен', className: 'bg-emerald-100 text-emerald-700' },
  canceled: { label: 'Отменён', className: 'bg-red-100 text-red-700' },
  booked: { label: 'Записан на МК', className: 'bg-blue-100 text-blue-700' },
  pickup: { label: 'Самовывоз', className: 'bg-secondary text-muted-foreground' },
};

const statusBadge = (status: string) => {
  const s = STATUS_LABELS[status] || { label: status, className: 'bg-secondary text-muted-foreground' };
  return (
    <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${s.className}`}>
      {s.label}
    </span>
  );
};

const Admin = () => {
  usePageMeta({
    title: 'Админ-панель «Дымов Керамика»',
    description: 'Служебная страница управления заказами и заявками.',
    noindex: true,
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [managerName, setManagerName] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tab, setTab] = useState<'orders' | 'leads'>('orders');

  const loadData = async (sessionToken: string) => {
    setLoading(true);
    try {
      const resp = await fetch(func2url.admin, {
        headers: { 'X-Session-Token': sessionToken },
      });
      if (resp.status === 401) {
        localStorage.removeItem(SESSION_KEY);
        setToken(null);
        setAuthed(false);
        toast({ title: 'Сессия истекла', description: 'Войдите снова.' });
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

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) {
      setCheckingSession(false);
      return;
    }
    (async () => {
      try {
        const resp = await fetch(func2url['manager-auth'], {
          headers: { 'X-Session-Token': saved },
        });
        if (resp.ok) {
          const data = await resp.json();
          setToken(saved);
          setManagerName(data.name || data.email);
          await loadData(saved);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      } finally {
        setCheckingSession(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async () => {
    setLoginLoading(true);
    try {
      const resp = await fetch(func2url['manager-auth'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось войти' });
        return;
      }
      localStorage.setItem(SESSION_KEY, data.token);
      setToken(data.token);
      setManagerName(data.name || data.email);
      await loadData(data.token);
    } catch {
      toast({ title: 'Ошибка входа', description: 'Попробуйте позже.' });
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setToken(null);
    setAuthed(false);
    setOrders([]);
    setLeads([]);
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!authed || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="Lock" size={26} />
            </span>
            <h1 className="mt-5 font-display text-2xl font-semibold">Панель управления</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Войдите, чтобы увидеть заказы и заявки
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
            className="mt-6 space-y-3"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoFocus
              autoComplete="username"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={loginLoading || !email || !password}
            >
              {loginLoading ? 'Проверяем…' : 'Войти'}
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
          <div>
            <h1 className="font-display text-3xl font-semibold">Заказы и заявки</h1>
            {managerName && (
              <p className="mt-1 text-sm text-muted-foreground">Вы вошли как {managerName}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => token && loadData(token)}
              disabled={loading}
            >
              <Icon name="RefreshCcw" size={15} className="mr-2" /> Обновить
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full" onClick={logout}>
              <Icon name="LogOut" size={15} className="mr-2" /> Выйти
            </Button>
          </div>
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
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg font-semibold">Заказ № {o.number}</span>
                    {statusBadge(o.status)}
                    <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-medium text-muted-foreground">
                      {cityLabel(o.city)}
                    </span>
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
