import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { openBooking } from '@/lib/booking';
import { usePageMeta } from '@/hooks/usePageMeta';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/c6f10822-9087-43b5-af4a-0d27b8ec6a9b.jpg';

const Suzdal = () => {
  usePageMeta({
    title: 'Фабрика и школа керамики в Суздале «Дымов Керамика»',
    description:
      'Гончарная мастерская в Суздале ждет в гости детей и взрослых! Мастер-классы на гончарном круге, ручной лепке и росписи. Экскурсии.',
  });
  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <img
          src={HERO_IMG}
          alt="Фабрика и школа керамики в Суздале"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

        <div className="container relative flex min-h-[75vh] items-center py-20 md:min-h-[85vh]">
          <div className="max-w-2xl animate-fade-in text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              <Icon name="MapPin" size={16} /> Фабрика и школа керамики в Суздале
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] md:text-7xl">
              Создайте изделие из&nbsp;глины <span className="text-primary-foreground italic underline decoration-primary decoration-4 underline-offset-8">своими руками</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-white/85">
              Тёплая атмосфера мастерской в самом сердце Суздаля, опытные
              преподаватели и настоящая радость творчества. Для взрослых и детей.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" onClick={openBooking} className="rounded-full px-8 text-base">
                <Icon name="CalendarCheck" size={18} className="mr-2" /> Записаться
              </Button>
              <Link to="/suzdal/certificates">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/40 bg-white/10 px-8 text-base text-white backdrop-blur hover:bg-white hover:text-foreground"
                >
                  <Icon name="Gift" size={18} className="mr-2" /> Подарить сертификат
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Suzdal;