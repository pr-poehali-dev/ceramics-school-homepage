import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import MobileMenu from '@/components/MobileMenu';
import Logo from '@/components/Logo';
import SocialLinks from '@/components/SocialLinks';

const PRESETS = [
  { value: 2000, label: '2 000 ₽', popular: false },
  { value: 5000, label: '5 000 ₽', popular: false },
  { value: 10000, label: '10 000 ₽', popular: true },
  { value: 25000, label: '25 000 ₽', popular: false },
  { value: 50000, label: '50 000 ₽', popular: false },
];

const NAV = [
  { label: 'Мастер-классы', to: '/workshops' },
  { label: 'Форматы', to: '/formats' },
  { label: 'Подарочные сертификаты', to: '/certificates' },
  { label: 'Контакты', to: '/contacts' },
];

const Certificates = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState('');
  const [customError, setCustomError] = useState('');

  const activeAmount = selected ?? (custom ? parseInt(custom.replace(/\D/g, '')) || 0 : 0);

  const handlePreset = (val: number) => {
    setSelected(val);
    setCustom('');
    setCustomError('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setCustom(raw);
    setSelected(null);
    if (raw) {
      const num = parseInt(raw);
      if (num < 1000) setCustomError('Минимум 1 000 ₽');
      else if (num > 1000000) setCustomError('Максимум 1 000 000 ₽');
      else setCustomError('');
    } else {
      setCustomError('');
    }
  };

  const formatNum = (n: number) =>
    n.toLocaleString('ru-RU') + ' ₽';

  const canOrder = activeAmount >= 1000 && activeAmount <= 1000000 && !customError;

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/moscow" className="flex items-center">
            <Logo scale={false} />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  n.to === '/certificates' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-4 md:flex">
            <SocialLinks size={18} variant="solid" />
            <Button className="rounded-full">Записаться</Button>
          </div>
          <MobileMenu active="/certificates" />
        </div>
      </header>

      <div className="container py-12 md:py-16">
        {/* HERO */}
        <div className="animate-fade-in text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="Gift" size={16} /> Подарочные сертификаты
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-tight md:text-6xl">
            Подарите впечатления,<br />
            <span className="text-primary italic">а не вещи</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Сертификат на мастер-класс по керамике — подарок, который запомнится.
            Выберите готовый номинал или укажите свою сумму.
          </p>
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
                  Студия керамики · ВДНХ, Москва
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
                  <Icon name="Clock" size={15} /> Срок действия: 12 месяцев
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
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
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
                  {p.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                      Популярный
                    </span>
                  )}
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* CUSTOM AMOUNT */}
          <div className="mt-8">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Свой номинал
            </p>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-muted-foreground">
                <Icon name="Pencil" size={16} />
              </div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Введите сумму от 1 000 до 1 000 000 ₽"
                value={custom ? parseInt(custom).toLocaleString('ru-RU') : ''}
                onChange={handleCustomChange}
                className={`w-full rounded-xl border bg-card py-4 pl-12 pr-16 text-base font-medium outline-none transition-all focus:ring-2 focus:ring-primary/40 ${
                  customError ? 'border-destructive' : 'border-border focus:border-primary'
                }`}
              />
              <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-muted-foreground font-medium">
                ₽
              </span>
            </div>
            {customError && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-destructive">
                <Icon name="TriangleAlert" size={14} /> {customError}
              </p>
            )}
            {!customError && custom && parseInt(custom) >= 1000 && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-primary">
                <Icon name="Check" size={14} /> {formatNum(parseInt(custom))} — отличный выбор!
              </p>
            )}
          </div>

          {/* PERKS */}
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { icon: 'Download', text: 'Отправим на e-mail сразу после оплаты' },
              { icon: 'CalendarDays', text: 'Действует 12 месяцев с момента покупки' },
              { icon: 'RefreshCcw', text: 'Можно использовать на любой мастер-класс' },
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
            >
              <Icon name="ShoppingBag" size={20} className="mr-2" />
              {canOrder
                ? `Оформить сертификат на ${formatNum(activeAmount)}`
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
            {[
              {
                q: 'Как получить сертификат?',
                a: 'После оформления и оплаты сертификат придёт на вашу электронную почту в течение нескольких минут.',
              },
              {
                q: 'Можно ли использовать сертификат частями?',
                a: 'Да, сертификат можно использовать на несколько посещений, пока не закончится сумма. Срок действия при этом не продлевается.',
              },
              {
                q: 'Что если занятие стоит больше номинала?',
                a: 'Разницу можно доплатить на месте. Мы примем наличные или карту.',
              },
              {
                q: 'Можно ли вернуть сертификат?',
                a: 'Да, неиспользованный сертификат можно вернуть в течение 14 дней с момента покупки.',
              },
            ].map((item) => (
              <details key={item.q} className="group rounded-xl border border-border bg-card">
                <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-medium">
                  {item.q}
                  <Icon
                    name="ChevronDown"
                    size={18}
                    className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="border-t border-border px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-border bg-secondary/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
          <Logo className="h-9" />
          <span className="flex items-center gap-2">
            <Icon name="MapPin" size={16} className="text-primary" /> ВДНХ, Москва
          </span>
          <SocialLinks size={18} variant="solid" />
          <span>© 2026 Все права защищены</span>
        </div>
      </footer>
    </div>
  );
};

export default Certificates;