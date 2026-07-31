import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shipment, fmtDate, SUZDAL_STATUS_LABEL } from './shipmentTypes';
import { SortConfig } from '@/hooks/useSortableData';

type SortKey = 'trackingNumber' | 'customerName' | 'deliveredAt' | 'returnAt';

interface Props {
  view: 'active' | 'closed' | 'all';
  setView: (v: 'active' | 'closed' | 'all') => void;
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
  onSendToVdnhTarget?: (s: Shipment) => void;
  onPhotoPreview?: (url: string) => void;
  PER_PAGE: number;
  sort: SortConfig<SortKey>;
  onSort: (key: SortKey) => void;
}

const SortHeader = ({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  sort: SortConfig<SortKey>;
  onSort: (key: SortKey) => void;
}) => {
  const active = sort.key === sortKey;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={`flex items-center gap-1 text-left transition-colors hover:text-foreground ${
        active ? 'text-foreground' : ''
      }`}
    >
      {label}
      <Icon
        name={active && sort.direction === 'desc' ? 'ArrowDown' : active ? 'ArrowUp' : 'ArrowUpDown'}
        size={12}
        className={active ? 'text-primary' : 'text-muted-foreground/50'}
      />
    </button>
  );
};

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
  onSendToVdnhTarget,
  onPhotoPreview,
  PER_PAGE,
  sort,
  onSort,
}: Props) => {
  const isSuzdalView = role === 'suzdal';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {role === 'vdnh' ? (
          <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            <button
              onClick={() => setView('active')}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                view === 'active' ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'
              }`}
            >
              Активные
            </button>
            <button
              onClick={() => setView('closed')}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                view === 'closed' ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'
              }`}
            >
              Закрытые
            </button>
          </div>
        ) : (
          <div />
        )}

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
      ) : isSuzdalView ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-border">
          <div className="hidden grid-cols-[64px_130px_1fr_1fr_120px_150px_150px] gap-3 border-b border-border bg-secondary/40 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid">
            <span>Фото</span>
            <SortHeader label="№ заявки" sortKey="trackingNumber" sort={sort} onSort={onSort} />
            <SortHeader label="Клиент" sortKey="customerName" sort={sort} onSort={onSort} />
            <span>Контакты</span>
            <span>Заявка создана</span>
            <span>Статус</span>
            <span>Действие</span>
          </div>

          {paginated.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">Заявок не найдено.</p>
          )}

          {paginated.map((s) => {
            const statusInfo = SUZDAL_STATUS_LABEL[s.status] || { label: s.status, className: 'text-muted-foreground' };
            return (
              <div
                key={s.id}
                className="grid grid-cols-1 gap-2 border-b border-border px-4 py-3 text-sm last:border-0 sm:grid-cols-[64px_130px_1fr_1fr_120px_150px_150px] sm:items-center sm:gap-3"
              >
                {s.photoUrl ? (
                  <button
                    type="button"
                    onClick={() => onPhotoPreview?.(s.photoUrl!)}
                    className="block h-12 w-12 overflow-hidden rounded-lg border border-border"
                  >
                    <img src={s.photoUrl} alt="Фото изделия" className="h-full w-full object-cover" />
                  </button>
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                    <Icon name="Image" size={16} />
                  </span>
                )}
                <span className="font-medium">№ {s.trackingNumber}</span>
                <span>{s.customerName}</span>
                <div className="text-muted-foreground">
                  <p>{s.customerPhone}</p>
                  <p className="truncate">{s.customerEmail || '—'}</p>
                </div>
                <span className="text-muted-foreground">{fmtDate(s.createdAt || null)}</span>
                <span className={statusInfo.className}>{statusInfo.label}</span>
                <span>
                  {s.status === 'in_progress' && onSendToVdnhTarget && (
                    <Button size="sm" className="w-fit rounded-full" onClick={() => onSendToVdnhTarget(s)}>
                      Отправить на ВДНХ
                    </Button>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-border">
          <div className="hidden grid-cols-[1fr_1fr_140px_160px_110px_110px_130px_110px] gap-3 border-b border-border bg-secondary/40 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid">
            <SortHeader label="Номер посылки" sortKey="trackingNumber" sort={sort} onSort={onSort} />
            <SortHeader label="ФИО клиента" sortKey="customerName" sort={sort} onSort={onSort} />
            <span>Телефон</span>
            <span>Email</span>
            <SortHeader label="Доставлено" sortKey="deliveredAt" sort={sort} onSort={onSort} />
            <SortHeader label="Возврат" sortKey="returnAt" sort={sort} onSort={onSort} />
            {view === 'closed' && <span>Статус</span>}
            {view === 'active' && <span>Действие</span>}
          </div>

          {paginated.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">Посылок не найдено.</p>
          )}

          {paginated.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-1 gap-2 border-b border-border px-4 py-3 text-sm last:border-0 sm:grid-cols-[1fr_1fr_140px_160px_110px_110px_130px_110px] sm:items-center sm:gap-3"
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
              {view === 'active' && (
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

      {/* PHOTO PREVIEW */}
      {onPhotoPreview && null}
    </div>
  );
};

export default ShipmentsTable;
