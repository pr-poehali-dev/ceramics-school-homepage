import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import MobileMenu from '@/components/MobileMenu';
import Logo from '@/components/Logo';
import SocialLinks from '@/components/SocialLinks';
import ReviewLinks from '@/components/ReviewLinks';
import FooterLegal from '@/components/FooterLegal';
import DesktopNav from '@/components/DesktopNav';
import CartButton from '@/components/CartButton';
import { ALL_FORMATS, PEOPLE_OPTIONS } from './formats/formatsData';
import FormatsFilters from './formats/FormatsFilters';
import FormatsResults from './formats/FormatsResults';
import FormatsCta from './formats/FormatsCta';

const Formats = () => {
  const [ageFilter, setAgeFilter] = useState<string | null>(null);
  const [dayFilter, setDayFilter] = useState<string>('any');
  const [durationFilter, setDurationFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>('any');
  const [peopleFilter, setPeopleFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const reset = () => {
    setAgeFilter(null);
    setDayFilter('any');
    setDurationFilter(null);
    setLocationFilter('any');
    setPeopleFilter(null);
  };

  const results = useMemo(() => {
    return ALL_FORMATS.filter((f) => {
      if (ageFilter) {
        const minAge = parseInt(ageFilter);
        if (f.ageMin < minAge) return false;
      }
      if (dayFilter !== 'any' && f.daysKey !== dayFilter && f.daysKey !== 'any') return false;
      if (durationFilter && f.durationKey !== durationFilter) return false;
      if (locationFilter !== 'any' && f.location !== locationFilter && f.location !== 'both') return false;
      if (peopleFilter) {
        const opt = PEOPLE_OPTIONS.find((o) => o.value === peopleFilter);
        if (opt && (f.peopleMax < opt.min || f.peopleMin > opt.max)) return false;
      }
      return true;
    });
  }, [ageFilter, dayFilter, durationFilter, locationFilter, peopleFilter]);

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/moscow" className="flex items-center">
            <Logo scale={false} />
          </Link>
          <DesktopNav active="/formats" />
          <a
            href="tel:+79854198903"
            className="hidden items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary md:flex"
          >
            <Icon name="Phone" size={18} className="text-primary" /> +7 (985) 419-89-03
          </a>
          <div className="flex items-center gap-3">
            <CartButton />
            <MobileMenu active="/formats" />
          </div>
        </div>
      </header>

      <div className="container py-12 md:py-16">
        {/* PAGE TITLE */}
        <div className="animate-fade-in text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="LayoutGrid" size={16} /> Форматы занятий
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold md:text-6xl">
            Выберите подходящий <span className="text-primary italic">формат</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Фильтруйте по времени, возрасту и месту — найдите идеальный вариант для себя.
          </p>
        </div>

        {/* FILTERS */}
        <FormatsFilters
          ageFilter={ageFilter}
          setAgeFilter={setAgeFilter}
          dayFilter={dayFilter}
          setDayFilter={setDayFilter}
          durationFilter={durationFilter}
          setDurationFilter={setDurationFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          peopleFilter={peopleFilter}
          setPeopleFilter={setPeopleFilter}
          resultsCount={results.length}
          reset={reset}
        />

        {/* RESULTS */}
        <FormatsResults
          results={results}
          expanded={expanded}
          setExpanded={setExpanded}
          reset={reset}
        />

        {/* CTA */}
        <FormatsCta />
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
          <ReviewLinks />
          <SocialLinks size={18} variant="solid" />
          <FooterLegal />
        </div>
      </footer>
    </div>
  );
};

export default Formats;