import Icon from '@/components/ui/icon';
import { TableHead } from '@/components/ui/table';
import { SortConfig } from '@/hooks/useSortableData';

interface Props<K extends string> {
  label: string;
  sortKey: K;
  sort: SortConfig<K>;
  onSort: (key: K) => void;
  className?: string;
}

/** Заголовок столбца таблицы админки с кликабельной сортировкой (стрелка вверх/вниз). */
function SortableTableHead<K extends string>({ label, sortKey, sort, onSort, className }: Props<K>) {
  const active = sort.key === sortKey;
  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`flex items-center gap-1 whitespace-nowrap transition-colors hover:text-foreground ${
          active ? 'text-foreground' : ''
        }`}
      >
        {label}
        <Icon
          name={active && sort.direction === 'desc' ? 'ArrowDown' : active ? 'ArrowUp' : 'ArrowUpDown'}
          size={13}
          className={active ? 'text-primary' : 'text-muted-foreground/50'}
        />
      </button>
    </TableHead>
  );
}

export default SortableTableHead;
