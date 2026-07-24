import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { usePageMeta } from '@/hooks/usePageMeta';
import { usePageContent } from '@/hooks/usePageContent';
import AskQuestionDialog from '@/components/AskQuestionDialog';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import { SUZDAL_WORKSHOP_DETAILS } from './SuzdalWorkshopDetail';

const WORKSHOPS_BASE = Object.values(SUZDAL_WORKSHOP_DETAILS);

const SuzdalWorkshops = () => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const c = usePageContent('suzdal-workshops');

  usePageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
  });

  const WORKSHOPS = WORKSHOPS_BASE.map((w) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const wc = usePageContent(`suzdal-workshops-${w.slug}`);
    return {
      ...w,
      title: wc.title || w.title,
      subtitle: wc.subtitle || w.subtitle,
      img: wc.img || w.img,
      price: wc.price ? Number(wc.price) || w.price : w.price,
    };
  });

  const handleAddToCart = (e: React.MouseEvent, w: (typeof WORKSHOPS)[number]) => {
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
      {/* HEADER */}
      <SiteHeader active="/suzdal/workshops" />

      {/* HERO */}
      <section className="container py-14 md:py-20">
        <div className="animate-fade-in text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="Sparkles" size={16} /> Мастер-классы
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] md:text-6xl">
            Наши <span className="text-primary italic">{c.h1}</span>
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
            <Link
              key={w.slug}
              to={`/suzdal/workshops/${w.slug}`}
              className="group animate-fade-in block rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl md:p-8"
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
                  <div>
                    <h2 className="font-display text-3xl font-semibold">{w.title}</h2>
                    <p className="mt-1 text-muted-foreground">{w.subtitle}</p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                    <Meta icon="Clock" text={w.duration} />
                    <span className="flex items-center gap-2 font-semibold text-primary">
                      <Icon name="Tag" size={16} /> {w.price.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-medium text-secondary-foreground">
                      {w.age}
                    </span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      onClick={(e) => handleAddToCart(e, w)}
                      className="rounded-full"
                    >
                      <Icon name="ShoppingCart" size={16} className="mr-2" /> В корзину
                    </Button>
                    <Button variant="outline" className="rounded-full">
                      Подробнее
                      <Icon name="ArrowRight" size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-[2rem] bg-primary px-8 py-12 text-center text-primary-foreground md:px-16">
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

export default SuzdalWorkshops;