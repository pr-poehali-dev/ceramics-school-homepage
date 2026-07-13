import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useCart } from '@/context/CartContext';
import { usePageMeta } from '@/hooks/usePageMeta';

const CERTIFICATE_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/858c5def-a2d9-4503-aef3-192e73b205e1.png';

const PRESETS = [
  { value: 2500, label: '2 500 ₽' },
  { value: 3300, label: '3 300 ₽' },
  { value: 3500, label: '3 500 ₽' },
  { value: 3800, label: '3 800 ₽' },
];

const SuzdalCertificates = () => {
  usePageMeta({
    title: 'Сертификаты в гончарную мастерскую «Дымов Керамика» в Суздале',
    description:
      'Подарочные сертификаты на уроки гончарного мастерства. Сертификаты на гончарные мастер-классы для детей и взрослых в Суздале.',
  });
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);

  const activeAmount = selected ?? 0;

  const handleAddToCart = () => {
    addItem({
      id: `suzdal-certificate-${activeAmount}-${Date.now()}`,
      title: 'Сертификат в школу «Дымов Керамика»',
      details: `Номинал ${formatNum(activeAmount)}`,
      price: activeAmount,
    });
    toast({
      title: 'Сертификат добавлен в корзину',
      description: 'Перейдите к оформлению, чтобы завершить покупку.',
    });
    navigate('/suzdal/checkout');
  };

  const handlePreset = (val: number) => {
    setSelected(val);
  };

  const formatNum = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

  const canOrder = activeAmount > 0;

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <SiteHeader active="/suzdal/certificates" />

      <div className="container py-12 md:py-16">
        {/* HERO BANNER */}
        <div className="animate-fade-in overflow-hidden rounded-[2rem] border border-border bg-card">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Icon name="Gift" size={16} /> Сертификат в школу
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
                Сертификат <span className="text-primary italic">в школу</span>
              </h1>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">
                Сертификат в школу «Дымов Керамика» в Суздале — подарок, который запомнится.
                Выберите номинал и оформите заказ.
              </p>
            </div>
            <div className="relative flex h-full items-center justify-center p-8 md:justify-end md:p-12">
              <div className="pointer-events-none absolute inset-0 bg-accent/10" />
              <div className="relative animate-scale-in">
                <div className="absolute -inset-4 rounded-[2rem] bg-accent/20 blur-2xl" />
                <img
                  src={CERTIFICATE_IMG}
                  alt="Сертификат в школу «Дымов Керамика»"
                  className="relative w-full max-w-sm rotate-2 rounded-2xl shadow-2xl ring-1 ring-border transition-transform duration-500 hover:rotate-0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          {/* CERTIFICATE PREVIEW */}
          <div className="animate-scale-in relative overflow-hidden rounded-[2rem] bg-primary px-10 py-12 text-primary-foreground shadow-2xl">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-white/5" />
            <div className="relative flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
                  Сертификат в школу
                </p>
                <p className="mt-2 font-display text-2xl font-semibold md:text-3xl">
                  Дымов Керамика
                </p>
                <p className="mt-1 text-sm text-primary-foreground/70">
                  Фабрика и школа · Суздаль
                </p>
              </div>
              <div className="mt-6 md:mt-0 md:text-right">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
                  Номинал
                </p>
                <p className="mt-1 font-display text-4xl font-semibold md:text-5xl">
                  {activeAmount > 0 ? formatNum(activeAmount) : '—'}
                </p>
              </div>
            </div>

            <div className="relative mt-8 border-t border-white/20 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                  <Icon name="Clock" size={15} /> Срок действия: 6 месяцев
                </div>
                <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                  <Icon name="Sparkles" size={15} /> Мастер-классы школы
                </div>
              </div>
            </div>
          </div>

          {/* PRESET AMOUNTS */}
          <div className="mt-10">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Номинал
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handlePreset(p.value)}
                  className={`relative rounded-xl border py-4 text-center text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    selected === p.value
                      ? 'border-primary bg-primary text-primary-foreground shadow-md'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* BOOKING NOTE */}
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/15 p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/30 text-primary">
              <Icon name="Phone" size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Запись по телефону</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Запись на мастер-классы только по телефону{' '}
                <a href="tel:+79151576485" className="font-medium text-foreground hover:text-primary">
                  8-915-157-64-85
                </a>
                . Оплата на месте картой или наличными.
              </p>
            </div>
          </div>

          {/* PERKS */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: 'Users', text: 'Для участников любого возраста (кроме сертификата для детской группы)' },
              { icon: 'Clock', text: 'Продолжительность занятия — от 1 часа' },
              { icon: 'CalendarDays', text: 'Сертификат действителен в течение 6 месяцев' },
            ].map((p) => (
              <div key={p.text} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={p.icon} size={18} />
                </span>
                <p className="text-sm leading-snug text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Button
              size="lg"
              className="w-full rounded-xl py-6 text-base"
              disabled={!canOrder}
              onClick={handleAddToCart}
            >
              <Icon name="ShoppingBag" size={20} className="mr-2" />
              {canOrder ? `В корзину — ${formatNum(activeAmount)}` : 'Выберите номинал'}
            </Button>
          </div>

          {/* ABOUT */}
          <div className="mt-10 rounded-2xl border border-border bg-card p-7 md:p-8">
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Подарки могут быть разными. Особенно хороши подарки, сделанные с душой. Мы в школе
                «Дымов Керамика» вкладываем душу в каждого ученика.
              </p>
              <p className="font-medium text-foreground">
                Преподнесите в подарок занятие в школе «Дымов Керамика»!
              </p>
              <p>
                Дарите приятные эмоции близким и друзьям! Ждём вас в нашей школе гончарного
                искусства «Дымов Керамика» в Суздале.
              </p>
              <p>
                Также подарочные сертификаты можно приобрести в магазине «Дымов Керамика»
                (Суздаль, Транспортная улица, 9).
              </p>
            </div>

            <div className="mt-6 space-y-2 border-t border-border pt-5 text-xs text-muted-foreground">
              <p>*Абонемент действителен 3 месяца с момента приобретения.</p>
              <p>*Подарочный сертификат действителен в течение 6 месяцев.</p>
              <p>
                *Вы всегда можете заказать бумажную версию сертификата. Курьерская доставка
                оплачивается дополнительно.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
};

export default SuzdalCertificates;