import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';
import { usePageMeta } from '@/hooks/usePageMeta';
import { usePageContent } from '@/hooks/usePageContent';
import { REVIEWS as MOSCOW_REVIEWS } from './reviews/reviewsData';
import { REVIEWS as SUZDAL_REVIEWS } from './suzdal-reviews/reviewsData';

const TOTAL_REVIEWS = MOSCOW_REVIEWS.length + SUZDAL_REVIEWS.length;
const ALL_RATINGS = [...MOSCOW_REVIEWS, ...SUZDAL_REVIEWS];
const AVG_RATING = (
  ALL_RATINGS.reduce((s, r) => s + r.rating, 0) / ALL_RATINGS.length
).toFixed(1);

const STATS = [
  { icon: 'Calendar', value: '2003', label: 'год основания' },
  { icon: 'MapPin', value: '2', label: 'города — Москва и Суздаль' },
  { icon: 'Star', value: AVG_RATING, label: 'средняя оценка гостей' },
  { icon: 'MessageSquareHeart', value: `${TOTAL_REVIEWS}+`, label: 'отзывов от посетителей' },
];

const ChooseCity = () => {
  const c = usePageContent('home');
  usePageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
  });
  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* LOGO */}
      <div className="flex flex-col items-center pt-12 pb-8 md:pt-16">
        <Logo className="h-14 origin-center md:h-16" />
        <h1 className="mt-5 text-center font-display text-2xl font-semibold md:text-3xl">{c.h1}</h1>
      </div>

      {/* CHOICE BLOCKS */}
      <div className="container pb-14 md:pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {/* MOSCOW */}
          <Link
            to="/moscow"
            className="group overflow-hidden rounded-[2rem] border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-64 overflow-hidden md:h-80">
              <img
                src={c.moscowImg}
                alt="Школа Дымов Керамика на ВДНХ в Москве"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                <Icon name="MapPin" size={13} className="text-primary" /> {c.moscowBadge}
              </span>
            </div>
            <div className="p-7 md:p-8">
              <h2 className="font-display text-2xl font-semibold leading-tight md:text-3xl">
                {c.moscowTitle}
              </h2>
              <span className="mt-5 inline-flex items-center gap-2 text-base font-medium text-primary transition-all group-hover:gap-3">
                {c.moscowLinkText}
                <Icon name="ArrowRight" size={20} />
              </span>
            </div>
          </Link>

          {/* SUZDAL */}
          <Link
            to="/suzdal"
            className="group overflow-hidden rounded-[2rem] border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-64 overflow-hidden md:h-80">
              <img
                src={c.suzdalImg}
                alt="Фабрика и школа Дымов Керамика в Суздале"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                <Icon name="MapPin" size={13} className="text-primary" /> {c.suzdalBadge}
              </span>
            </div>
            <div className="p-7 md:p-8">
              <h2 className="font-display text-2xl font-semibold leading-tight md:text-3xl">
                {c.suzdalTitle}
              </h2>
              <span className="mt-5 inline-flex items-center gap-2 text-base font-medium text-primary transition-all group-hover:gap-3">
                {c.suzdalLinkText}
                <Icon name="ArrowRight" size={20} />
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* ABOUT + STATS */}
      <section className="border-t border-border bg-secondary/30 py-14 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Icon name="Flame" size={16} /> О компании
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold md:text-4xl">
              «Дымов Керамика» — гончарные традиции с 2003 года
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Мы начинали как небольшая гончарная мастерская в Суздале, а сегодня это фабрика
              керамических изделий ручной работы и школа гончарного искусства с двумя площадками —
              в Суздале и в Москве на ВДНХ. Учим детей и взрослых лепке, работе на гончарном круге
              и росписи керамики, проводим экскурсии по производству и создаём авторскую посуду,
              которую можно увезти на память.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-5 text-center"
              >
                <Icon name={s.icon} size={22} className="text-primary" />
                <span className="font-display text-2xl font-semibold md:text-3xl">{s.value}</span>
                <span className="text-xs text-muted-foreground md:text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-secondary/40">
        <div className="container flex flex-col items-center justify-center gap-1 py-6 text-sm text-muted-foreground">
          <span>© 2003–2026 «Дымов Керамика». Все права защищены.</span>
        </div>
      </footer>
    </div>
  );
};

export default ChooseCity;