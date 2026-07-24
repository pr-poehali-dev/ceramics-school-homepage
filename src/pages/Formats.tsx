import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { ALL_FORMATS, PEOPLE_OPTIONS } from './formats/formatsData';
import FormatsFilters from './formats/FormatsFilters';
import FormatsResults from './formats/FormatsResults';
import FormatsCta from './formats/FormatsCta';
import { usePageMeta } from '@/hooks/usePageMeta';
import { usePageContent } from '@/hooks/usePageContent';

const Formats = () => {
  const c = usePageContent('moscow-formats');
  usePageMeta({
    title: c.metaTitle,
    description: c.metaDescription,
  });
  const [searchParams] = useSearchParams();
  const openAction = searchParams.get('open');
  const showSlug = searchParams.get('show');
  const [ageFilter, setAgeFilter] = useState<string | null>(null);
  const [dayFilter, setDayFilter] = useState<string>('any');
  const [durationFilter, setDurationFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>('any');
  const [peopleFilter, setPeopleFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!showSlug) return;
    const format = ALL_FORMATS.find((f) => f.slug === showSlug);
    if (!format) return;
    setExpanded(format.title);
    const timer = setTimeout(() => {
      document
        .getElementById(`format-${showSlug}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
    return () => clearTimeout(timer);
  }, [showSlug]);

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
      <SiteHeader active="/moscow/formats" />

      <div className="container py-12 md:py-16">
        {/* PAGE TITLE */}
        <div className="animate-fade-in text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="LayoutGrid" size={16} /> Форматы занятий
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold md:text-6xl">
            {c.h1}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {c.subtitle}
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
          openAction={openAction}
        />

        {/* CTA */}
        <FormatsCta title={c.ctaTitle} text={c.ctaText} buttonText={c.ctaButtonText} />

        {/* SEO TEXT */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            {c.seoTitle}
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            <p>{c.seoIntro}</p>

            <h3 className="pt-4 font-display text-2xl font-semibold text-foreground">
              {c.seoWhoTitle}
            </h3>
            <p>{c.seoWhoText}</p>

            <h3 className="pt-4 font-display text-2xl font-semibold text-foreground">
              {c.seoFormatsTitle}
            </h3>
            <div className="space-y-4">
              {(c.seoFormatsList || '').split('\n').filter(Boolean).map((line) => {
                const [title, text] = line.split('|');
                return (
                  <div key={title}>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="mt-1">{text}</p>
                  </div>
                );
              })}
            </div>

            <h3 className="pt-4 font-display text-2xl font-semibold text-foreground">
              {c.seoHowTitle}
            </h3>
            <p>{c.seoHowText1}</p>
            <p>{c.seoHowText2}</p>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
};

export default Formats;