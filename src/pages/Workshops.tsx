import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AskQuestionDialog from '@/components/AskQuestionDialog';
import { usePageMeta } from '@/hooks/usePageMeta';
import { usePageContent } from '@/hooks/usePageContent';

const WORKSHOPS_BASE = [
  {
    contentKey: 'moscow-workshops-lepka',
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/031d0b25-5ce6-4c27-8e82-d33ec3b0b178.png',
    title: 'Лепка',
    desc: 'Создание изделий руками из глины. От фигурки до посуды.',
    people: '1–20',
    duration: '1 час',
    price: 'от 1 900 ₽',
    age: '3+',
    href: '/moscow/workshops/lepka',
    note: null as null | { icon: string; text: string; tone: 'warn' | 'fast' },
  },
  {
    contentKey: 'moscow-workshops-krug',
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/ab36a67f-4ea0-4d3a-8ebe-21e8a9dfb891.png',
    title: 'Гончарный круг',
    desc: 'Работа за гончарным кругом. Создайте посуду своими руками.',
    people: '1–12',
    duration: '1 час',
    price: 'от 2 900 ₽',
    age: '7+',
    href: '/moscow/workshops/krug' as null | string,
    note: { icon: 'TriangleAlert', text: 'Нет кругов вт / ср / чт', tone: 'warn' as const },
  },
  {
    contentKey: 'moscow-workshops-angoby',
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/7f664b40-fac2-4114-b0ad-70fc8524f908.png',
    title: 'Роспись ангобами',
    desc: 'Роспись изделий специальными керамическими красками.',
    people: '1–20',
    duration: '1 час',
    price: 'от 2 100 ₽',
    age: '3+',
    href: '/moscow/workshops/angoby' as null | string,
    note: null,
  },
  {
    contentKey: 'moscow-workshops-akril',
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/0bce1c46-ce6d-45d4-9a78-fc97b423975d.jpg',
    title: 'Роспись акрилом',
    desc: 'Яркая роспись акрилом. Забираете изделие сразу!',
    people: '1–50',
    duration: '1 час',
    price: 'от 1 500 ₽',
    age: '3+',
    href: '/moscow/workshops/akril' as null | string,
    note: { icon: 'Zap', text: 'Забрать сразу', tone: 'fast' as const },
  },
];

const Workshops = () => {
  const c = usePageContent('moscow-workshops');
  const lepka = usePageContent('moscow-workshops-lepka');
  const krug = usePageContent('moscow-workshops-krug');
  const angoby = usePageContent('moscow-workshops-angoby');
  const akril = usePageContent('moscow-workshops-akril');
  const CONTENT_BY_KEY: Record<string, Record<string, string>> = {
    'moscow-workshops-lepka': lepka,
    'moscow-workshops-krug': krug,
    'moscow-workshops-angoby': angoby,
    'moscow-workshops-akril': akril,
  };

  usePageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
  });

  const WORKSHOPS = WORKSHOPS_BASE.map((w) => {
    const wc = CONTENT_BY_KEY[w.contentKey] || {};
    return {
      ...w,
      title: wc.title || w.title,
      desc: wc.subtitle || w.desc,
      price: wc.price ? `от ${wc.price}` : w.price,
      img: wc.img || w.img,
    };
  });

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <SiteHeader active="/moscow/workshops" />

      {/* HERO */}
      <section className="container py-14 md:py-20">
        <div className="animate-fade-in text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="Sparkles" size={16} /> Наши мастер-классы
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] md:text-6xl">
            {c.h1}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            {c.subtitle}
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
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-2xl md:h-32 md:w-44">
                  <img
                    src={w.img}
                    alt={w.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
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

        {/* LINK TO FORMATS */}
        <Link
          to="/moscow/formats"
          className="group mx-auto mt-14 flex max-w-4xl items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl md:p-7"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="CalendarHeart" size={22} />
            </span>
            <div>
              <p className="font-display text-xl font-semibold">
                {c.formatsBannerTitle}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {c.formatsBannerText}
              </p>
            </div>
          </div>
          <Icon
            name="ArrowRight"
            size={20}
            className="shrink-0 text-primary transition-transform group-hover:translate-x-1"
          />
        </Link>

        <div className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-[2rem] bg-primary px-8 py-12 text-center text-primary-foreground md:px-16">
          <h3 className="font-display text-3xl font-semibold md:text-4xl">
            {c.askBannerTitle}
          </h3>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            {c.askBannerText}
          </p>
          <AskQuestionDialog>
            <Button size="lg" variant="secondary" className="mt-7 rounded-full px-8 text-base">
              <Icon name="MessageCircle" size={18} className="mr-2" /> {c.askBannerButtonText}
            </Button>
          </AskQuestionDialog>
        </div>
      </section>

      {/* SEO TEXT */}
      <section className="container pb-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            {c.seoTitle}
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            {(c.seoParagraphs || '').split('\n').filter(Boolean).map((p) => (
              <p key={p}>{p}</p>
            ))}

            <h3 className="pt-4 font-display text-2xl font-semibold text-foreground">
              {c.seoListTitle}
            </h3>
            <ul className="space-y-2">
              {(c.seoListItems || '').split('\n').filter(Boolean).map((li) => (
                <li key={li} className="flex gap-2">
                  <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-primary" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>

            <p className="pt-2">{c.seoStagesIntro}</p>
            <ul className="space-y-2">
              {(c.seoStagesList || '').split('\n').filter(Boolean).map((li) => (
                <li key={li} className="flex gap-2">
                  <Icon name="ChevronRight" size={18} className="mt-0.5 shrink-0 text-primary" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
            <p>{c.seoClosing}</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
};

const Meta = ({ icon, text }: { icon: string; text: string }) => (
  <span className="flex items-center gap-2 text-muted-foreground">
    <Icon name={icon} size={16} /> {text}
  </span>
);

export default Workshops;