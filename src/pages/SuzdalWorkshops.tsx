import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { usePageMeta } from '@/hooks/usePageMeta';
import { openBooking } from '@/lib/booking';
import { Button } from '@/components/ui/button';

const WORKSHOPS = [
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/f1276934-81b2-4761-a942-5591d7f8e338.jpg',
    title: 'Гончарное ремесло',
    desc: 'Вы познакомитесь с глиной, инструментом и основными приёмами работы с ними.',
    href: '/suzdal/workshops/goncharnoe-remeslo',
  },
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/a105ba85-0ace-4ad3-ab39-4441a2d4bcc6.jpg',
    title: 'Гончарное ремесло и роспись ангобами',
    desc: 'На мастер-классе вы изготовите изделие своими руками и распишите его ангобами.',
    href: '/suzdal/workshops/goncharnoe-remeslo-rospis-angobami',
  },
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/3ebbf82b-af86-48c7-bd4b-568d71bea10f.jpg',
    title: 'Роспись керамических тарелок',
    desc: 'Хотите попробовать себя в роли художника и творца прекрасного?',
    href: '/suzdal/workshops/rospis-keramicheskix-tarelok',
  },
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/2509f970-e5ac-4b63-be09-6600e954392d.jpg',
    title: 'Изготовление изразцов',
    desc: 'На мастер-классе вы сможете изготовить изразец своими руками.',
    href: '/suzdal/workshops/izgotovlenie-izrazcov',
  },
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/5ed56727-04b1-4e8e-a4e7-56712723a813.jpg',
    title: 'Изготовление изразцов и роспись ангобами',
    desc: 'На мастер-классе вы изготовите изразец своими руками и распишите его ангобами.',
    href: '/suzdal/workshops/izgotovlenie-izrazczov-rospis-angobami',
  },
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/2f872373-81e5-4152-a08e-1006706e22d2.jpg',
    title: 'Кружевная керамика',
    desc: 'Изготовление керамической кружевной тарелки своими руками.',
    href: '/suzdal/workshops/kruzhevnaya-keramika',
  },
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/2fa9a608-118d-44b1-a594-cf35b732aa30.jpg',
    title: 'Лепка керамических изделий',
    desc: 'Глина благодарный материал — она пластична, податлива, послушна человеческим рукам.',
    href: '/suzdal/workshops/lepka-keramicheskih',
  },
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/d946944f-b0dc-4ba0-b8ec-109ca1a37e1c.jpg',
    title: 'Кружевная керамика с росписью',
    desc: 'Изготовление керамической кружевной тарелки своими руками.',
  },
  {
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/e92d28ed-ca0f-4410-9e1c-798d9d2f5976.jpg',
    title: 'Лепка керамических изделий с росписью',
    desc: 'Глина благодарный материал — она пластична, податлива, послушна человеческим рукам.',
  },
];

const SuzdalWorkshops = () => {
  usePageMeta({
    title: 'Мастер-классы по керамике в Суздале | «Дымов Керамика»',
    description:
      'Мастер-классы по гончарному делу, лепке и росписи керамики на фабрике «Дымов Керамика» в Суздале. Занятия для детей и взрослых.',
  });

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader active="/suzdal/workshops" />

      {/* HERO */}
      <section className="container py-14 md:py-20">
        <div className="animate-fade-in text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="Sparkles" size={16} /> Мастер-классы в Суздале
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] md:text-6xl">
            Выберите, что хотите <span className="text-primary italic">создавать</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Гончарное ремесло, лепка и роспись керамики на фабрике «Дымов Керамика» в Суздале.
          </p>
        </div>
      </section>

      {/* CARDS */}
      <section className="container pb-20">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WORKSHOPS.map((w, i) => {
            const cardClass =
              'group animate-fade-in overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl';
            const cardContent = (
              <>
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={w.img}
                    alt={w.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-display text-xl font-semibold leading-tight">{w.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
                  {w.href && (
                    <span className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary">
                      Подробнее <Icon name="ArrowRight" size={15} />
                    </span>
                  )}
                </div>
              </>
            );

            return w.href ? (
              <Link
                key={w.title}
                to={w.href}
                className={cardClass}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {cardContent}
              </Link>
            ) : (
              <div key={w.title} className={cardClass} style={{ animationDelay: `${i * 60}ms` }}>
                {cardContent}
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-[2rem] bg-primary px-8 py-12 text-center text-primary-foreground md:px-16">
          <h3 className="font-display text-3xl font-semibold md:text-4xl">
            Не знаете, что выбрать?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Запишитесь на мастер-класс — подберём формат под ваш возраст и компанию.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={openBooking}
            className="mt-7 rounded-full px-8 text-base"
          >
            <Icon name="CalendarCheck" size={18} className="mr-2" /> Записаться
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default SuzdalWorkshops;