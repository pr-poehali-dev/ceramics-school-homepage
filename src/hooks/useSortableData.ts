import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig<K extends string> {
  key: K | null;
  direction: SortDirection;
}

/**
 * Хук для сортировки массива данных по клику на столбец таблицы в админке.
 * getValue должен вернуть примитив (строка/число/дата в мс) для сравнения по ключу key.
 * Повторный клик по тому же столбцу переключает направление, клик по новому — сбрасывает на 'asc'.
 */
export function useSortableData<T, K extends string>(
  data: T[],
  getValue: (item: T, key: K) => string | number,
) {
  const [sort, setSort] = useState<SortConfig<K>>({ key: null, direction: 'asc' });

  const sorted = useMemo(() => {
    if (!sort.key) return data;
    const key = sort.key;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => {
      const va = getValue(a, key);
      const vb = getValue(b, key);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, sort]);

  const toggleSort = (key: K) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    );
  };

  return { sorted, sort, toggleSort };
}
