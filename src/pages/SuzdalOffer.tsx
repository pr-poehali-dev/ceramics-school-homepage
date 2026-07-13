import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { OFFER_INTRO, OFFER_SECTIONS } from './suzdal-offer/offerData';
import { usePageMeta } from '@/hooks/usePageMeta';

const SuzdalOffer = () => {
  usePageMeta({
    title: 'Публичная оферта | Дымов Керамика в Суздале',
    description:
      'Публичная оферта фабрики и школы керамики «Дымов Керамика» в Суздале. Условия оказания услуг по проведению мастер-классов и экскурсий, оплаты и возврата.',
  });
  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <SiteHeader />

      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          {/* TITLE */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Icon name="FileText" size={16} /> Документы
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold md:text-5xl">
              Публичная оферта
            </h1>
            <p className="mt-3 text-muted-foreground">Договор</p>
          </div>

          {/* INTRO */}
          <div className="mt-10 space-y-3">
            {OFFER_INTRO.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>

          {/* SECTIONS */}
          <div className="mt-8 space-y-8">
            {OFFER_SECTIONS.map((s) => (
              <section key={s.heading}>
                {s.heading && (
                  <h2 className="mb-3 font-display text-xl font-semibold">{s.heading}</h2>
                )}
                <div className="space-y-3">
                  {s.paragraphs.map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            © 2003–2026 «Дымов Керамика». Все права защищены. Публичная оферта.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
};

export default SuzdalOffer;
