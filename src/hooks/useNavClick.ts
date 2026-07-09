import { MouseEvent } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Возвращает обработчик клика для навигационных ссылок.
 * Если пользователь уже на целевой странице — отменяет переход
 * и плавно поднимает страницу к верхней границе.
 */
export const useNavClick = () => {
  const location = useLocation();

  return (to: string) => (e: MouseEvent) => {
    if (location.pathname === to) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
};
