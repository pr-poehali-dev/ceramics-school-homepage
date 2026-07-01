import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/files/e883a661-1e93-47b3-b785-1c8dd183d013.jpg';

const NAV = [
  { label: 'Мастер-классы', href: '#services' },
  { label: 'Форматы', href: '#formats' },
  { label: 'Сертификаты', href: '#certificates' },
  { label: 'Контакты', href: '#contacts' },
];

const SERVICES = [
  { icon: 'Hand', title: 'Лепка', desc: 'Ручная работа с глиной', price: 'от 1900₽' },
  { icon: 'Disc3', title: 'Гончарный круг', desc: 'Создание на круге', price: 'от 2900₽' },
  { icon: 'Palette', title: 'Ангобы', desc: 'Роспись цветной глиной', price: 'от 1900₽' },
  { icon: 'Brush', title: 'Акрил', desc: 'Роспись готовых изделий', price: 'от 1500₽' },
];

const FORMATS = [
  { icon: 'Baby', title: 'Детские', desc: 'Занятия по сб и вс' },
  { icon: 'Truck', title: 'Выездные', desc: 'Мастер-класс у вас' },
  { icon: 'Cake', title: 'Дни рождения', desc: 'Праздник с глиной' },
  { icon: 'Building2', title: 'Корпоративы', desc: 'Тимбилдинг в студии' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Icon name="Flame" size={22} />
            </span>
            <span className="font-display text-2xl font-semibold leading-none tracking-wide">
              Дымов<br />
              <span className="text-primary text-lg">Керамика</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <Button className="rounded-full">Записаться</Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Icon name="MapPin" size={16} /> Студия керамики на ВДНХ
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] md:text-7xl">
              Создайте изделие из&nbsp;глины <span className="text-primary italic">своими руками</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Тёплая атмосфера мастерской, опытные преподаватели и настоящая
              радость творчества. Для взрослых и детей.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full px-8 text-base">
                <Icon name="CalendarCheck" size={18} className="mr-2" /> Записаться
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base">
                <Icon name="Gift" size={18} className="mr-2" /> Подарить сертификат
              </Button>
            </div>
          </div>
          <div className="animate-scale-in">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-accent/20 blur-2xl" />
              <img
                src={HERO_IMG}
                alt="Мастерская керамики"
                className="relative aspect-square w-full rounded-[2rem] object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="container py-16 md:py-24">
        <SectionTitle eyebrow="Наши услуги" title="Мастер-классы" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon name={s.icon} size={26} />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              <p className="mt-4 text-lg font-semibold text-primary">{s.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FORMATS */}
      <section id="formats" className="bg-secondary/50 py-16 md:py-24">
        <div className="container">
          <SectionTitle eyebrow="Форматы" title="Популярные форматы" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FORMATS.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-4 rounded-2xl bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20 text-primary">
                  <Icon name={f.icon} size={22} />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATES */}
      <section id="certificates" className="container py-16 md:py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary px-8 py-14 text-primary-foreground md:px-16 md:py-20">
          <Icon
            name="Gift"
            size={220}
            className="pointer-events-none absolute -right-10 -top-10 opacity-10"
          />
          <div className="relative max-w-xl">
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/70">
              Подарочные сертификаты
            </span>
            <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
              Подарите творчество на любую сумму
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Отличный подарок близким — незабываемый вечер в мастерской и
              изделие, созданное своими руками.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 rounded-full px-8 text-base"
            >
              Оформить сертификат
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacts" className="border-t border-border bg-secondary/40">
        <div className="container grid gap-8 py-14 md:grid-cols-3">
          <div>
            <span className="font-display text-2xl font-semibold">Дымов Керамика</span>
            <p className="mt-3 text-sm text-muted-foreground">
              Студия керамики в тёплой атмосфере мастерской. Творим из глины
              вместе с 2015 года.
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <Icon name="MapPin" size={18} className="text-primary" /> ВДНХ, Москва
            </p>
            <p className="flex items-center gap-2">
              <Icon name="Phone" size={18} className="text-primary" /> +7 (495) 000-00-00
            </p>
            <p className="flex items-center gap-2">
              <Icon name="Clock" size={18} className="text-primary" /> Ежедневно 10:00–21:00
            </p>
          </div>
          <div className="flex items-start gap-4 md:justify-end">
            {['Instagram', 'Send', 'Youtube'].map((s) => (
              <a
                key={s}
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Icon name={s} size={20} />
              </a>
            ))}
          </div>
        </div>
        <div className="border-t border-border/60 py-5 text-center text-sm text-muted-foreground">
          © 2026 Дымов Керамика. Все права защищены.
        </div>
      </footer>
    </div>
  );
};

const SectionTitle = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <div className="text-center">
    <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
      {eyebrow}
    </span>
    <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{title}</h2>
  </div>
);

export default Index;
