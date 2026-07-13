import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { usePageMeta } from '@/hooks/usePageMeta';
import { openBooking } from '@/lib/booking';

const FACTORY_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/149adc21-4153-494c-a82b-0489b3754fe0.jpg';

const SuzdalAbout = () => {
  usePageMeta({
    title: 'О фабрике «Дымов Керамика» в Суздале',
    description:
      'История фабрики керамических изделий ручной работы «Дымов Керамика» в Суздале. С 2003 года производим авторскую керамику и учим гончарному делу в собственной школе.',
  });

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader active="/suzdal/about" />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src={FACTORY_IMG}
          alt="Фабрика «Дымов Керамика» в Суздале"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />

        <div className="container relative flex min-h-[45vh] flex-col justify-end py-14 text-white md:min-h-[55vh]">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <Icon name="Factory" size={16} /> С 2003 года в Суздале
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-tight md:text-6xl">
            О фабрике
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
              <h2 className="font-display text-2xl font-semibold md:text-3xl">Фабрика</h2>
            </div>
            <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Компания «Дымов Керамика» берёт своё начало в 2003 году в Суздале, где семья
                Дымовых основала фабрику по производству керамических изделий ручной работы.
              </p>
              <p>
                Наше производство — это сочетание традиционных методов ручной работы с
                материалами, современные технологии и авторское видение будущего русской керамики.
              </p>
              <p>
                С момента своего основания фабрика стремительно развивается, воплощая на практике
                новые творческие концепции. На сегодняшний день сформировалось целое культурное
                пространство, логическим продолжением которого стало основание школы керамики в
                Москве.
              </p>
            </div>
          </section>

          {/* SCHOOL */}
          <section className="mt-8 rounded-2xl border border-border bg-card p-7 md:p-10">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name="GraduationCap" size={24} />
              </span>
              <h2 className="font-display text-2xl font-semibold md:text-3xl">Школа</h2>
            </div>
            <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Сегодня керамику ручной работы можно не только приобрести, но и научиться делать
                её самому — для этого достаточно записаться на мастер-класс.
              </p>
              <p>
                Уютная мастерская, оборудованная всем необходимым инвентарём, готова принять в
                своих стенах всех интересующихся гончарным производством.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-4">
              <Button size="lg" onClick={openBooking} className="rounded-full px-8 text-base">
                <Icon name="CalendarCheck" size={18} className="mr-2" /> Записаться на мастер-класс
              </Button>
            </div>
          </section>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default SuzdalAbout;
