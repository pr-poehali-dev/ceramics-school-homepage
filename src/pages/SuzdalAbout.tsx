import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { usePageMeta } from '@/hooks/usePageMeta';
import { usePageContent } from '@/hooks/usePageContent';

const SuzdalAbout = () => {
  const c = usePageContent('suzdal-about');
  usePageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
  });

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader active="/suzdal/about" />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src={c.heroImg}
          alt="Фабрика «Дымов Керамика» в Суздале"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />

        <div className="container relative flex min-h-[45vh] flex-col justify-end py-14 text-white md:min-h-[55vh]">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <Icon name="Factory" size={16} /> {c.badge}
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-tight md:text-6xl">
            {c.h1}
          </h1>
        </div>
      </section>

      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          {/* FACTORY */}
          <section className="rounded-2xl border border-border bg-card p-7 md:p-10">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name="Factory" size={24} />
              </span>
              <h2 className="font-display text-2xl font-semibold md:text-3xl">{c.factoryTitle}</h2>
            </div>
            <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
              {(c.factoryText || '').split('\n').filter(Boolean).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>

          {/* SCHOOL */}
          <section className="mt-8 rounded-2xl border border-border bg-card p-7 md:p-10">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name="GraduationCap" size={24} />
              </span>
              <h2 className="font-display text-2xl font-semibold md:text-3xl">{c.schoolTitle}</h2>
            </div>
            <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
              {(c.schoolText || '').split('\n').filter(Boolean).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link to="/suzdal/workshops">
                <Button size="lg" className="rounded-full px-8 text-base">
                  <Icon name="Hammer" size={18} className="mr-2" /> {c.schoolButtonText}
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default SuzdalAbout;