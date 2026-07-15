import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { itemImage } from '@/lib/itemImage';
import { useCity } from '@/hooks/useCity';
import { CITIES } from '@/lib/cities';
import { OrderResult } from '@/pages/checkout/OrderSuccess';

const SCHOOL_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/files/29020e4b-5aca-45b7-87b4-00a7d642fd92.jpg';

const REDIRECT_SECONDS = 4;

interface OrderPaymentRedirectProps {
  orderResult: OrderResult;
  paymentUrl: string;
}

const OrderPaymentRedirect = ({ orderResult, paymentUrl }: OrderPaymentRedirectProps) => {
  const city = useCity();
  const cityConfig = CITIES[city];
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      window.location.href = paymentUrl;
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, paymentUrl]);

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader />

      {/* HERO */}
      <div className="relative overflow-hidden">
        <img
          src={SCHOOL_IMG}
          alt="Школа керамики Дымов Керамика"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40" />
        <div className="relative container flex flex-col items-center py-16 text-center text-white md:py-20">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <Icon name="CircleCheck" size={38} />
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold md:text-5xl">
            Заказ № {orderResult.number} оформлен!
          </h1>
          <p className="mt-3 max-w-lg text-white/85">
            Осталось оплатить заказ онлайн — сейчас мы перенаправим вас на защищённую страницу
            оплаты ЮKassa.
          </p>
        </div>
      </div>

      <div className="container -mt-10 pb-16">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* REDIRECT NOTICE */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="flex h-10 w-10 shrink-0 animate-spin items-center justify-center rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-base font-medium">
                Переход на оплату через {secondsLeft} сек…
              </p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Если переход не произошёл автоматически, нажмите на кнопку ниже.
            </p>
            <Button asChild size="lg" className="mt-5 rounded-full px-8">
              <a href={paymentUrl}>
                <Icon name="CreditCard" size={18} className="mr-2" /> Перейти к оплате
              </a>
            </Button>
          </div>

          {/* ORDER SUMMARY */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-display text-xl font-semibold">Состав заказа</h2>
            </div>
            <div className="divide-y divide-border">
              {orderResult.lines.map((line) => (
                <div key={line.id} className="flex items-center gap-4 px-6 py-4">
                  <img
                    src={itemImage(line.id)}
                    alt={line.title}
                    className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-tight">{line.title}</p>
                    {line.details && (
                      <p className="mt-0.5 text-sm text-muted-foreground">{line.details}</p>
                    )}
                    <p className="mt-0.5 text-sm text-muted-foreground">{line.qty} шт.</p>
                  </div>
                  <span className="shrink-0 font-semibold">
                    {(line.price * line.qty).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between bg-secondary/40 px-6 py-4">
              <span className="font-semibold">Итого к оплате</span>
              <span className="font-display text-2xl font-semibold text-primary">
                {orderResult.total.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

          {/* CONTACTS */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Icon name="User" size={16} className="text-primary" /> Контакты
            </p>
            <p className="mt-1.5 text-sm">{orderResult.phone}</p>
            <p className="text-sm text-muted-foreground">{orderResult.email}</p>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Вопросы по заказу? Звоните{' '}
            <a href={cityConfig.phoneHref} className="font-semibold text-primary hover:underline">
              {cityConfig.phone}
            </a>
          </p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default OrderPaymentRedirect;
