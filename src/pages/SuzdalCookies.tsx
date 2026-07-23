import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import LegalDocument from '@/components/LegalDocument';
import { usePageMeta } from '@/hooks/usePageMeta';
import { usePageContent } from '@/hooks/usePageContent';

const SuzdalCookies = () => {
  const c = usePageContent('suzdal-cookies');
  usePageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
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
              <Icon name="Cookie" size={16} /> Документы
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold md:text-5xl">
              {c.h1}
            </h1>
          </div>

          {/* DOCUMENT */}
          <div className="mt-10">
            <LegalDocument text={c.documentText} />
          </div>

          <p className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            © 2003–2026 «Дымов Керамика». Все права защищены.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
};

export default SuzdalCookies;