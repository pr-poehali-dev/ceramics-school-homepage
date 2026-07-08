import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { OFFER_INTRO, OFFER_TERMS, OFFER_SECTIONS } from './offer/offerData';

const Offer = () => {
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
          <p className="mt-10 text-sm leading-relaxed text-muted-foreground">{OFFER_INTRO}</p>

          {/* TERMS */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Термины и определения</h2>
            <dl className="mt-4 space-y-3">
              {OFFER_TERMS.map((t) => (
                <div key={t.term} className="text-sm leading-relaxed">
                  <dt className="inline font-semibold text-foreground">{t.term} — </dt>
                  <dd className="inline text-muted-foreground">{t.definition}</dd>
                </div>
              ))}
            </dl>
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

export default Offer;