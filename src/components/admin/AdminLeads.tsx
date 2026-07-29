import Icon from '@/components/ui/icon';
import { Lead, fmtDate } from './adminHelpers';
import { SortConfig } from '@/hooks/useSortableData';

type LeadSortKey = 'service' | 'created_at' | 'people';

interface Props {
  leads: Lead[];
  sort: SortConfig<LeadSortKey>;
  onSort: (key: LeadSortKey) => void;
}

const SORT_OPTIONS: { key: LeadSortKey; label: string }[] = [
  { key: 'created_at', label: 'Дате' },
  { key: 'service', label: 'Услуге' },
  { key: 'people', label: 'Участникам' },
];

const AdminLeads = ({ leads, sort, onSort }: Props) => {
  return (
    <div className="mt-6 space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        Сортировать по:
        {SORT_OPTIONS.map((opt) => {
          const active = sort.key === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onSort(opt.key)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                active ? 'bg-primary/10 text-primary' : 'bg-secondary hover:text-foreground'
              }`}
            >
              {opt.label}
              {active && (
                <Icon name={sort.direction === 'desc' ? 'ArrowDown' : 'ArrowUp'} size={12} />
              )}
            </button>
          );
        })}
      </div>

      {leads.length === 0 && (
        <p className="text-sm text-muted-foreground">Заявок пока нет.</p>
      )}
      {leads.map((l) => (
        <div key={l.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium">{l.service || 'Заявка'}</span>
            <span className="text-sm text-muted-foreground">{fmtDate(l.created_at)}</span>
          </div>
          <div className="mt-2 grid gap-1 text-sm sm:grid-cols-3">
            {l.people != null && (
              <p><span className="text-muted-foreground">Участников:</span> {l.people}</p>
            )}
            <p><span className="text-muted-foreground">Телефон:</span> {l.phone}</p>
            <p><span className="text-muted-foreground">Email:</span> {l.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminLeads;