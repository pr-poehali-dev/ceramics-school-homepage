import { useLocation, useSearchParams } from 'react-router-dom';
import { City } from '@/lib/cities';

/** Определяет текущий город по адресу страницы (/moscow или /suzdal). Для страниц без
 * городского префикса (например /tracking) — по query-параметру ?city=suzdal, чтобы шапка,
 * подвал и переключатель города не «перескакивали» на Москву при переходе с сайта Суздаля. */
export const useCity = (): City => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  if (pathname.startsWith('/suzdal')) return 'suzdal';
  if (pathname.startsWith('/moscow')) return 'moscow';
  return searchParams.get('city') === 'suzdal' ? 'suzdal' : 'moscow';
};

export default useCity;