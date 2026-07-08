import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import MobileMenu from '@/components/MobileMenu';
import Logo from '@/components/Logo';
import SocialLinks from '@/components/SocialLinks';
import DesktopNav from '@/components/DesktopNav';
import CartButton from '@/components/CartButton';
import { REVIEWS } from './reviews/reviewsData';
import ReviewCard from './reviews/ReviewCard';
import ReviewsGallery from './reviews/ReviewsGallery';

const STEP = 24;
const AVG = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

const Reviews = () => {
  const [visible, setVisible] = useState(STEP);

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/moscow" className="flex items-center">
            <Logo scale={false} />
          </Link>
          <DesktopNav active="/reviews" />
          <a
            href="tel:+79854198903"
            className="hidden items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary md:flex"
          >
            <Icon name="Phone" size={18} className="text-primary" /> +7 (985) 419-89-03
          </a>
          <div className="flex items-center gap-3">
            <CartButton />
            <MobileMenu active="/reviews" />
          </div>
        </div>
      </header>

      <div className="container py-12 md:py-16">
        {/* PAGE TITLE */}
        <div className="animate-fade-in text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="MessageSquareHeart" size={16} /> Отзывы
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold md:text-6xl">
            Что говорят <span className="text-primary italic">наши гости</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Тёплые слова участников мастер-классов и работы, созданные их руками.
          </p>

          {/* RATING */}
          <div className="mx-auto mt-8 flex w-fit flex-wrap items-center justify-center gap-6 rounded-2xl border border-border bg-card px-8 py-5">
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl font-semibold text-primary">{AVG}</span>
              <div className="text-left">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="Star" size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">средняя оценка</p>
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-left">
              <p className="font-display text-2xl font-semibold">{REVIEWS.length}+</p>
              <p className="text-xs text-muted-foreground">отзывов о студии</p>
            </div>
          </div>

          <div className="mt-6">
            <a
              href="https://yandex.ru/profile/8182762882?lang=ru&utm_source=copy_link&utm_medium=social&utm_campaign=share"
              target="_blank"
              rel="noreferrer"
            >
              <Button size="lg" className="rounded-full px-8">
                <Icon name="Star" size={18} className="mr-2" /> Оставить отзыв
              </Button>
            </a>
          </div>
        </div>

        {/* GALLERY */}
        <section className="mt-14">
          <div className="mb-6 flex items-center gap-2">
            <Icon name="Images" size={22} className="text-primary" />
            <h2 className="font-display text-2xl font-semibold">Работы участников</h2>
          </div>
          <ReviewsGallery />
        </section>

        {/* REVIEWS LIST */}
        <section className="mt-16">
          <div className="mb-6 flex items-center gap-2">
            <Icon name="Quote" size={22} className="text-primary" />
            <h2 className="font-display text-2xl font-semibold">Отзывы гостей</h2>
          </div>

          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {REVIEWS.slice(0, visible).map((r, i) => (
              <ReviewCard key={`${r.name}-${i}`} review={r} index={i} />
            ))}
          </div>

          {visible < REVIEWS.length && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8"
                onClick={() => setVisible((v) => v + STEP)}
              >
                Показать ещё
                <Icon name="ChevronDown" size={18} className="ml-2" />
              </Button>
            </div>
          )}
        </section>

        {/* CTA */}
        <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-[2rem] bg-primary px-8 py-12 text-center text-primary-foreground md:px-16">
          <h3 className="font-display text-3xl font-semibold md:text-4xl">
            Хотите так же?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Выберите формат мастер-класса и создайте своё изделие из глины — впечатления
            останутся надолго.
          </p>
          <Link to="/formats">
            <Button size="lg" variant="secondary" className="mt-7 rounded-full px-8">
              <Icon name="LayoutGrid" size={18} className="mr-2" /> Выбрать формат
            </Button>
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-border bg-secondary/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
          <Logo className="h-9" />
          <span className="flex items-center gap-2">
            <Icon name="MapPin" size={16} className="text-primary" /> ВДНХ, Москва
          </span>
          <a href="tel:+79854198903" className="flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary">
            <Icon name="Phone" size={16} className="text-primary" /> +7 (985) 419-89-03
          </a>
          <SocialLinks size={18} variant="solid" />
          <span>© 2026 Все права защищены</span>
        </div>
      </footer>
    </div>
  );
};

export default Reviews;