import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { usePageMeta } from '@/hooks/usePageMeta';

const BANNER_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/6c567306-9774-4e90-ae66-a78ec8eb5977.png';

const SuzdalExcursions = () => {
  usePageMeta({
    title: 'Экскурсии на фабрику «Дымов Керамика» в Суздале',
    description:
      'Экскурсии по производству керамики «Дымов Керамика» в Суздале — полный цикл изготовления изделий от массозаготовки до росписи и упаковки. Запись по телефону +7 (915) 157-64-85.',
  });

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader active="/suzdal/excursions" />

      {/* HERO */}
      <section className="container py-8 md:py-12">
        <div className="animate-fade-in overflow-hidden rounded-[2rem] border border-border">
          <img
            src={BANNER_IMG}
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
              Экскурсии по производству <span className="text-primary italic">«Дымов Керамика»</span>
            </h1>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-10 rounded-2xl border border-border bg-card p-7 md:p-10">
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Мы приглашаем индивидуальные и организованные группы на экскурсию по фабрике
                «Дымов Керамика» в Суздале.
              </p>
              <p>
                Особый интерес у посетителей вызывает непосредственно процесс изготовления
                керамических изделий, который они могут наблюдать в цехах и познакомиться с
                основными этапами производства.
              </p>
              <p>
                Экскурсионная программа включает в себя посещение основных объектов предприятия,
                просмотр полного цикла процесса изготовления от участка массозаготовки до участка
                сортировки и упаковки, знакомство с особенностями производства и секретами
                технологии обработки глины, обжига, росписи и декорирования.
              </p>
              <p className="flex items-center gap-2 font-medium text-foreground">
                <Icon name="Clock" size={18} className="shrink-0 text-primary" />
                По времени программа занимает от 30 до 45 минут.
              </p>
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
              <p className="mt-4 font-display text-3xl font-semibold text-primary">1 000 ₽</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon name="Baby" size={20} />
                </span>
                <p className="font-medium text-foreground">Детский билет</p>
              </div>
              <p className="mt-4 font-display text-3xl font-semibold text-primary">600 ₽</p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border/60 bg-secondary/40 p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="Star" size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Возрастные ограничения</p>
              <p className="mt-1 text-sm text-muted-foreground">
                От 5 лет. Будет очень интересно и взрослым, и детям.
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
                <a href="tel:+79151576485" className="font-medium text-foreground hover:text-primary">
                  +7 (915) 157-64-85
                </a>
                .
              </p>
            </div>
          </div>

          {/* WARNING */}
          <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <p className="flex gap-2 text-sm font-medium text-foreground">
              <Icon name="TriangleAlert" size={16} className="mt-0.5 shrink-0 text-primary" />
              Обращаем ваше внимание на то, что при опоздании или отказе менее чем за 24 часа
              стоимость посещения не возвращается.
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
                Владимирская область, г. Суздаль, ул. Васильевская, 41а.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default SuzdalExcursions;
