import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { usePageMeta } from '@/hooks/usePageMeta';
import { usePageContent } from '@/hooks/usePageContent';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import { SUZDAL_WORKSHOP_DETAILS } from './SuzdalWorkshopDetail';
import { REVIEWS, GALLERY } from './suzdal-reviews/reviewsData';

const EXCURSION_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/6c567306-9774-4e90-ae66-a78ec8eb5977.png';

const WORKSHOP_SLUGS = [
  'goncharnoe-remeslo',
  'rospis-keramicheskix-tarelok',
  'izgotovlenie-izrazcov',
  'kruzhevnaya-keramika',
];
const HOME_WORKSHOPS = WORKSHOP_SLUGS.map((slug) => SUZDAL_WORKSHOP_DETAILS[slug]);

const REVIEW_AVG = '4.9';
const HOME_REVIEWS = REVIEWS.slice(0, 3);
const HOME_GALLERY = GALLERY.slice(0, 6);

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

const Suzdal = () => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const c = usePageContent('suzdal-home');

  usePageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
  });

  const handleAddToCart = (e: React.MouseEvent, w: (typeof HOME_WORKSHOPS)[number]) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `suzdal-${w.slug}`,
      title: w.title,
      details: 'Билет «Разовый»',
      price: w.price,
      qty: 1,
    });
    toast({ title: 'Добавлено в корзину', description: w.title });
    navigate('/suzdal/checkout');
  };

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <img
          src={c.heroImg}
          alt="Фабрика и школа керамики в Суздале"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

        <div className="container relative flex min-h-[75vh] items-center py-20 md:min-h-[85vh]">
          <div className="max-w-2xl animate-fade-in text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              <Icon name="MapPin" size={16} /> Фабрика и школа керамики в Суздале
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] md:text-7xl">
              {c.heroTitle}
            </h1>
            <p className="mt-6 max-w-md text-lg text-white/85">
              {c.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#workshops">
                <Button size="lg" className="rounded-full px-8 text-base">
                  <Icon name="Hammer" size={18} className="mr-2" /> Перейти к мастер-классам
                </Button>
              </a>
              <Link to="/suzdal/certificates">
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

      {/* WORKSHOPS */}
      <section id="workshops" className="container py-16 md:py-24">
        <SectionTitle eyebrow="Наши услуги" title="Мастер-классы" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_WORKSHOPS.map((w) => (
            <Link
              key={w.slug}
              to={`/suzdal/workshops/${w.slug}`}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={w.img}
                  alt={w.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold leading-tight">{w.title}</h3>
                <p className="mt-4 text-lg font-semibold text-primary">
                  от {w.price.toLocaleString('ru-RU')} ₽
                </p>
                <Button
                  onClick={(e) => handleAddToCart(e, w)}
                  className="mt-4 w-full rounded-full"
                  size="sm"
                >
                  <Icon name="ShoppingCart" size={15} className="mr-2" /> В корзину
                </Button>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/suzdal/workshops">
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base">
              Все мастер-классы
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* EXCURSIONS */}
      <section id="excursions" className="bg-secondary/50 py-16 md:py-24">
        <div className="container">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card md:grid md:grid-cols-2 md:items-center">
            <div className="aspect-[4/3] overflow-hidden md:aspect-auto md:h-full">
              <img
                src={EXCURSION_IMG}
                alt="Экскурсия по фабрике «Дымов Керамика» в Суздале"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8 md:p-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Icon name="Factory" size={16} /> Экскурсии
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold md:text-4xl">
                Загляните за кулисы производства
              </h2>
              <p className="mt-4 text-muted-foreground">
                Полный цикл создания керамики — от массозаготовки до обжига, росписи и
                упаковки. Экскурсия длится от 30 до 45 минут и подходит для взрослых и детей от 5 лет.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 font-medium">
                  <Icon name="User" size={16} className="text-primary" /> Взрослый — 1 000 ₽
                </span>
                <span className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 font-medium">
                  <Icon name="Baby" size={16} className="text-primary" /> Детский — 600 ₽
                </span>
              </div>
              <Link to="/suzdal/excursions">
                <Button size="lg" className="mt-8 rounded-full px-8 text-base">
                  Подробнее об экскурсии
                  <Icon name="ArrowRight" size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
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
              to="/suzdal/reviews"
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
          <Link to="/suzdal/reviews">
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base">
              Все отзывы и работы
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

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

export default Suzdal;