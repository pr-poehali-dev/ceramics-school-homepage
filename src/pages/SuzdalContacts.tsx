import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { usePageMeta } from '@/hooks/usePageMeta';

const SuzdalContacts = () => {
  usePageMeta({
    title: 'Контакты гончарной мастерской «Дымов Керамика» в Суздале',
    description:
      'Школа керамики и гончарного мастерства «Дымов Керамика», город Суздаль, улица Васильеская, дом 41а. График работы пн-вс с 9:00 до 18:00.',
  });

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader active="/suzdal/contacts" />

      <div className="container py-12 md:py-16">
        {/* HERO */}
        <div className="animate-fade-in text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="MapPin" size={16} /> Контакты
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-tight md:text-6xl">
            Мы в <span className="text-primary italic">Суздале</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            Фабрика и школа «Дымов Керамика». Приходите лепить — будем рады!
          </p>
        </div>

        {/* CONTACT CARDS */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {[
            {
              icon: 'Phone',
              label: 'Телефон',
              lines: ['+7 (915) 157-64-85'],
              href: 'tel:+79151576485',
            },
            {
              icon: 'Send',
              label: 'Телеграм',
              lines: ['Напишите нам в Телеграм'],
              href: 'https://t.me/dymovceramicschool',
            },
            {
              icon: 'Mail',
              label: 'E-mail',
              lines: ['mk@dymovceramicschool.ru'],
              href: 'mailto:mk@dymovceramicschool.ru',
            },
            {
              icon: 'MapPin',
              label: 'Адрес',
              lines: ['Владимирская область, г. Суздаль,', 'ул. Васильевская, 41а'],
              href: 'https://yandex.ru/maps/?text=Суздаль, улица Васильевская, 41а',
            },
            {
              icon: 'Clock',
              label: 'График работы',
              lines: ['Понедельник – Воскресенье', '9:00 – 18:00'],
              href: null,
            },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href ?? undefined}
              target={c.href?.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className={`group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg ${c.href ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon name={c.icon} size={22} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">{c.label}</p>
                {c.lines.map((l) => (
                  <p
                    key={l}
                    className="mt-0.5 text-[13px] font-medium leading-snug sm:text-[15px]"
                  >
                    {l}
                  </p>
                ))}
              </div>
            </a>
          ))}
        </div>

        {/* MAP */}
        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-border">
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

        {/* EXCURSIONS */}
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border bg-card p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon name="Factory" size={22} />
            </span>
            <h2 className="font-display text-2xl font-semibold">Экскурсии</h2>
          </div>
          <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p className="flex gap-2">
              <Icon name="TriangleAlert" size={16} className="mt-0.5 shrink-0 text-primary" />
              Внимание! Экскурсии проводятся по адресу: Владимирская область, г. Суздаль, ул.
              Васильевская, 41а.
            </p>
            <p>
              Запись и вся информация по телефону:{' '}
              <a href="tel:+79151576485" className="font-semibold text-primary hover:underline">
                +7 (915) 157-64-85
              </a>
              .
            </p>
          </div>
        </div>

        {/* SOCIALS */}
        <div className="mx-auto mt-8 max-w-4xl flex flex-wrap gap-4">
          <a
            href="https://vk.com/dymovceramicschool"
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-5 font-medium transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
          >
            <Icon name="Users" size={20} className="text-primary" />
            ВКонтакте
          </a>
          <a
            href="https://t.me/dymovceramicschool"
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-5 font-medium transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
          >
            <Icon name="Send" size={20} className="text-primary" />
            Telegram
          </a>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default SuzdalContacts;