import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

/** Кнопка перехода на страницу отслеживания готовых изделий по номеру телефона. */
const TrackingButton = () => {
  return (
    <Link
      to="/tracking"
      aria-label="Отследить готовое изделие"
      title="Отследить готовое изделие"
      className="hidden h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-primary hover:text-primary-foreground sm:flex"
    >
      <Icon name="PackageSearch" size={19} />
    </Link>
  );
};

export default TrackingButton;
