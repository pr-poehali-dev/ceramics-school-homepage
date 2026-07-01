import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const ALL_FORMATS = [
  {
    icon: 'Landmark',
    title: 'Классический МК',
    place: 'В студии',
    duration: '1 час',
    people: '1–20',
    age: '3+',
    ageMin: 3,
    days: 'Любой день',
    daysKey: 'any',
    price: 'от 1 500 ₽',
    priceKey: 'fixed',
    location: 'studio',
    durationKey: '1h',
    cta: { label: 'Выбрать услугу', variant: 'default' as const, icon: 'ChevronRight' },
  },
  {
    icon: 'Baby',
    title: 'Детская группа (сб/вс)',
    place: 'В студии',
    duration: '1 час',
    people: '1–20',
    age: '3–10 лет',
    ageMin: 3,
    days: 'Сб / Вс',
    daysKey: 'weekend',
    price: '1 900 ₽',
    priceKey: 'fixed',
    location: 'studio',
    durationKey: '1h',
    cta: { label: 'Выбрать услугу', variant: 'default' as const, icon: 'ChevronRight' },
  },
  {
    icon: 'Rocket',
    title: 'Промо-группа (пн–пт)',
    place: 'В студии',
    duration: '1 час',
    people: '10–12',
    age: '7+',
    ageMin: 7,
    days: 'Пн – Пт',
    daysKey: 'weekday',
    price: '2 000 ₽',
    priceKey: 'fixed',
    location: 'studio',
    durationKey: '1h',
    cta: { label: 'Выбрать услугу', variant: 'default' as const, icon: 'ChevronRight' },
  },
  {
    icon: 'Truck',
    title: 'Выездной МК',
    place: 'Выезд к вам',
    duration: 'от 30 мин',
    people: '1–100',
    age: '3+',
    ageMin: 3,
    days: 'Любой день',
    daysKey: 'any',
    price: 'Договорная',
    priceKey: 'negotiable',
    location: 'offsite',
    durationKey: 'negotiable',
    cta: { label: 'Рассчитать', variant: 'outline' as const, icon: 'Calculator' },
  },
  {
    icon: 'UtensilsCrossed',
    title: 'Курс «Блюдо» (2 занятия)',
    place: 'В студии',
    duration: '6,5 ч',
    people: '1–3',
    age: '12+',
    ageMin: 12,
    days: 'Любой день',
    daysKey: 'any',
    price: '5 000–9 000 ₽',
    priceKey: 'fixed',
    location: 'studio',
    durationKey: '6h',
    cta: { label: 'Выбрать услугу', variant: 'default' as const, icon: 'ChevronRight' },
  },
  {
    icon: 'PartyPopper',
    title: 'Мероприятия (ДР, корп, девичник)',
    place: 'В студии или выезд',
    duration: 'Индивидуально',
    people: 'Любое',
    age: '3+',
    ageMin: 3,
    days: 'Любой день',
    daysKey: 'any',
    price: 'Индивидуально',
    priceKey: 'negotiable',
    location: 'both',
    durationKey: 'negotiable',
    cta: { label: 'Подробнее', variant: 'outline' as const, icon: 'ArrowRight' },
  },
];

const AGE_OPTIONS = ['3+', '7+', '10+', '12+'];
const DAY_OPTIONS = [
  { label: 'Любой', value: 'any' },
  { label: 'Пн–Пт', value: 'weekday' },
  { label: 'Сб/Вс', value: 'weekend' },
];
const DURATION_OPTIONS = [
  { label: '1 час', value: '1h' },
  { label: '6+ ч', value: '6h' },
  { label: 'Договорная', value: 'negotiable' },
];
const LOCATION_OPTIONS = [
  { label: 'В студии', value: 'studio' },
  { label: 'Выезд', value: 'offsite' },
  { label: 'Любой', value: 'any' },
];

const NAV_LINKS = [
  { label: 'Мастер-классы', to: '/workshops' },
  { label: 'Форматы', to: '/formats' },
  { label: 'Сертификаты', to: '/#certificates' },
  { label: 'Контакты', to: '/#contacts' },
];

const Formats = () => {
  const [ageFilter, setAgeFilter] = useState<string | null>(null);
  const [dayFilter, setDayFilter] = useState<string>('any');
  const [durationFilter, setDurationFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>('any');

  const reset = () => {
    setAgeFilter(null);
    setDayFilter('any');
    setDurationFilter(null);
    setLocationFilter('any');
  };

  const results = useMemo(() => {
    return ALL_FORMATS.filter((f) => {
      if (ageFilter) {
        const minAge = parseInt(ageFilter);
        if (f.ageMin < minAge) return false;
      }
      if (dayFilter !== 'any' && f.daysKey !== dayFilter && f.daysKey !== 'any') return false;
      if (durationFilter && f.durationKey !== durationFilter) return false;
      if (locationFilter !== 'any' && f.location !== locationFilter && f.location !== 'both') return false;
      return true;
    });
  }, [ageFilter, dayFilter, durationFilter, locationFilter]);

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Icon name="Flame" size={22} />
            </span>
            <span className="font-display text-2xl font-semibold leading-none tracking-wide">
              Дымов<br />
              <span className="text-primary text-lg">Керамика</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${n.to === '/formats' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Button className="rounded-full">Записаться</Button>
        </div>
      </header>

      <div className="container py-12 md:py-16">
        {/* PAGE TITLE */}
        <div className="animate-fade-in text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="LayoutGrid" size={16} /> Форматы занятий
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold md:text-6xl">
            Выберите подходящий <span className="text-primary italic">формат</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Фильтруйте по времени, возрасту и месту — найдите идеальный вариант для себя.
          </p>
        </div>

        {/* FILTERS */}
        <div className="mx-auto mt-12 max-w-4xl animate-fade-in rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* AGE */}
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon name="User" size={15} /> Возраст
              </p>
              <div className="flex flex-wrap gap-2">
                {AGE_OPTIONS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAgeFilter(ageFilter === a ? null : a)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                      ageFilter === a
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* DAY */}
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon name="Calendar" size={15} /> День недели
              </p>
              <div className="flex flex-wrap gap-2">
                {DAY_OPTIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDayFilter(d.value)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                      dayFilter === d.value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DURATION */}
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon name="Clock" size={15} /> Длительность
              </p>
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDurationFilter(durationFilter === d.value ? null : d.value)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                      durationFilter === d.value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* LOCATION */}
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon name="MapPin" size={15} /> Место
              </p>
              <div className="flex flex-wrap gap-2">
                {LOCATION_OPTIONS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLocationFilter(l.value)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                      locationFilter === l.value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
            <span className="text-sm text-muted-foreground">
              Найдено: <span className="font-semibold text-foreground">{results.length}</span>
            </span>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Icon name="RotateCcw" size={14} /> Сбросить
            </button>
          </div>
        </div>

        {/* RESULTS */}
        <div className="mx-auto mt-8 max-w-4xl space-y-5">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-20 text-center">
              <Icon name="SearchX" size={40} className="mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">Ничего не найдено</p>
              <p className="mt-1 text-sm text-muted-foreground">Попробуйте изменить фильтры</p>
              <Button variant="outline" className="mt-5 rounded-full" onClick={reset}>
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            results.map((f, i) => (
              <div
                key={f.title}
                className="group animate-fade-in rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg md:p-7"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon name={f.icon} size={26} />
                  </span>

                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-semibold">{f.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <Dot text={f.place} />
                      <Dot text={f.duration} />
                      <Dot text={f.people + ' чел'} />
                      <Dot text={f.age} />
                      <Dot text={f.days} />
                    </div>
                    <p className="mt-3 text-base font-semibold text-primary">{f.price}</p>
                  </div>

                  <Button
                    variant={f.cta.variant}
                    className="shrink-0 rounded-full px-6"
                  >
                    {f.cta.label}
                    <Icon name={f.cta.icon} size={15} className="ml-2" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CTA */}
        <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-[2rem] bg-primary px-8 py-12 text-center text-primary-foreground md:px-16">
          <Icon name="MessageCircle" size={200} className="pointer-events-none absolute opacity-0" />
          <h3 className="font-display text-3xl font-semibold md:text-4xl">
            Не нашли подходящий формат?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Напишите — подберём индивидуальный вариант под вашу группу, повод и бюджет.
          </p>
          <Button size="lg" variant="secondary" className="mt-7 rounded-full px-8">
            <Icon name="Send" size={18} className="mr-2" /> Написать нам
          </Button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-border bg-secondary/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
          <span className="font-display text-xl font-semibold text-foreground">Дымов Керамика</span>
          <span className="flex items-center gap-2">
            <Icon name="MapPin" size={16} className="text-primary" /> ВДНХ, Москва
          </span>
          <span>© 2026 Все права защищены</span>
        </div>
      </footer>
    </div>
  );
};

const Dot = ({ text }: { text: string }) => (
  <span className="flex items-center gap-1.5">
    <span className="h-1 w-1 rounded-full bg-primary/40" />
    {text}
  </span>
);

export default Formats;
