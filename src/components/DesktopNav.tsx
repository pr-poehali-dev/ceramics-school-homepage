import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const WORKSHOP_LINKS = [
  { label: 'Лепка из глины', to: '/moscow/workshops/lepka' },
  { label: 'Гончарный круг', to: '/moscow/workshops/krug' },
  { label: 'Роспись ангобами', to: '/moscow/workshops/angoby' },
  { label: 'Роспись акрилом', to: '/moscow/workshops/akril' },
];

const LINKS = [
  { label: 'Форматы', to: '/moscow/formats' },
  { label: 'Отзывы', to: '/moscow/reviews' },
  { label: 'Подарочные сертификаты', to: '/moscow/certificates' },
  { label: 'Контакты', to: '/moscow/contacts' },
];

interface DesktopNavProps {
  active?: string;
}

const DesktopNav = ({ active }: DesktopNavProps) => {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <nav className="hidden items-center gap-8 md:flex">
      <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
        <Link
          to="/moscow/workshops"
          className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
            active === '/moscow/workshops' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          Мастер-классы
          <Icon
            name="ChevronDown"
            size={15}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </Link>

        <div
          className={`absolute left-0 top-full z-50 pt-3 transition-all ${
            open ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
        >
          <div className="w-60 overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
            {WORKSHOP_LINKS.map((w) => (
              <Link
                key={w.to}
                to={w.to}
                className="block px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                {w.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {LINKS.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            active === l.to ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {l.label}
        </Link>
      ))}

      <a
        href="https://dymovceramic.ru/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 rounded-full border border-primary/40 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        <Icon name="ShoppingBag" size={15} /> Магазин
      </a>
    </nav>
  );
};

export default DesktopNav;