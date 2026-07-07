import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import MobileMenu from '@/components/MobileMenu';
import Logo from '@/components/Logo';
import SocialLinks from '@/components/SocialLinks';
import DesktopNav from '@/components/DesktopNav';

const FORMATS = [
  {
    icon: 'Landmark',
    title: 'Классический',
    tags: ['В студии', '1 час', '1–20 чел', '2 900 ₽', '3+'],
    note: null as null | string,
    cta: { label: 'Записаться', variant: 'default' as const },
  },
  {
    icon: 'Baby',
    title: 'Детская группа (сб/вс 11:00)',
    tags: ['В студии', '1 час', '1–20 чел', '1 900 ₽', '3–10 лет'],
    note: '+ роспись через 2 недели',
    cta: { label: 'Записаться', variant: 'default' as const },
  },
  {
    icon: 'Rocket',
    title: 'Промо-группа (пн–пт)',
    tags: ['В студии', '1 час', '10–12 чел', '2 000 ₽', '7+'],
    note: 'Лепка + круг + роспись за одно занятие',
    cta: { label: 'Записаться', variant: 'default' as const },
  },
  {
    icon: 'Truck',
    title: 'Выездной МК',
    tags: ['Приедем к вам', 'от 30 мин', '1–100 чел', 'договорная'],
    note: null,
    cta: { label: 'Рассчитать', variant: 'outline' as const },
  },
  {
    icon: 'UtensilsCrossed',
    title: 'Курс «Блюдо» (2 занятия)',
    tags: ['6,5 ч', '1–3 чел', '5 000–9 000 ₽', '12+'],
    note: '15 видов блюд на выбор',
    cta: { label: 'Записаться', variant: 'default' as const },
  },
  {
    icon: 'PartyPopper',
    title: 'В составе мероприятия',
    tags: ['ДР, корпоратив, тимбилдинг, девичник', 'Индивидуальный расчёт'],
    note: null,
    cta: { label: 'Подробнее', variant: 'outline' as const },
  },
];

const Workshop = () => {
  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/moscow" className="flex items-center">
            <Logo scale={false} />
          </Link>
          <DesktopNav active="/workshops" />
          <a
            href="tel:+79854198903"
            className="hidden items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary md:flex"
          >
            <Icon name="Phone" size={18} className="text-primary" /> +7 (985) 419-89-03
          </a>
          <MobileMenu active="/workshops" />
        </div>
      </header>

      <div className="container py-10 md:py-14">
        {/* BACK */}
        <Link
          to="/workshops"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <Icon name="ArrowLeft" size={16} /> Назад к услугам
        </Link>

        {/* HERO */}
        <div className="mt-8 animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="Hand" size={16} /> Мастер-класс
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-tight md:text-6xl">
            Лепка из глины
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground">
            Создайте изделие руками: от фигурки до посуды.<br />
            Под руководством мастера за 1 час.
          </p>

          {/* QUICK STATS */}
          <div className="mt-8 flex flex-wrap gap-4">
            {[
              { icon: 'Users', text: '1–20 человек' },
              { icon: 'Clock', text: '1 час' },
              { icon: 'Tag', text: 'от 1 900 ₽' },
              { icon: 'Star', text: 'Возраст 3+' },
            ].map((s) => (
              <span
                key={s.text}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
              >
                <Icon name={s.icon} size={16} className="text-primary" />
                {s.text}
              </span>
            ))}
          </div>

          {/* DESCRIPTION */}
          <div className="mt-10 max-w-2xl rounded-2xl border border-border bg-card p-7">
            <h2 className="font-display text-2xl font-semibold">О мастер-классе</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              На занятии по лепке вы создадите уникальное изделие из настоящей
              глины — кружку, тарелку, вазу, фигурку или всё, что придёт
              в голову. Мастер покажет основные техники: жгутовую лепку,
              пластовую, скульптурную. Не нужно никаких навыков — только
              желание творить.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              После занятия изделие обжигается в печи (2–3 недели), затем вы
              возвращаетесь на роспись — либо самостоятельно, либо мастер
              распишет за вас. Готовое изделие выдаётся примерно через месяц.
            </p>
          </div>

          <Button size="lg" className="mt-7 rounded-full px-10 text-base">
            <Icon name="CalendarCheck" size={18} className="mr-2" /> Записаться
          </Button>
        </div>

        {/* DIVIDER */}
        <div className="mt-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Выберите формат</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* FORMATS */}
        <div className="mt-8 space-y-5">
          {FORMATS.map((f, i) => (
            <div
              key={f.title}
              className="group animate-fade-in rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg md:p-7"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon name={f.icon} size={26} />
                </span>

                <div className="flex-1">
                  <h3 className="font-display text-2xl font-semibold">{f.title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                    {f.tags.map((t) => (
                      <span key={t} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-primary/50" />
                        {t}
                      </span>
                    ))}
                  </div>
                  {f.note && (
                    <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-primary">
                      <Icon name="Info" size={13} /> {f.note}
                    </p>
                  )}
                </div>

                <Button
                  variant={f.cta.variant}
                  className="shrink-0 rounded-full px-6"
                >
                  {f.cta.label}
                  <Icon name="ArrowRight" size={15} className="ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA BANNER */}
        <div className="relative mt-14 overflow-hidden rounded-[2rem] bg-primary px-8 py-12 text-center text-primary-foreground md:px-16">
          <Icon
            name="Hand"
            size={200}
            className="pointer-events-none absolute -left-8 -top-8 opacity-10"
          />
          <div className="relative">
            <h3 className="font-display text-3xl font-semibold md:text-4xl">
              Остались вопросы?
            </h3>
            <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
              Поможем выбрать подходящий формат, уточним расписание и ответим
              на любые вопросы.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                <Icon name="Phone" size={18} className="mr-2" /> Позвонить
              </Button>
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                <Icon name="Send" size={18} className="mr-2" /> Написать
              </Button>
            </div>
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
          <a href="tel:+79854198903" className="flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary">
            <Icon name="Phone" size={16} className="text-primary" /> +7 (985) 419-89-03
          </a>
          <SocialLinks size={18} variant="solid" />
          <span>© 2026 Все права защищены</span>
        </div>
      </footer>
    </div>
  );
};

export default Workshop;