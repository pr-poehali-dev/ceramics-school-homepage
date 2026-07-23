import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { openBooking } from '@/lib/booking';
import { usePageMeta } from '@/hooks/usePageMeta';
import { usePageContent } from '@/hooks/usePageContent';
import { ALL_FORMATS } from './formats/formatsData';
import { REVIEWS, GALLERY } from './reviews/reviewsData';

const CERTIFICATE_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/858c5def-a2d9-4503-aef3-192e73b205e1.png';

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
  const c = usePageContent('moscow-home');
  usePageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
  });

  const SERVICES = [
    { img: c.service1Img, title: c.service1Title, desc: c.service1Desc, price: c.service1Price, href: '/moscow/workshops/lepka' },
    { img: c.service2Img, title: c.service2Title, desc: c.service2Desc, price: c.service2Price, href: '/moscow/workshops/krug' },
    { img: c.service3Img, title: c.service3Title, desc: c.service3Desc, price: c.service3Price, href: '/moscow/workshops/angoby' },
    { img: c.service4Img, title: c.service4Title, desc: c.service4Desc, price: c.service4Price, href: '/moscow/workshops/akril' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <img
          src={c.heroImg}
          alt="Мастерская керамики"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

        <div className="container relative flex min-h-[75vh] items-center py-20 md:min-h-[85vh]">
          <div className="max-w-2xl animate-fade-in text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              <Icon name="MapPin" size={16} /> Студия керамики на ВДНХ
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] md:text-7xl">
              {c.heroTitle}
            </h1>
            <p className="mt-6 max-w-md text-lg text-white/85">
              {c.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" onClick={openBooking} className="rounded-full px-8 text-base">
                <Icon name="CalendarCheck" size={18} className="mr-2" /> Записаться
              </Button>
              <Link to="/moscow/certificates">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/40 bg-white/10 px-8 text-base text-white backdrop-blur hover:bg-white hover:text-foreground"
                >
                  <Icon name="Gift" size={18} className="mr-2" /> Подарить сертификат
                </Button>
              </Link>
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
              to={s.href}
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
          <SectionTitle eyebrow="Форматы" title={c.formatsTitle} />
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            {c.formatsSubtitle}
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ALL_FORMATS.map((f) => {
              const formatTo = `/moscow/formats?show=${f.slug}#format-${f.slug}`;
              return (
              <Link
                key={f.title}
                to={formatTo}
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
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link to="/moscow/formats">
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
              to="/moscow/reviews"
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
          <Link to="/moscow/reviews">
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
                {c.certificatesTitle}
              </h2>
              <p className="mt-4 text-primary-foreground/80">
                {c.certificatesText}
              </p>
              <Link to="/moscow/certificates">
                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-8 rounded-full px-8 text-base"
                >
                  {c.certificatesButtonText}
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

      {/* SHOP INVITE */}
      <section className="container py-16 md:py-20">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Icon name="ShoppingBag" size={16} /> Интернет-магазин
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold md:text-4xl">
                {c.shopTitle}
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                {c.shopText}
              </p>
              <a
                href="https://dymovceramic.ru/"
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {c.shopButtonText}
                <Icon name="ArrowRight" size={18} />
              </a>
            </div>
            <div className="relative hidden h-full min-h-[18rem] md:block">
              <img
                src={c.shopImg}
                alt="Керамика ручной работы"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SEO TEXT */}
      <section className="container pb-16 md:pb-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            {c.seoTitle}
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            <p>{c.seoParagraph1}</p>
            <p>{c.seoParagraph2}</p>
            <p>{c.seoParagraph3}</p>
            <p>{c.seoParagraph4}</p>

            <h3 className="pt-4 font-display text-2xl font-semibold text-foreground">
              {c.seoSubtitle1}
            </h3>
            <p>{c.seoParagraph5}</p>
            <p>{c.seoParagraph6}</p>
            <p>{c.seoParagraph7}</p>

            <h3 className="pt-4 font-display text-2xl font-semibold text-foreground">
              {c.seoSubtitle2}
            </h3>
            <ul className="space-y-2">
              {(c.seoAdvantagesList || '').split('\n').filter(Boolean).map((li) => (
                <li key={li} className="flex gap-2">
                  <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-primary" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
            <p>
              Уточнить подробности и задать интересующие Вас вопросы можете, связавшись с нами по
              телефону{' '}
              <a
                href={`tel:${(c.seoPhone || '').replace(/[^\d+]/g, '')}`}
                className="font-semibold text-primary transition-colors hover:underline"
              >
                {c.seoPhone}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />
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