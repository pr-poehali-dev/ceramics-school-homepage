import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import MobileMenu from '@/components/MobileMenu';
import Logo from '@/components/Logo';
import SocialLinks from '@/components/SocialLinks';
import DesktopNav from '@/components/DesktopNav';
import { ALL_FORMATS } from './formats/formatsData';
import { REVIEWS, GALLERY } from './reviews/reviewsData';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/d3a4daab-e21d-4fcc-bb95-63ee64ddd0b4.png';

const CERTIFICATE_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/858c5def-a2d9-4503-aef3-192e73b205e1.png';

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

const REVIEW_AVG = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);
const HOME_REVIEWS = REVIEWS.slice(0, 3);
const HOME_GALLERY = GALLERY.slice(0, 6);

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/moscow" className="flex items-center">
            <Logo scale={false} />
          </Link>
          <DesktopNav />
          <a
            href="tel:+79854198903"
            className="hidden items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary md:flex"
          >
            <Icon name="Phone" size={18} className="text-primary" /> +7 (985) 419-89-03
          </a>
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
          <SectionTitle eyebrow="Форматы" title="Выберите свой формат" />
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            От разовых занятий до праздников и выездных мастер-классов — подберите
            подходящий вариант для себя, ребёнка или компании.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ALL_FORMATS.map((f) => (
              <Link
                key={f.title}
                to="/formats"
                className="group flex flex-col overflow-hidden rounded-2xl bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-primary shadow-sm backdrop-blur">
                    <Icon name={f.icon} size={20} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-semibold leading-tight">{f.title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={13} className="text-primary/60" /> {f.place}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={13} className="text-primary/60" /> {f.days}
                    </span>
                  </div>
                  <p className="mt-auto pt-4 text-base font-semibold text-primary">{f.price}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/formats">
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base">
                Все форматы и цены
                <Icon name="ArrowRight" size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="container py-16 md:py-24">
        <SectionTitle eyebrow="Отзывы" title="Нам доверяют" />

        <div className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-2xl border border-border bg-card px-6 py-3">
          <span className="font-display text-3xl font-semibold text-primary">{REVIEW_AVG}</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} name="Star" size={16} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">{REVIEWS.length}+ отзывов</span>
        </div>

        {/* mini gallery */}
        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {HOME_GALLERY.map((src, i) => (
            <Link
              key={src}
              to="/reviews"
              className="group relative aspect-square overflow-hidden rounded-2xl"
            >
              <img
                src={src}
                alt={`Работа участников ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </Link>
          ))}
        </div>

        {/* review cards */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {HOME_REVIEWS.map((r) => (
            <div key={r.name} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  {initials(r.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium leading-tight">{r.name}</p>
                  <div className="mt-0.5 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={13}
                        className={i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-muted-foreground">
                {r.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="https://yandex.ru/profile/8182762882?lang=ru&utm_source=copy_link&utm_medium=social&utm_campaign=share"
            target="_blank"
            rel="noreferrer"
          >
            <Button size="lg" className="rounded-full px-8 text-base">
              <Icon name="Star" size={18} className="mr-2" /> Отзыв на Яндексе
            </Button>
          </a>
          <a
            href="https://2gis.ru/moscow/firm/4504128908512077"
            target="_blank"
            rel="noreferrer"
          >
            <Button size="lg" className="rounded-full px-8 text-base">
              <Icon name="Star" size={18} className="mr-2" /> Отзыв в 2ГИС
            </Button>
          </a>
          <Link to="/reviews">
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base">
              Все отзывы и работы
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </Link>
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
            <a href="tel:+79854198903" className="flex items-center gap-2 transition-colors hover:text-primary">
              <Icon name="Phone" size={18} className="text-primary" /> +7 (985) 419-89-03
            </a>
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