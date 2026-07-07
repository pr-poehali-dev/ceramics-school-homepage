import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import MobileMenu from '@/components/MobileMenu';
import Logo from '@/components/Logo';
import SocialLinks from '@/components/SocialLinks';

const NAV = [
  { label: 'Мастер-классы', to: '/workshops' },
  { label: 'Форматы', to: '/formats' },
  { label: 'Подарочные сертификаты', to: '/certificates' },
  { label: 'Контакты', to: '/contacts' },
];

const Contacts = () => {
  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/moscow" className="flex items-center">
            <Logo scale={false} />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  n.to === '/contacts' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-4 md:flex">
            <SocialLinks size={18} variant="solid" />
            <Button className="rounded-full">Записаться</Button>
          </div>
          <MobileMenu active="/contacts" />
        </div>
      </header>

      <div className="container py-12 md:py-16">
        {/* HERO */}
        <div className="animate-fade-in text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="MapPin" size={16} /> Контакты
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-tight md:text-6xl">
            Мы на <span className="text-primary italic">ВДНХ</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            Студия керамики в сердце ВДНХ. Приходите лепить — будем рады!
          </p>
        </div>

        {/* CONTACT CARDS */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: 'Phone',
              label: 'Телефон',
              lines: ['+7 (985) 419-89-03'],
              href: 'tel:+79854198903',
            },
            {
              icon: 'Mail',
              label: 'E-mail',
              lines: ['hello@dymovceramic.ru'],
              href: 'mailto:hello@dymovceramic.ru',
            },
            {
              icon: 'MapPin',
              label: 'Адрес',
              lines: ['г. Москва, проспект Мира,', 'д. 119, стр. 186'],
              href: 'https://yandex.ru/maps/?text=55.836,37.630',
            },
            {
              icon: 'Clock',
              label: 'График работы',
              lines: ['Пн – Вс', '11:00 – 20:00'],
              href: null,
            },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href ?? undefined}
              target={c.href?.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className={`group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg ${c.href ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon name={c.icon} size={22} />
              </span>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">{c.label}</p>
              {c.lines.map((l) => (
                <p key={l} className="mt-1 font-medium leading-snug">{l}</p>
              ))}
            </a>
          ))}
        </div>

        {/* MAP + HOW TO FIND */}
        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-border">
          {/* Yandex map embed */}
          <iframe
            src="https://yandex.ru/map-widget/v1/?ll=37.630491%2C55.836021&z=16&pt=37.630491,55.836021,pm2rdm&size=large"
            width="100%"
            height="380"
            frameBorder="0"
            allowFullScreen
            title="Карта — Дымов Керамика"
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
                <p className="font-semibold text-foreground mb-1">Въезд Лихоборский</p>
                <p>Со стороны Сельскохозяйственной улицы, после 21 дома. Далее через въезд, по прямой до перекрёстка с кольцевой дорогой — налево, строение 186.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Выезд Совхозный</p>
                <p>Со стороны Сельскохозяйственной улицы, после 19 дома. Далее через выезд, по прямой до перекрёстка с кольцевой дорогой — направо, строение 186.</p>
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
              <p>
                <span className="font-semibold text-foreground">Автобус №533</span> — «Метро ВДНХ» → «Метро Ботанический сад» по территории ВДНХ.
              </p>
              <div className="space-y-2">
                <p><span className="font-semibold text-foreground">→ к «Ботанический сад»:</span> остановка «Павильон № 57 — Исторический парк Россия — Моя история».</p>
                <p><span className="font-semibold text-foreground">→ к «ВДНХ»:</span> остановка «Городская ферма» или «Дворец бракосочетания».</p>
              </div>
              <div className="flex gap-4 rounded-xl bg-muted/50 px-4 py-3">
                <div>
                  <p className="text-xs text-muted-foreground">Первый автобус</p>
                  <p className="font-semibold text-foreground">07:00 от ВДНХ</p>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <p className="text-xs text-muted-foreground">Последний автобус</p>
                  <p className="font-semibold text-foreground">23:20 от Ботанического сада</p>
                </div>
              </div>
            </div>
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
      <footer className="mt-16 border-t border-border bg-secondary/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
          <Logo className="h-9" />
          <span className="flex items-center gap-2">
            <Icon name="MapPin" size={16} className="text-primary" /> ВДНХ, Москва
          </span>
          <span>© 2003–2026 «Дымов Керамика». Все права защищены.</span>
        </div>
      </footer>
    </div>
  );
};

export default Contacts;