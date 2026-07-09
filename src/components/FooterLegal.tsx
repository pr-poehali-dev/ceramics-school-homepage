import { Link } from 'react-router-dom';

const FooterLegal = () => (
  <span className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
    <span>© 2003–2026 «Дымов Керамика»</span>
    <span className="text-muted-foreground/50">·</span>
    <Link to="/moscow/info" className="transition-colors hover:text-primary">
      Информация
    </Link>
    <span className="text-muted-foreground/50">·</span>
    <Link to="/moscow/offer" className="transition-colors hover:text-primary">
      Публичная оферта
    </Link>
  </span>
);

export default FooterLegal;