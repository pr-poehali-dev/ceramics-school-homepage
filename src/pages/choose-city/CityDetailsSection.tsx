import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { CITIES, MOSCOW_WORKSHOP_LINKS, SUZDAL_WORKSHOP_LINKS, type City } from '@/lib/cities';
import { useCustomWorkshops } from '@/hooks/useCustomWorkshops';

interface Props {
  city: City;
  badge: string;
  title: string;
  text: string;
  img: string;
  reviewsCount: number;
  reviewsAvg: string;
  workshopsCount: number;
  address: string;
  workHours: string;
  reversed?: boolean;
}

const CityDetailsSection = ({
  city,
  badge,
  title,
  text,
  img,
  reviewsCount,
  reviewsAvg,
  workshopsCount,
  address,
  workHours,
  reversed,
}: Props) => {
  const cityConfig = CITIES[city];
  const isSuzdal = city === 'suzdal';
  const workshopsHome = isSuzdal ? '/suzdal/workshops' : '/moscow/workshops';
  const baseWorkshopLinks = city === 'moscow' ? MOSCOW_WORKSHOP_LINKS : SUZDAL_WORKSHOP_LINKS;
  const customWorkshops = useCustomWorkshops(city);
  const workshopLinks = [
    ...baseWorkshopLinks,
    ...customWorkshops.map((w) => ({ label: w.label, to: `${workshopsHome}/${w.slug}` })),
  ].slice(0, 6);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
      <div
        className={`grid gap-0 lg:grid-cols-2 ${reversed ? 'lg:[&>*:first-child]:order-2' : ''}`}
      >
        {/* IMAGE */}
        <div className="relative min-h-[240px] overflow-hidden lg:min-h-full">
          <img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent lg:bg-gradient-to-r" />
          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            <Icon name="MapPin" size={13} className="text-primary" /> {badge}
          </span>
        </div>

        {/* CONTENT */}
        <div className="p-7 md:p-10">
          <h3 className="font-display text-3xl font-semibold leading-tight">{title}</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>

          {/* STATS */}
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium">
              <Icon name="Hammer" size={15} className="text-primary" /> {workshopsCount}{' '}
              {isSuzdal ? 'мастер-классов' : 'формата занятий'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium">
              <Icon name="Star" size={15} className="fill-amber-400 text-amber-400" /> {reviewsAvg} · {reviewsCount}+ отзывов
            </span>
          </div>

          {/* WORKSHOPS LIST */}
          <div className="mt-7">
            <p className="text-sm font-medium uppercase tracking-[0.1em] text-muted-foreground">
              Мастер-классы
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {workshopLinks.map((w) => (
                <Link
                  key={w.to}
                  to={w.to}
                  className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {w.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CONTACTS */}
          <div className="mt-7 grid gap-2.5 text-sm text-muted-foreground sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <Icon name="MapPin" size={15} className="shrink-0 text-primary" /> {address}
            </span>
            <span className="flex items-center gap-2">
              <Icon name="Clock" size={15} className="shrink-0 text-primary" /> {workHours}
            </span>
            <a
              href={cityConfig.phoneHref}
              className="flex items-center gap-2 font-medium text-foreground transition-colors hover:text-primary"
            >
              <Icon name="Phone" size={15} className="shrink-0 text-primary" /> {cityConfig.phone}
            </a>
          </div>

          {/* CTA */}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={cityConfig.path}>
              <Button className="rounded-full px-6">
                Перейти на страницу
                <Icon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </Link>
            <Link to={isSuzdal ? '/suzdal/contacts' : '/moscow/contacts'}>
              <Button variant="outline" className="rounded-full px-6">
                <Icon name="MapPin" size={16} className="mr-2" /> Контакты
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityDetailsSection;