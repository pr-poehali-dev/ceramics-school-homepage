import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { usePageMeta } from '@/hooks/usePageMeta';
import { usePageContent } from '@/hooks/usePageContent';

const Contacts = () => {
  const content = usePageContent('moscow-contacts');
  usePageMeta({
    title: content.metaTitle,
    description: content.metaDescription,
  });
  const addressLines = content.address ? content.address.split(',').map((s) => s.trim()) : ['г. Москва, проспект Мира,', 'д. 119, стр. 186'];
  const workHoursLines = content.workHours ? content.workHours.split(',').map((s) => s.trim()) : ['Пн – Вс', '11:00 – 20:00'];
  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader active="/moscow/contacts" />

      <div className="container py-12 md:py-16">
        {/* HERO */}
        <div className="animate-fade-in text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="MapPin" size={16} /> Контакты
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-tight md:text-6xl">
            Мы на <span className="text-primary italic">{content.h1}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            {content.subtitle}
          </p>
        </div>

        {/* CONTACT CARDS */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {[
            {
              icon: 'Phone',
              label: 'Телефон',
              lines: [content.phone || '+7 (985) 419-89-03'],
              href: `tel:${(content.phone || '+79854198903').replace(/[^\d+]/g, '')}`,
            },
            {
              icon: 'Mail',
              label: 'E-mail',
              lines: [content.email || 'hello@dymovceramic.ru'],
              href: `mailto:${content.email || 'hello@dymovceramic.ru'}`,
            },
            {
              icon: 'MapPin',
              label: 'Адрес',
              lines: addressLines,
              href: 'https://yandex.ru/maps/?text=Москва, проспект Мира, 119с186',
            },
            {
              icon: 'Clock',
              label: 'График работы',
              lines: workHoursLines,
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

        {/* MAP + HOW TO FIND */}
        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-border">
          {/* Yandex map embed */}
          <iframe
            src={content.mapEmbedUrl}
            width="100%"
            height="380"
            frameBorder="0"
            allowFullScreen
            title="Карта — Дымов Керамика, проспект Мира 119 стр 186"
            className="block w-full"
          />
        </div>

        {/* HOW TO GET THERE */}
        <div className="mx-auto mt-8 max-w-4xl grid gap-6 md:grid-cols-2">
          {/* By car */}
          <div className="rounded-2xl border border-border bg-card p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name="Car" size={22} />
              </span>
              <h2 className="font-display text-2xl font-semibold">На машине</h2>
            </div>
            <div className="mt-5 space-y-4 text-sm text-muted-foreground leading-relaxed">
              <div>
                <p className="font-semibold text-foreground mb-1">{content.carEntranceTitle}</p>
                <p>{content.carEntranceText}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">{content.carExitTitle}</p>
                <p>{content.carExitText}</p>
              </div>
            </div>
          </div>

          {/* By public transport */}
          <div className="rounded-2xl border border-border bg-card p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name="Bus" size={22} />
              </span>
              <h2 className="font-display text-2xl font-semibold">На транспорте</h2>
            </div>
            <div className="mt-5 space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>{content.busRouteText}</p>
              <div className="space-y-2">
                <p>{content.busToOneText}</p>
                <p>{content.busToTwoText}</p>
              </div>
              <div className="flex gap-4 rounded-xl bg-muted/50 px-4 py-3">
                <div>
                  <p className="text-xs text-muted-foreground">Первый автобус</p>
                  <p className="font-semibold text-foreground">{content.busFirstTime}</p>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <p className="text-xs text-muted-foreground">Последний автобус</p>
                  <p className="font-semibold text-foreground">{content.busLastTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SOCIALS */}
        <div className="mx-auto mt-8 max-w-4xl flex flex-wrap gap-4">
          <a
            href={content.vkUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-5 font-medium transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
          >
            <Icon name="Users" size={20} className="text-primary" />
            ВКонтакте
          </a>
          <a
            href={content.telegramUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-5 font-medium transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
          >
            <Icon name="Send" size={20} className="text-primary" />
            Telegram
          </a>
        </div>

        {/* REQUISITES */}
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border bg-card p-7">
          <h2 className="font-display text-2xl font-semibold">Реквизиты</h2>
          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            {[
              { label: 'Организация', value: 'ООО «ТД Дымов Керамика»' },
              { label: 'Юридический адрес', value: '121609, г. Москва, ул. Крылатская, 37' },
              { label: 'ИНН', value: '7731377855' },
              { label: 'КПП', value: '773101001' },
              { label: 'ОГРН', value: '1177746793432' },
            ].map((r) => (
              <div key={r.label} className="flex flex-col gap-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{r.label}</p>
                <p className="font-medium">{r.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
};

export default Contacts;