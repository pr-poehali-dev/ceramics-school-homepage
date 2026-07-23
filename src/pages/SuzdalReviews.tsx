import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { REVIEWS, GALLERY } from './suzdal-reviews/reviewsData';
import ReviewCard from './reviews/ReviewCard';
import ReviewsGallery from './reviews/ReviewsGallery';
import { usePageMeta } from '@/hooks/usePageMeta';
import { usePageContent } from '@/hooks/usePageContent';

const STEP = 24;
const AVG = '4.9';

const SuzdalReviews = () => {
  const [visible, setVisible] = useState(STEP);
  const c = usePageContent('suzdal-reviews');

  usePageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
  });

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <SiteHeader active="/suzdal/reviews" />

      <div className="container py-12 md:py-16">
        {/* PAGE TITLE */}
        <div className="animate-fade-in text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="MessageSquareHeart" size={16} /> Отзывы
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold md:text-6xl">
            Что говорят <span className="text-primary italic">{c.h1}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {c.subtitle}
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
              <p className="text-xs text-muted-foreground">отзывов о фабрике</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-left">
              <p className="font-display text-2xl font-semibold">{c.statPositiveCount}</p>
              <p className="text-xs text-muted-foreground">положительных оценок</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={c.yandexReviewUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Button size="lg" className="rounded-full px-8">
                <Icon name="Star" size={18} className="mr-2" /> Отзыв на Яндексе
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
          <ReviewsGallery images={GALLERY} />
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
            {c.ctaTitle}
          </h3>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            {c.ctaText}
          </p>
          <Link to="/suzdal/workshops">
            <Button size="lg" variant="secondary" className="mt-7 rounded-full px-8">
              <Icon name="LayoutGrid" size={18} className="mr-2" /> {c.ctaButtonText}
            </Button>
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
};

export default SuzdalReviews;