import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { COOKIES_INTRO, COOKIES_SECTIONS } from './cookies/cookiesData';

const Cookies = () => {
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
              Политика использования файлов cookie
            </h1>
          </div>

          {/* INTRO */}
          <p className="mt-10 text-sm leading-relaxed text-muted-foreground">{COOKIES_INTRO}</p>

          {/* SECTIONS */}
          <div className="mt-8 space-y-8">
            {COOKIES_SECTIONS.map((s, idx) => (
              <section key={s.heading || idx}>
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
                {s.list && (
                  <ul className="mt-3 space-y-2">
                    {s.list.map((li) => (
                      <li key={li} className="flex gap-2 text-sm text-muted-foreground">
                        <Icon name="Check" size={16} className="mt-0.5 shrink-0 text-primary" />
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
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

export default Cookies;
