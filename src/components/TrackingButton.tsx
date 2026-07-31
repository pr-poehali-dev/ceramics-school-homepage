import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useCity } from '@/hooks/useCity';

/** Кнопка перехода на страницу отслеживания готовых изделий по номеру телефона.
 * Поиск (по умолчанию открывается вкладка «Найти») общий для обоих городов, но город
 * передаётся в ссылке, чтобы при переключении на вкладку «Добавить» сразу показывалась
 * версия формы для текущего города сайта, без ручного выбора. */
const TrackingButton = () => {
  const city = useCity();
  return (
    <Link
      to={`/tracking?city=${city}`}
      aria-label="Отследить готовое изделие"
      title="Отследить готовое изделие"
      className="hidden h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-primary hover:text-primary-foreground sm:flex"
    >
      <Icon name="PackageSearch" size={19} />
    </Link>
  );
};

export default TrackingButton;