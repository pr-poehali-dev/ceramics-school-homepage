import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const WORKSHOPS = [
  {
    icon: 'Hand',
    title: 'Лепка',
    desc: 'Создание изделий руками из глины. От фигурки до посуды.',
    people: '1–20',
    duration: '1 час',
    price: 'от 1 900 ₽',
    age: '3+',
    href: '/workshops/lepka',
    note: null as null | { icon: string; text: string; tone: 'warn' | 'fast' },
  },
  {
    icon: 'Disc3',
    title: 'Гончарный круг',
    desc: 'Работа за гончарным кругом. Создайте посуду своими руками.',
    people: '1–12',
    duration: '1 час',
    price: 'от 2 900 ₽',
    age: '7+',
    href: null as null | string,
    note: { icon: 'TriangleAlert', text: 'Нет кругов вт / ср / чт', tone: 'warn' as const },
  },
  {
    icon: 'Palette',
    title: 'Роспись ангобами',
    desc: 'Роспись изделий специальными керамическими красками.',
    people: '1–20',
    duration: '1 час',
    price: 'от 1 900 ₽',
    age: '3+',
    href: null as null | string,
    note: null,
  },
  {
    icon: 'Brush',
    title: 'Роспись акрилом',
    desc: 'Яркая роспись акрилом. Забираете изделие сразу!',
    people: '1–50',
    duration: '1 час',
    price: 'от 1 500 ₽',
    age: '3+',
    href: null as null | string,
    note: { icon: 'Zap', text: 'Забрать сразу', tone: 'fast' as const },
  },
];

const Workshops = () => {
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
            <Link to="/workshops" className="text-sm font-medium text-primary">
              Мастер-классы
            </Link>
            <Link to="/formats" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Форматы
            </Link>
            <Link to="/certificates" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Подарочные сертификаты
            </Link>
            <Link to="/#contacts" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Контакты
            </Link>
          </nav>
          <Button className="rounded-full">Записаться</Button>
        </div>
      </header>

      {/* HERO */}
      <section className="container py-14 md:py-20">
        <div className="animate-fade-in text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="Sparkles" size={16} /> Наши мастер-классы
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] md:text-6xl">
            Выберите, что хотите <span className="text-primary italic">создавать</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Каждый мастер-класс — это час в тёплой атмосфере мастерской и своё
            изделие из глины на память.
          </p>
        </div>
      </section>

      {/* CARDS */}
      <section className="container pb-20">
        <div className="mx-auto max-w-4xl space-y-6">
          {WORKSHOPS.map((w, i) => (
            <div
              key={w.title}
              className="group animate-fade-in rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl md:p-8"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon name={w.icon} size={30} />
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-3xl font-semibold">{w.title}</h2>
                      <p className="mt-1 text-muted-foreground">{w.desc}</p>
                    </div>
                    {w.href ? (
                      <Link to={w.href}>
                        <Button variant="outline" className="rounded-full">
                          Подробнее
                          <Icon name="ArrowRight" size={16} className="ml-2" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="rounded-full">
                        Подробнее
                        <Icon name="ArrowRight" size={16} className="ml-2" />
                      </Button>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                    <Meta icon="Users" text={w.people} />
                    <Meta icon="Clock" text={w.duration} />
                    <span className="flex items-center gap-2 font-semibold text-primary">
                      <Icon name="Tag" size={16} /> {w.price}
                    </span>
                    <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-medium text-secondary-foreground">
                      {w.age}
                    </span>
                  </div>

                  {w.note && (
                    <div
                      className={`mt-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ${
                        w.note.tone === 'warn'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-accent/20 text-primary'
                      }`}
                    >
                      <Icon name={w.note.icon} size={16} />
                      {w.note.text}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-[2rem] bg-primary px-8 py-12 text-center text-primary-foreground md:px-16">
          <h3 className="font-display text-3xl font-semibold md:text-4xl">
            Не знаете, что выбрать?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Напишите нам — подскажем формат под ваш возраст, компанию и повод.
          </p>
          <Button size="lg" variant="secondary" className="mt-7 rounded-full px-8 text-base">
            <Icon name="MessageCircle" size={18} className="mr-2" /> Задать вопрос
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-secondary/40">
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

const Meta = ({ icon, text }: { icon: string; text: string }) => (
  <span className="flex items-center gap-2 text-muted-foreground">
    <Icon name={icon} size={16} /> {text}
  </span>
);

export default Workshops;