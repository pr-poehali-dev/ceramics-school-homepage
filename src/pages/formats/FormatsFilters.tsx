import Icon from '@/components/ui/icon';
import {
  AGE_OPTIONS,
  DAY_OPTIONS,
  DURATION_OPTIONS,
  LOCATION_OPTIONS,
  PEOPLE_OPTIONS,
} from './formatsData';

interface FormatsFiltersProps {
  ageFilter: string | null;
  setAgeFilter: (v: string | null) => void;
  dayFilter: string;
  setDayFilter: (v: string) => void;
  durationFilter: string | null;
  setDurationFilter: (v: string | null) => void;
  locationFilter: string;
  setLocationFilter: (v: string) => void;
  peopleFilter: string | null;
  setPeopleFilter: (v: string | null) => void;
  resultsCount: number;
  reset: () => void;
}

const FormatsFilters = ({
  ageFilter,
  setAgeFilter,
  dayFilter,
  setDayFilter,
  durationFilter,
  setDurationFilter,
  locationFilter,
  setLocationFilter,
  peopleFilter,
  setPeopleFilter,
  resultsCount,
  reset,
}: FormatsFiltersProps) => {
  return (
    <div className="mx-auto mt-12 max-w-4xl animate-fade-in rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* AGE */}
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Icon name="User" size={15} /> Возраст
          </p>
          <div className="flex flex-wrap gap-2">
            {AGE_OPTIONS.map((a) => (
              <button
                key={a}
                onClick={() => setAgeFilter(ageFilter === a ? null : a)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  ageFilter === a
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* DAY */}
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Icon name="Calendar" size={15} /> День недели
          </p>
          <div className="flex flex-wrap gap-2">
            {DAY_OPTIONS.map((d) => (
              <button
                key={d.value}
                onClick={() => setDayFilter(d.value)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  dayFilter === d.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* DURATION */}
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Icon name="Clock" size={15} /> Длительность
          </p>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map((d) => (
              <button
                key={d.value}
                onClick={() => setDurationFilter(durationFilter === d.value ? null : d.value)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  durationFilter === d.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* LOCATION */}
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Icon name="MapPin" size={15} /> Место
          </p>
          <div className="flex flex-wrap gap-2">
            {LOCATION_OPTIONS.map((l) => (
              <button
                key={l.value}
                onClick={() => setLocationFilter(l.value)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  locationFilter === l.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* PEOPLE */}
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Icon name="Users" size={15} /> Количество человек
          </p>
          <div className="flex flex-wrap gap-2">
            {PEOPLE_OPTIONS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeopleFilter(peopleFilter === p.value ? null : p.value)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                  peopleFilter === p.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
        <span className="text-sm text-muted-foreground">
          Найдено: <span className="font-semibold text-foreground">{resultsCount}</span>
        </span>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <Icon name="RotateCcw" size={14} /> Сбросить
        </button>
      </div>
    </div>
  );
};

export default FormatsFilters;
