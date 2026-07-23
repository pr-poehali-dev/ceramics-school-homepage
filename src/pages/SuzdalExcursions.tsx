import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ReviewsGallery from '@/pages/reviews/ReviewsGallery';
import { usePageMeta } from '@/hooks/usePageMeta';
import { usePageContent } from '@/hooks/usePageContent';

const EXCURSION_VIDEO = '/video/suzdal-excursion.mp4';
const EXCURSION_VIDEO_POSTER = '/video/suzdal-excursion-poster.jpg';

const EXCURSION_GALLERY: string[] = [
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/6981a41f-a208-4c29-8da8-961e77b2310c.jpeg',
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/8effc812-f55a-48f8-8151-45e875ced003.jpeg',
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/6c076295-b32d-4fa5-a46b-5b81cabe22fe.jpeg',
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/37096009-0ead-45e9-9d42-c1a1f8f395bf.jpeg',
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/d774bbae-e455-4dee-a6e0-2c45e16cdd0d.jpeg',
];

const SuzdalExcursions = () => {
  const c = usePageContent('suzdal-excursions');
  usePageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
  });

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader active="/suzdal/excursions" />

      {/* HERO */}
      <section className="container py-8 md:py-12">
        <div className="animate-fade-in overflow-hidden rounded-[2rem] border border-border">
          <img
            src={c.bannerImg}
            alt="Экскурсия на завод керамики «Дымов Керамика»"
            className="w-full object-cover"
          />
        </div>
      </section>

      <div className="container pb-12 md:pb-16">
        <div className="mx-auto max-w-3xl">
          {/* TITLE */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Icon name="Factory" size={16} /> Экскурсии
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold md:text-5xl">
              {c.h1}
            </h1>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-10 rounded-2xl border border-border bg-card p-7 md:p-10">
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              {(c.description || '').split('\n').filter(Boolean).map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p className="flex items-center gap-2 font-medium text-foreground">
                <Icon name="Clock" size={18} className="shrink-0 text-primary" />
                {c.durationNote}
              </p>
            </div>
          </div>

          {/* VIDEO */}
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
              <Icon name="Video" size={22} className="text-primary" /> Видео с экскурсии
            </h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border">
              <video
                controls
                preload="none"
                poster={EXCURSION_VIDEO_POSTER}
                className="block w-full"
              >
                <source src={EXCURSION_VIDEO} type="video/mp4" />
              </video>
            </div>
          </div>

          {/* PRICE */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon name="User" size={20} />
                </span>
                <p className="font-medium text-foreground">Взрослый билет</p>
              </div>
              <p className="mt-4 font-display text-3xl font-semibold text-primary">{c.priceAdult}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon name="Baby" size={20} />
                </span>
                <p className="font-medium text-foreground">Детский билет</p>
              </div>
              <p className="mt-4 font-display text-3xl font-semibold text-primary">{c.priceKid}</p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border/60 bg-secondary/40 p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="Star" size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Возрастные ограничения</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {c.ageNote}
              </p>
            </div>
          </div>

          {/* BOOKING */}
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/15 p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/30 text-primary">
              <Icon name="Phone" size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Запись на экскурсию</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Запись и вся информация по телефону{' '}
                <a href={`tel:${(c.phone || '').replace(/[^\d+]/g, '')}`} className="font-medium text-foreground hover:text-primary">
                  {c.phone}
                </a>
                .
              </p>
            </div>
          </div>

          {/* WARNING */}
          <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <p className="flex gap-2 text-sm font-medium text-foreground">
              <Icon name="TriangleAlert" size={16} className="mt-0.5 shrink-0 text-primary" />
              {c.cancelWarning}
            </p>
          </div>

          {/* ADDRESS */}
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border/60 bg-secondary/40 p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="MapPin" size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Адрес проведения экскурсий</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {c.address}
              </p>
            </div>
          </div>

          {/* GALLERY */}
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
              <Icon name="Images" size={22} className="text-primary" /> Фотографии с производства
            </h2>
            <div className="mt-4">
              <ReviewsGallery images={EXCURSION_GALLERY} />
            </div>
          </div>

          {/* MAP */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-border">
            <iframe
              src="https://yandex.ru/map-widget/v1/?mode=search&text=%D0%A1%D1%83%D0%B7%D0%B4%D0%B0%D0%BB%D1%8C%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%92%D0%B0%D1%81%D0%B8%D0%BB%D1%8C%D0%B5%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%2C%2041%D0%B0&z=16"
              width="100%"
              height="380"
              frameBorder="0"
              allowFullScreen
              title="Карта — Дымов Керамика, Суздаль, ул. Васильевская, 41а"
              className="block w-full"
            />
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default SuzdalExcursions;