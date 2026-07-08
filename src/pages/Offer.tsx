import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import MobileMenu from '@/components/MobileMenu';
import Logo from '@/components/Logo';
import SocialLinks from '@/components/SocialLinks';
import ReviewLinks from '@/components/ReviewLinks';
import FooterLegal from '@/components/FooterLegal';
import DesktopNav from '@/components/DesktopNav';
import CartButton from '@/components/CartButton';
import { OFFER_INTRO, OFFER_TERMS, OFFER_SECTIONS } from './offer/offerData';

const Offer = () => {
  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/moscow" className="flex items-center">
            <Logo scale={false} />
          </Link>
          <DesktopNav />
          <a
            href="tel:+79854198903"
            className="hidden items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary md:flex"
          >
            <Icon name="Phone" size={18} className="text-primary" /> +7 (985) 419-89-03
          </a>
          <div className="flex items-center gap-3">
            <CartButton />
            <MobileMenu />
          </div>
        </div>
      </header>

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
      <footer className="mt-16 border-t border-border bg-secondary/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
          <Logo className="h-9" />
          <span className="flex items-center gap-2">
            <Icon name="MapPin" size={16} className="text-primary" /> ВДНХ, Москва
          </span>
          <a href="tel:+79854198903" className="flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary">
            <Icon name="Phone" size={16} className="text-primary" /> +7 (985) 419-89-03
          </a>
          <ReviewLinks />
          <SocialLinks size={18} variant="solid" />
          <FooterLegal />
        </div>
      </footer>
    </div>
  );
};

export default Offer;