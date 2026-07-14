import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useCity } from '@/hooks/useCity';
import { CITIES } from '@/lib/cities';
import func2url from '../../../backend/func2url.json';

interface OrderStatus {
  number: string;
  name: string;
  payment: string;
  total: number;
  status: string;
  paid_at: string | null;
}

const POLL_INTERVAL = 3000;
const MAX_POLLS = 15;

const OrderPaymentStatus = () => {
  const [params] = useSearchParams();
  const number = params.get('number') || '';
  const city = useCity();
  const cityConfig = CITIES[city];
  const isSuzdal = city === 'suzdal';
  const browseTo = isSuzdal ? '/suzdal/workshops' : '/moscow/formats';
  const browseLabel = isSuzdal ? 'К другим мастер-классам' : 'К другим форматам';

  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!number) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      try {
        const resp = await fetch(`${func2url.orders}?number=${encodeURIComponent(number)}`);
        if (!resp.ok) {
          if (!cancelled) setNotFound(true);
          return;
        }
        const data: OrderStatus = await resp.json();
        if (cancelled) return;
        setOrder(data);
        setLoading(false);

        attempts += 1;
        if (data.status === 'pending' && attempts < MAX_POLLS) {
          setTimeout(poll, POLL_INTERVAL);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [number]);

  const isPaid = order?.status === 'paid';
  const isPending = order?.status === 'pending';
  const isCanceled = order?.status === 'canceled';

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader />

      <div className="container py-16 md:py-24">
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-xl md:p-10">
          {loading && (
            <>
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="mt-5 text-lg font-medium">Проверяем статус оплаты…</p>
            </>
          )}

          {!loading && notFound && (
            <>
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <Icon name="CircleAlert" size={32} />
              </span>
              <h1 className="mt-5 font-display text-2xl font-semibold">Заказ не найден</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Проверьте ссылку или свяжитесь с нами по телефону.
              </p>
            </>
          )}

          {!loading && !notFound && order && (
            <>
              <span
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                  isPaid
                    ? 'bg-primary/10 text-primary'
                    : isCanceled
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-amber-100 text-amber-600'
                }`}
              >
                <Icon
                  name={isPaid ? 'CircleCheck' : isCanceled ? 'CircleX' : 'Clock'}
                  size={32}
                />
              </span>
              <h1 className="mt-5 font-display text-2xl font-semibold">
                {isPaid && 'Оплата прошла успешно!'}
                {isCanceled && 'Платёж отменён'}
                {isPending && 'Ожидаем подтверждение оплаты'}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {isPaid &&
                  `Спасибо, ${order.name.split(' ')[0]}! Мы получили оплату по заказу.`}
                {isCanceled && 'Платёж не был завершён. Вы можете попробовать снова.'}
                {isPending &&
                  'Обычно это занимает несколько секунд. Страница обновится автоматически.'}
              </p>
              <div className="mt-6 rounded-xl bg-secondary/40 px-5 py-4 text-sm">
                <p>
                  Заказ № <span className="font-semibold">{order.number}</span>
                </p>
                <p className="mt-1">
                  Сумма: <span className="font-semibold">{order.total.toLocaleString('ru-RU')} ₽</span>
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="flex-1 rounded-full">
                  <Link to={browseTo}>
                    <Icon name="LayoutGrid" size={18} className="mr-2" /> {browseLabel}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1 rounded-full">
                  <Link to={cityConfig.path}>На главную</Link>
                </Button>
              </div>
            </>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Вопросы по заказу? Звоните{' '}
            <a href={cityConfig.phoneHref} className="font-medium text-primary">
              {cityConfig.phone}
            </a>
          </p>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default OrderPaymentStatus;
