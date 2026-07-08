import Icon from '@/components/ui/icon';

const YANDEX =
  'https://yandex.ru/profile/8182762882?lang=ru&utm_source=copy_link&utm_medium=social&utm_campaign=share';
const GIS = 'https://2gis.ru/moscow/firm/4504128908512077';

const ReviewLinks = ({ className = '' }: { className?: string }) => (
  <span className={`flex items-center gap-2 ${className}`}>
    <Icon name="Star" size={16} className="text-primary" />
    <span>Отзыв:</span>
    <a
      href={YANDEX}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-foreground transition-colors hover:text-primary"
    >
      Яндекс
    </a>
    <span className="text-muted-foreground/50">·</span>
    <a
      href={GIS}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-foreground transition-colors hover:text-primary"
    >
      2ГИС
    </a>
  </span>
);

export default ReviewLinks;
