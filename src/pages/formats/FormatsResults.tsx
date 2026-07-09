import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import type { FormatItem } from './formatsData';
import FormatCtaButton from './FormatCtaButton';

interface FormatsResultsProps {
  results: FormatItem[];
  expanded: string | null;
  setExpanded: (v: string | null) => void;
  reset: () => void;
  openAction?: string | null;
}

const Dot = ({ text }: { text: string }) => (
  <span className="flex items-center gap-1.5">
    <span className="h-1 w-1 rounded-full bg-primary/40" />
    {text}
  </span>
);

const FormatsResults = ({ results, expanded, setExpanded, reset, openAction }: FormatsResultsProps) => {
  return (
    <div className="mx-auto mt-8 max-w-4xl space-y-5">
      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <Icon name="SearchX" size={40} className="mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium">Ничего не найдено</p>
          <p className="mt-1 text-sm text-muted-foreground">Попробуйте изменить фильтры</p>
          <Button variant="outline" className="mt-5 rounded-full" onClick={reset}>
            Сбросить фильтры
          </Button>
        </div>
      ) : (
        results.map((f, i) => (
          <div
            key={f.title}
            id={`format-${f.slug}`}
            className="group animate-fade-in scroll-mt-28 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg md:p-7"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="h-52 w-full shrink-0 overflow-hidden rounded-2xl md:h-44 md:w-64">
                <img
                  src={f.img}
                  alt={f.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col">
                <h3 className="font-display text-2xl font-semibold">{f.title}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <Dot text={f.place} />
                  <Dot text={f.duration} />
                  <Dot text={f.people + ' чел'} />
                  <Dot text={f.age} />
                  <Dot text={f.days} />
                </div>
                <p className="mt-3 text-base font-semibold text-primary">{f.price}</p>

                {f.desc && (
                  <>
                    <button
                      onClick={() => setExpanded(expanded === f.title ? null : f.title)}
                      className="mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      {expanded === f.title ? 'Скрыть описание' : 'Подробнее о формате'}
                      <Icon
                        name="ChevronDown"
                        size={15}
                        className={`transition-transform ${expanded === f.title ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expanded === f.title && (
                      <p className="mt-3 animate-fade-in text-sm leading-relaxed text-muted-foreground">
                        {f.desc}
                      </p>
                    )}
                  </>
                )}

                <FormatCtaButton
                  cta={f.cta}
                  autoOpen={
                    !!openAction && 'action' in f.cta && f.cta.action === openAction
                  }
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FormatsResults;