import { useLocation } from 'react-router-dom';
import { City } from '@/lib/cities';

/** Определяет текущий город по адресу страницы (/moscow или /suzdal). */
export const useCity = (): City => {
  const { pathname } = useLocation();
  return pathname.startsWith('/suzdal') ? 'suzdal' : 'moscow';
};

export default useCity;
