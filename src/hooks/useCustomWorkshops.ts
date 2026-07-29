import { useEffect, useState } from 'react';
import func2url from '../../backend/func2url.json';

export interface CustomWorkshop {
  id: number;
  city: 'moscow' | 'suzdal';
  slug: string;
  label: string;
  badgeIcon: string;
  hidden: boolean;
  sortOrder: number;
  createdAt: string | null;
}

/**
 * Подгружает мастер-классы, добавленные вручную через админ-панель (сверх изначально
 * зашитых в код), отфильтрованные по городу. Используется в меню, подвале, на главной
 * и странице списка мастер-классов, чтобы новые записи сразу появлялись на сайте.
 */
export function useCustomWorkshops(city: 'moscow' | 'suzdal'): CustomWorkshop[] {
  const [workshops] = useCustomWorkshopsWithLoading(city);
  return workshops;
}

/**
 * То же самое, но также отдаёт признак loading — нужен на странице деталей мастер-класса,
 * чтобы не редиректить на список раньше времени, пока список кастомных МК ещё не загружен.
 */
export function useCustomWorkshopsWithLoading(
  city: 'moscow' | 'suzdal',
): [CustomWorkshop[], boolean] {
  const [workshops, setWorkshops] = useState<CustomWorkshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const resp = await fetch(func2url['custom-workshops']);
        if (!resp.ok) return;
        const data = await resp.json();
        if (!cancelled) {
          setWorkshops((data.workshops || []).filter((w: CustomWorkshop) => w.city === city));
        }
      } catch {
        // тихо остаёмся с пустым списком — сайт продолжает работать со статичными МК
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [city]);

  return [workshops, loading];
}

export default useCustomWorkshops;