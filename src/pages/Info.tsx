import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { usePageMeta } from '@/hooks/usePageMeta';

const SECTIONS = [
  { id: 'delivery', label: 'Доставка', icon: 'Truck' },
  { id: 'pickup', label: 'Условия выдачи изделия', icon: 'PackageCheck' },
];

const Info = () => {
  usePageMeta({
    title: 'Информация о доставке и выдаче изделий | Дымов Керамика',
    description:
      'Информация о доставке готовых изделий по Москве и условиях выдачи керамики после мастер-класса в студии «Дымов Керамика» на ВДНХ. Стоимость доставки от 400 ₽. Все подробности по телефону +7 (985) 419-89-03.',
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
              <Icon name="Info" size={16} /> Информация
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold md:text-5xl">
              Полезная <span className="text-primary italic">информация</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
              Доставка готовых изделий и условия их выдачи после мастер-класса.
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
                В нашей школе есть услуга курьерской доставки готовых изделий по Москве. Услуга
                платная.
              </p>
              <p>
                Стоимость доставки — <span className="font-semibold text-foreground">от 400 ₽</span> и
                зависит от адреса, по которому будет доставлена ваша посылка.
              </p>
              <p>
                Все подробности можно уточнить по номеру{' '}
                <a href="tel:+79854198903" className="font-semibold text-primary hover:underline">
                  +7 (985) 419-89-03
                </a>
                .
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
              <p>Вы прошли мастер-класс в Школе керамики на ВДНХ. Для уточнения статуса готовности изделия вам нужно:</p>

              <ol className="space-y-3">
                {[
                  'Подписать изделие либо поставить дату проведения мастер-класса.',
                  'Сделать фото своей работы.',
                  'Через 15 дней прислать фото на WhatsApp на номер 8 (985) 419-89-03.',
                  'Подписаться на нашу страницу в Instagram @dymovceramicschool — в актуальных историях можно посмотреть изделия после глазурного обжига.',
                ].map((step, i) => (
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
                    Готовое изделие можно забрать через 15 дней по адресу:{' '}
                    <span className="font-medium text-foreground">
                      ВДНХ, проспект Мира, 119, строение 186
                    </span>
                    . Ежедневно с 11:00 до 20:00. Телефон:{' '}
                    <a href="tel:+79854198903" className="font-semibold text-primary hover:underline">
                      8 (985) 419-89-03
                    </a>
                    .
                  </span>
                </p>
              </div>

              <p className="flex gap-2">
                <Icon name="Camera" size={16} className="mt-0.5 shrink-0 text-primary" />
                Изделие выдаётся по фотографии.
              </p>
              <p className="flex gap-2">
                <Icon name="Clock" size={16} className="mt-0.5 shrink-0 text-primary" />
                Мы бережно храним ваши изделия в течение 2 месяцев с даты проведения мастер-класса.
              </p>

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <p className="flex gap-2 font-medium text-foreground">
                  <Icon name="TriangleAlert" size={16} className="mt-0.5 shrink-0 text-primary" />
                  Обращаем ваше внимание! Въезд на территорию ВДНХ платный. С условиями въезда и
                  парковки можно ознакомиться на сайте ВДНХ.
                </p>
              </div>

              <p className="text-xs">
                По истечении срока хранения мы оставляем за собой право утилизировать изделия либо
                передать их на благотворительную ярмарку.
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