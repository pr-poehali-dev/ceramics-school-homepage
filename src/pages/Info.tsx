import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { usePageMeta } from '@/hooks/usePageMeta';
import { usePageContent } from '@/hooks/usePageContent';

const SECTIONS = [
  { id: 'delivery', label: 'Доставка', icon: 'Truck' },
  { id: 'pickup', label: 'Условия выдачи изделия', icon: 'PackageCheck' },
];

const Info = () => {
  const c = usePageContent('moscow-info');
  usePageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
  });
  const phoneHref = `tel:${(c.phone || '+79854198903').replace(/[^\d+]/g, '')}`;
  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <SiteHeader />

      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          {/* TITLE */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Icon name="Info" size={16} /> Информация
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold md:text-5xl">
              {c.h1}
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
              {c.subtitle}
            </p>
          </div>

          {/* QUICK NAV */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Icon name={s.icon} size={16} className="text-primary" /> {s.label}
              </a>
            ))}
          </div>

          {/* DELIVERY */}
          <section id="delivery" className="mt-12 scroll-mt-24 rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name="Truck" size={24} />
              </span>
              <h2 className="font-display text-2xl font-semibold">Доставка</h2>
            </div>
            <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                {c.deliveryText1}
              </p>
              <p>
                {c.deliveryText2}{' '}
                <a href={phoneHref} className="font-semibold text-primary hover:underline">
                  {c.phone}
                </a>{' '}
                {c.deliveryText2After}
              </p>
            </div>
          </section>

          {/* PICKUP */}
          <section id="pickup" className="mt-8 scroll-mt-24 rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name="PackageCheck" size={24} />
              </span>
              <h2 className="font-display text-2xl font-semibold">Условия выдачи изделия</h2>
            </div>

            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>{c.pickupIntro}</p>

              <ol className="space-y-3">
                {(c.pickupSteps || '').split('\n').filter(Boolean).map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <div className="rounded-xl bg-secondary/40 p-4">
                <p className="flex gap-2">
                  <Icon name="MapPin" size={16} className="mt-0.5 shrink-0 text-primary" />
                  <span>
                    {c.pickupNoteAfterPhone}{' '}
                    <span className="font-medium text-foreground">
                      {c.address}
                    </span>
                    . {c.workHours}. Телефон:{' '}
                    <a href={phoneHref} className="font-semibold text-primary hover:underline">
                      {c.phone}
                    </a>
                    .
                  </span>
                </p>
              </div>

              <p className="flex gap-2">
                <Icon name="Camera" size={16} className="mt-0.5 shrink-0 text-primary" />
                {c.pickupPhotoNote}
              </p>
              <p className="flex gap-2">
                <Icon name="Clock" size={16} className="mt-0.5 shrink-0 text-primary" />
                {c.pickupStorageNote}
              </p>

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <p className="flex gap-2 font-medium text-foreground">
                  <Icon name="TriangleAlert" size={16} className="mt-0.5 shrink-0 text-primary" />
                  {c.pickupWarning}
                </p>
              </div>

              <p className="text-xs">
                {c.pickupFootnote}
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
};

export default Info;