import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const WORKSHOP_LINKS = [
  { label: 'Лепка из глины', to: '/workshops/lepka' },
  { label: 'Гончарный круг', to: '/workshops/krug' },
  { label: 'Роспись ангобами', to: '/workshops/angoby' },
  { label: 'Роспись акрилом', to: '/workshops/akril' },
];

const LINKS = [
  { label: 'Форматы', to: '/formats' },
  { label: 'Подарочные сертификаты', to: '/certificates' },
  { label: 'Контакты', to: '/contacts' },
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
        <button
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
            active === '/workshops' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          Мастер-классы
          <Icon
            name="ChevronDown"
            size={15}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>

        <div
          className={`absolute left-0 top-full z-50 pt-3 transition-all ${
            open ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
        >
          <div className="w-60 overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
            <Link
              to="/workshops"
              className="flex items-center justify-between px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Все мастер-классы
              <Icon name="ArrowRight" size={15} className="text-primary" />
            </Link>
            <div className="h-px bg-border" />
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
    </nav>
  );
};

export default DesktopNav;
