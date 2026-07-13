import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { itemImage } from '@/lib/itemImage';
import { useCity } from '@/hooks/useCity';
import { CITIES } from '@/lib/cities';

const SCHOOL_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/files/29020e4b-5aca-45b7-87b4-00a7d642fd92.jpg';

export interface CertificateResult {
  title: string;
  email: string;
  code: string;
  pdfUrl: string;
  validUntil: string;
}

export interface OrderLine {
  id: string;
  title: string;
  details?: string;
  qty: number;
  price: number;
}

export interface OrderResult {
  number: string;
  name: string;
  email: string;
  phone: string;
  payment: string;
  total: number;
  lines: OrderLine[];
  certificates: CertificateResult[];
}

interface OrderSuccessProps {
  orderResult: OrderResult;
}

const OrderSuccess = ({ orderResult }: OrderSuccessProps) => {
  const city = useCity();
  const isSuzdal = city === 'suzdal';
  const cityConfig = CITIES[city];
  const browseTo = isSuzdal ? '/suzdal/workshops' : '/moscow/formats';
  const browseLabel = isSuzdal ? 'К другим мастер-классам' : 'К другим форматам';

  const paymentLabel =
    orderResult.payment === 'online'
      ? 'Онлайн-оплата ЮKassa'
      : 'Оплата наличными на кассе Школы керамики';

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
            Спасибо за заказ, {orderResult.name.split(' ')[0]}!
          </h1>
          <p className="mt-3 max-w-lg text-white/85">
            Мы приняли ваш заказ. Подтверждение отправили на {orderResult.email} — скоро с вами
            свяжется представитель {isSuzdal ? 'фабрики' : 'школы'}.
          </p>
          <span className="mt-6 rounded-full bg-white/15 px-5 py-2 text-sm font-medium backdrop-blur">
            Заказ № {orderResult.number}
          </span>
        </div>
      </div>

      <div className="container -mt-10 pb-16">
        <div className="mx-auto max-w-2xl space-y-6">
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
              <span className="font-semibold">Итого</span>
              <span className="font-display text-2xl font-semibold text-primary">
                {orderResult.total.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

          {/* PAYMENT + CONTACTS */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon name="CreditCard" size={16} className="text-primary" /> Способ оплаты
              </p>
              <p className="mt-1.5 text-sm">{paymentLabel}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon name="User" size={16} className="text-primary" /> Контакты
              </p>
              <p className="mt-1.5 text-sm">{orderResult.phone}</p>
              <p className="text-sm text-muted-foreground">{orderResult.email}</p>
            </div>
          </div>

          {/* CERTIFICATES */}
          {orderResult.certificates.length > 0 && (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
              <p className="flex items-center gap-2 font-display text-lg font-semibold">
                <Icon name="Gift" size={18} className="text-primary" /> Ваши сертификаты
              </p>
              <div className="mt-4 space-y-3">
                {orderResult.certificates.map((c) => (
                  <div key={c.code} className="rounded-xl border border-border bg-card p-4">
                    <p className="text-sm text-muted-foreground">
                      Код: <span className="font-semibold text-foreground">{c.code}</span> ·
                      действует до {c.validUntil}
                    </p>
                    <Button asChild size="sm" className="mt-3 rounded-full">
                      <a href={c.pdfUrl} target="_blank" rel="noreferrer">
                        <Icon name="Download" size={16} className="mr-2" /> Скачать PDF
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WHAT'S NEXT */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold">Что дальше?</h3>
            <div className="mt-4 space-y-4">
              {[
                { icon: 'Mail', text: 'Отправили подтверждение заказа вам на почту.' },
                {
                  icon: 'PhoneCall',
                  text: `Представитель ${isSuzdal ? 'фабрики' : 'школы'} свяжется, чтобы согласовать дату и время посещения.`,
                },
                {
                  icon: 'Sparkles',
                  text: isSuzdal
                    ? 'Приходите творить на нашу фабрику в Суздале — ждём вас!'
                    : 'Приходите творить в нашу студию на ВДНХ — ждём вас!',
                },
              ].map((step, i) => (
                <div key={step.text} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm text-muted-foreground">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="flex-1 rounded-full">
              <Link to={browseTo}>
                <Icon name="LayoutGrid" size={18} className="mr-2" /> {browseLabel}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 rounded-full">
              <Link to={cityConfig.path}>На главную</Link>
            </Button>
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

export default OrderSuccess;