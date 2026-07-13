import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { REVIEWS } from './reviews/reviewsData';
import ReviewCard from './reviews/ReviewCard';
import ReviewsGallery from './reviews/ReviewsGallery';
import { usePageMeta } from '@/hooks/usePageMeta';

const STEP = 24;
const AVG = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

const Reviews = () => {
  const [visible, setVisible] = useState(STEP);

  usePageMeta({
    title: 'Отзывы о студии керамики Дымов Керамика | ВДНХ, Москва',
    description:
      'Честные отзывы гостей о мастер-классах в студии керамики «Дымов Керамика» на ВДНХ. 101+ отзыв, средняя оценка 5.0. Узнайте, что говорят участники о лепке, гончарном круге и росписи керамики.',
  });

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <SiteHeader active="/moscow/reviews" />

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
            <div className="h-10 w-px bg-border" />
            <div className="text-left">
              <p className="font-display text-2xl font-semibold">+700</p>
              <p className="text-xs text-muted-foreground">положительных оценок</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://yandex.ru/profile/8182762882?lang=ru&utm_source=copy_link&utm_medium=social&utm_campaign=share"
              target="_blank"
              rel="noreferrer"
            >
              <Button size="lg" className="rounded-full px-8">
                <Icon name="Star" size={18} className="mr-2" /> Отзыв на Яндексе
              </Button>
            </a>
            <a
              href="https://2gis.ru/moscow/firm/4504128908512077"
              target="_blank"
              rel="noreferrer"
            >
              <Button size="lg" variant="outline" className="rounded-full px-8">
                <Icon name="Star" size={18} className="mr-2" /> Отзыв в 2ГИС
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
          <Link to="/moscow/formats">
            <Button size="lg" variant="secondary" className="mt-7 rounded-full px-8">
              <Icon name="LayoutGrid" size={18} className="mr-2" /> Выбрать формат
            </Button>
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
};

export default Reviews;