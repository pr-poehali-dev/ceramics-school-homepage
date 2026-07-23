import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { usePageMeta } from '@/hooks/usePageMeta';
import PageContentEditor from '@/components/admin/PageContentEditor';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminBanner from '@/components/admin/AdminBanner';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminLeads from '@/components/admin/AdminLeads';
import { Order, Lead } from '@/components/admin/adminHelpers';
import func2url from '../../backend/func2url.json';

const SESSION_KEY = 'manager-session-token';

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
  const [tab, setTab] = useState<'orders' | 'leads' | 'content'>('orders');
  const [ordersPage, setOrdersPage] = useState(1);
  const ORDERS_PER_PAGE = 10;
  const [cityFilter, setCityFilter] = useState<'moscow' | 'suzdal' | 'all'>('moscow');
  const [certDrafts, setCertDrafts] = useState<Record<number, string>>({});
  const [savingCertId, setSavingCertId] = useState<number | null>(null);
  const [checkingPaymentId, setCheckingPaymentId] = useState<number | null>(null);
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [bannerText, setBannerText] = useState('');
  const [savingBanner, setSavingBanner] = useState(false);

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
      const loadedOrders: Order[] = data.orders || [];
      setOrders(loadedOrders);
      setLeads(data.leads || []);
      setOrdersPage(1);
      setCertDrafts(
        Object.fromEntries(loadedOrders.map((o) => [o.id, o.certificate_number || ''])),
      );
      if (data.banner) {
        setBannerEnabled(Boolean(data.banner.enabled));
        setBannerText(data.banner.text || '');
      }
      setAuthed(true);
    } catch {
      toast({ title: 'Ошибка загрузки', description: 'Попробуйте позже.' });
    } finally {
      setLoading(false);
    }
  };

  const saveCertificateNumber = async (orderId: number) => {
    if (!token) return;
    const value = (certDrafts[orderId] || '').trim();
    setSavingCertId(orderId);
    try {
      const resp = await fetch(func2url.admin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ order_id: orderId, certificate_number: value }),
      });
      if (!resp.ok) throw new Error('fail');
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, certificate_number: value || null } : o)),
      );
      toast({ title: 'Номер сертификата сохранён' });
    } catch {
      toast({ title: 'Не удалось сохранить', description: 'Попробуйте позже.' });
    } finally {
      setSavingCertId(null);
    }
  };

  const checkPayment = async (orderId: number) => {
    if (!token) return;
    setCheckingPaymentId(orderId);
    try {
      const resp = await fetch(func2url.admin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ action: 'check_payment', order_id: orderId }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось проверить оплату' });
        return;
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: data.status } : o)),
      );
      if (data.status === 'paid') {
        toast({ title: 'Оплата подтверждена', description: 'Статус заказа обновлён на «Оплачен».' });
      } else if (data.status === 'canceled') {
        toast({ title: 'Платёж отменён', description: 'Статус заказа обновлён на «Отменён».' });
      } else {
        toast({ title: 'Платёж пока не завершён', description: `Статус в ЮKassa: ${data.yookassa_status || 'неизвестен'}` });
      }
    } catch {
      toast({ title: 'Ошибка проверки', description: 'Попробуйте позже.' });
    } finally {
      setCheckingPaymentId(null);
    }
  };

  const saveBanner = async () => {
    if (!token) return;
    setSavingBanner(true);
    try {
      const resp = await fetch(func2url.admin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({
          banner: { enabled: bannerEnabled, text: bannerText.trim() },
        }),
      });
      if (!resp.ok) throw new Error('fail');
      toast({ title: 'Плашка сохранена' });
    } catch {
      toast({ title: 'Не удалось сохранить', description: 'Попробуйте позже.' });
    } finally {
      setSavingBanner(false);
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

  const filteredOrders =
    cityFilter === 'all' ? orders : orders.filter((o) => o.city === cityFilter);
  const totalOrdersPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
  const paginatedOrders = filteredOrders.slice(
    (ordersPage - 1) * ORDERS_PER_PAGE,
    ordersPage * ORDERS_PER_PAGE,
  );

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!authed || !token) {
    return (
      <AdminLogin
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loginLoading={loginLoading}
        onSubmit={login}
      />
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

        {/* УПРАВЛЕНИЕ ПЛАШКОЙ */}
        <AdminBanner
          bannerEnabled={bannerEnabled}
          setBannerEnabled={setBannerEnabled}
          bannerText={bannerText}
          setBannerText={setBannerText}
          savingBanner={savingBanner}
          onSave={saveBanner}
        />

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
          <button
            onClick={() => setTab('content')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              tab === 'content' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}
          >
            Контент страниц
          </button>
        </div>

        {tab === 'content' && token && <PageContentEditor token={token} />}

        {tab === 'orders' && (
          <AdminOrders
            orders={orders}
            filteredOrders={filteredOrders}
            paginatedOrders={paginatedOrders}
            cityFilter={cityFilter}
            setCityFilter={setCityFilter}
            ordersPage={ordersPage}
            setOrdersPage={setOrdersPage}
            totalOrdersPages={totalOrdersPages}
            certDrafts={certDrafts}
            setCertDrafts={setCertDrafts}
            savingCertId={savingCertId}
            onSaveCertificateNumber={saveCertificateNumber}
            checkingPaymentId={checkingPaymentId}
            onCheckPayment={checkPayment}
          />
        )}

        {tab === 'leads' && <AdminLeads leads={leads} />}
      </div>
    </div>
  );
};

export default Admin;