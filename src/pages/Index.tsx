import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import MobileMenu from '@/components/MobileMenu';
import Logo from '@/components/Logo';
import SocialLinks from '@/components/SocialLinks';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/d3a4daab-e21d-4fcc-bb95-63ee64ddd0b4.png';

const CERTIFICATE_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/858c5def-a2d9-4503-aef3-192e73b205e1.png';

const NAV = [
  { label: 'Мастер-классы', href: '/workshops', isRoute: true },
  { label: 'Форматы', href: '/formats', isRoute: true },
  { label: 'Подарочные сертификаты', href: '/certificates', isRoute: true },
  { label: 'Контакты', href: '/contacts', isRoute: true },
];

const SERVICES = [
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/031d0b25-5ce6-4c27-8e82-d33ec3b0b178.png',
    title: 'Лепка',
    desc: 'Ручная работа с глиной',
    price: 'от 1900₽',
  },
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/ab36a67f-4ea0-4d3a-8ebe-21e8a9dfb891.png',
    title: 'Гончарный круг',
    desc: 'Создание на круге',
    price: 'от 2900₽',
  },
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/7f664b40-fac2-4114-b0ad-70fc8524f908.png',
    title: 'Ангобы',
    desc: 'Роспись цветной глиной',
    price: 'от 1900₽',
  },
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/0bce1c46-ce6d-45d4-9a78-fc97b423975d.jpg',
    title: 'Акрил',
    desc: 'Роспись готовых изделий',
    price: 'от 1500₽',
  },
];

const FORMATS = [
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/cd92a426-9a1e-4eba-81fa-09e5b75b623d.jpg',
    title: 'Детские',
    desc: 'Занятия по сб и вс',
  },
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/031d0b25-5ce6-4c27-8e82-d33ec3b0b178.png',
    title: 'Выездные',
    desc: 'Мастер-класс у вас',
  },
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/7898283f-b258-43b1-ae5e-b5d2e1c4b1f7.jpg',
    title: 'Дни рождения',
    desc: 'Праздник с глиной',
  },
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/d38779de-6df5-4423-8740-68cce4b10ff0.jpg',
    title: 'Корпоративы',
    desc: 'Тимбилдинг в студии',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/moscow" className="flex items-center">
            <Logo scale={false} />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) =>
              n.isRoute ? (
                <Link
                  key={n.label}
                  to={n.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {n.label}
                </Link>
              ) : (
                <a
                  key={n.label}
                  href={n.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {n.label}
                </a>
              )
            )}
          </nav>
          <div className="hidden items-center gap-4 md:flex">
            <SocialLinks size={18} variant="solid" />
            <Button className="rounded-full">Записаться</Button>
          </div>
          <MobileMenu />
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
              <Link to="/certificates">
                <Button size="lg" variant="outline" className="rounded-full px-8 text-base">
                  <Icon name="Gift" size={18} className="mr-2" /> Подарить сертификат
                </Button>
              </Link>
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
            <Link
              key={s.title}
              to="/workshops"
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                <p className="mt-4 text-lg font-semibold text-primary">{s.price}</p>
              </div>
            </Link>
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
                className="group overflow-hidden rounded-2xl bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
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
          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div className="max-w-xl">
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
              <Link to="/certificates">
                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-8 rounded-full px-8 text-base"
                >
                  Оформить сертификат
                  <Icon name="ArrowRight" size={18} className="ml-2" />
                </Button>
              </Link>
            </div>

            <div className="relative flex justify-center md:justify-end">
              <div className="absolute inset-0 -rotate-6 rounded-2xl bg-white/10" />
              <img
                src={CERTIFICATE_IMG}
                alt="Подарочный сертификат Дымов Керамика"
                className="relative w-full max-w-xs rotate-3 rounded-2xl shadow-2xl ring-1 ring-white/20 transition-transform duration-500 hover:rotate-0 md:max-w-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacts" className="border-t border-border bg-secondary/40">
        <div className="container grid gap-8 py-14 md:grid-cols-3">
          <div>
            <Logo className="h-10" scale={false} />
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
          <SocialLinks className="md:justify-end" />
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