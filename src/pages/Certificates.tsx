import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useCart } from '@/context/CartContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { usePageContent } from '@/hooks/usePageContent';
import { reachGoal, GOALS } from '@/lib/metrika';

const CERTIFICATE_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/858c5def-a2d9-4503-aef3-192e73b205e1.png';

const PRESETS = [
  { value: 1900, label: '1 900 ₽', popular: false, hint: 'Детская группа (сб/вс)' },
  { value: 2100, label: '2 100 ₽', popular: false, hint: 'Роспись ангобами' },
  { value: 2900, label: '2 900 ₽', popular: false, hint: 'Лепка / гончарный круг' },
  { value: 5000, label: '5 000 ₽', popular: true, hint: 'Тематический мастер-класс' },
  { value: 7000, label: '7 000 ₽', popular: false, hint: 'Свидание в мастерской' },
  { value: 9000, label: '9 000 ₽', popular: false, hint: 'Тематический мастер-класс' },
  { value: 10000, label: '10 000 ₽', popular: false, hint: 'На несколько занятий' },
  { value: 13000, label: '13 000 ₽', popular: false, hint: 'На несколько занятий' },
];


const Certificates = () => {
  const c = usePageContent('moscow-certificates');
  usePageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
  });
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);

  const activeAmount = selected ?? 0;

  const handleAddToCart = () => {
    addItem({
      id: `certificate-${activeAmount}-${Date.now()}`,
      title: 'Подарочный сертификат «Дымов Керамика»',
      details: `Номинал ${formatNum(activeAmount)}`,
      price: activeAmount,
    });
    reachGoal(GOALS.CERTIFICATE_ADD, 'moscow', { amount: activeAmount });
    toast({
      title: 'Сертификат добавлен в корзину',
      description: 'Перейдите к оформлению, чтобы завершить покупку.',
    });
    navigate('/moscow/checkout');
  };

  const handlePreset = (val: number) => {
    setSelected(val);
  };

  const formatNum = (n: number) =>
    n.toLocaleString('ru-RU') + ' ₽';

  const canOrder = activeAmount >= 1000 && activeAmount <= 1000000;

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <SiteHeader active="/moscow/certificates" />

      <div className="container py-12 md:py-16">
        {/* HERO BANNER */}
        <div className="animate-fade-in overflow-hidden rounded-[2rem] border border-border bg-card">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Icon name="Gift" size={16} /> Подарочные сертификаты
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
                {c.h1Line1}<br />
                <span className="text-primary italic">{c.h1Line2}</span>
              </h1>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">
                {c.subtitle}
              </p>
            </div>
            <div className="relative flex h-full items-center justify-center p-8 md:justify-end md:p-12">
              <div className="pointer-events-none absolute inset-0 bg-accent/10" />
              <div className="relative animate-scale-in">
                <div className="absolute -inset-4 rounded-[2rem] bg-accent/20 blur-2xl" />
                <img
                  src={CERTIFICATE_IMG}
                  alt="Подарочный сертификат Дымов Керамика"
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
                  Подарочный сертификат
                </p>
                <p className="mt-2 font-display text-2xl font-semibold md:text-3xl">
                  Дымов Керамика
                </p>
                <p className="mt-1 text-sm text-primary-foreground/70">
                  {c.previewLocation}
                </p>
              </div>
              <div className="mt-6 md:mt-0 md:text-right">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
                  Номинал
                </p>
                <p className="mt-1 font-display text-4xl font-semibold md:text-5xl">
                  {activeAmount >= 1000 ? formatNum(activeAmount) : '—'}
                </p>
              </div>
            </div>

            <div className="relative mt-8 border-t border-white/20 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                  <Icon name="Clock" size={15} /> {c.validityText}
                </div>
                <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                  <Icon name="Sparkles" size={15} /> Все мастер-классы студии
                </div>
              </div>
            </div>
          </div>

          {/* PRESET AMOUNTS */}
          <div className="mt-10">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Готовые номиналы
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handlePreset(p.value)}
                  className={`relative flex flex-col items-center gap-1 rounded-xl border px-2 py-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    selected === p.value
                      ? 'border-primary bg-primary text-primary-foreground shadow-md'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                      Популярный
                    </span>
                  )}
                  <span className="text-sm font-semibold">{p.label}</span>
                  <span
                    className={`text-xs font-normal leading-tight ${
                      selected === p.value ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    }`}
                  >
                    {p.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* PERKS */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              { icon: 'Download', text: c.perk1Text },
              { icon: 'CalendarDays', text: c.perk2Text },
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
              {canOrder
                ? `В корзину — ${formatNum(activeAmount)}`
                : 'Выберите номинал'}
            </Button>
            {!canOrder && activeAmount > 0 && (
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Укажите сумму от 1 000 до 1 000 000 ₽
              </p>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-3xl">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Частые вопросы</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="mt-8 space-y-4">
            {(c.faqItems || '').split('\n').filter(Boolean).map((line) => {
              const [q, a] = line.split('|');
              return (
                <details key={q} className="group rounded-xl border border-border bg-card">
                  <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-medium">
                    {q}
                    <Icon
                      name="ChevronDown"
                      size={18}
                      className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="border-t border-border px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">
                    {a}
                  </p>
                </details>
              );
            })}
          </div>
        </div>

        {/* SEO TEXT */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            {c.seoTitle}
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            <p>{c.seoParagraph1}</p>
            <p>{c.seoParagraph2}</p>

            <h3 className="pt-4 font-display text-2xl font-semibold text-foreground">
              {c.seoWhatTitle}
            </h3>
            {(c.seoWhatText || '').split('\n').filter(Boolean).map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>{c.seoDirectionsIntro}</p>
            <ul className="space-y-2">
              {(c.seoDirectionsList || '').split('\n').filter(Boolean).map((li) => (
                <li key={li} className="flex gap-2">
                  <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-primary" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
            <p>{c.seoClosing}</p>

            <h3 className="pt-4 font-display text-2xl font-semibold text-foreground">
              {c.seoTypesTitle}
            </h3>
            <p>{c.seoTypesText}</p>
            <p>{c.seoExamplesIntro}</p>
            <ul className="space-y-2">
              {(c.seoExamplesList || '').split('\n').filter(Boolean).map((li) => (
                <li key={li} className="flex gap-2">
                  <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-primary" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
            <p>
              Уточнить стоимость интересующего вас мастер-класса или задать другие вопросы,
              касающиеся сертификатов, вы можете по телефону{' '}
              <a
                href={`tel:${(c.phone || '').replace(/[^\d+]/g, '')}`}
                className="font-semibold text-primary transition-colors hover:underline"
              >
                {c.phone}
              </a>
              .
            </p>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
};

export default Certificates;