import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shipment, fmtDate } from './shipmentTypes';

interface Props {
  view: 'active' | 'closed';
  setView: (v: 'active' | 'closed') => void;
  role: 'vdnh' | 'suzdal';
  search: string;
  setSearch: (v: string) => void;
  setPage: (v: number) => void;
  exporting: boolean;
  onExport: () => void;
  filtered: Shipment[];
  loading: boolean;
  paginated: Shipment[];
  page: number;
  totalPages: number;
  onIssueTarget: (s: Shipment) => void;
  PER_PAGE: number;
}

const ShipmentsTable = ({
  view,
  setView,
  role,
  search,
  setSearch,
  setPage,
  exporting,
  onExport,
  filtered,
  loading,
  paginated,
  page,
  totalPages,
  onIssueTarget,
  PER_PAGE,
}: Props) => {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setView('active')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              view === 'active' ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'
            }`}
          >
            Активные
          </button>
          {role === 'vdnh' && (
            <button
              onClick={() => setView('closed')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                view === 'closed' ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'
              }`}
            >
              Закрытые
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Поиск по номеру, ФИО, телефону, email"
            className="h-9 w-64 rounded-full"
          />
          {role === 'vdnh' && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={onExport}
              disabled={exporting || filtered.length === 0}
            >
              <Icon name="Download" size={14} className="mr-1.5" />
              {exporting ? 'Экспорт…' : 'Экспорт CSV'}
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-border">
          <div className="hidden grid-cols-[1fr_1fr_140px_160px_110px_110px_130px_110px] gap-3 border-b border-border bg-secondary/40 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid">
            <span>Номер посылки</span>
            <span>ФИО клиента</span>
            <span>Телефон</span>
            <span>Email</span>
            <span>Доставлено</span>
            <span>Возврат</span>
            {view === 'closed' && <span>Статус</span>}
            {view === 'active' && role === 'vdnh' && <span>Действие</span>}
          </div>

          {paginated.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">Посылок не найдено.</p>
          )}

          {paginated.map((s) => (
            <div
              key={s.id}
              className={`grid grid-cols-1 gap-2 border-b border-border px-4 py-3 text-sm last:border-0 sm:grid-cols-[1fr_1fr_140px_160px_110px_110px_130px_110px] sm:items-center sm:gap-3 ${
                view === 'closed' && role !== 'vdnh' ? '' : ''
              }`}
            >
              <span className="font-medium">№ {s.trackingNumber}</span>
              <span>{s.customerName}</span>
              <span className="text-muted-foreground">{s.customerPhone}</span>
              <span className="text-muted-foreground">{s.customerEmail || '—'}</span>
              <span>{fmtDate(s.deliveredAt)}</span>
              <span>{fmtDate(s.returnAt)}</span>
              {view === 'closed' && (
                <span>
                  {s.status === 'returned' ? (
                    <span className="text-destructive">Возврат</span>
                  ) : (
                    `Выдано ${fmtDate(s.issuedAt)}`
                  )}
                </span>
              )}
              {view === 'active' && role === 'vdnh' && (
                <Button
                  size="sm"
                  className="w-fit rounded-full"
                  onClick={() => onIssueTarget(s)}
                >
                  Выдать
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {filtered.length > PER_PAGE && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            <Icon name="ChevronLeft" size={15} />
          </Button>
          <span className="px-3 text-sm text-muted-foreground">
            Страница {page} из {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >
            <Icon name="ChevronRight" size={15} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShipmentsTable;
