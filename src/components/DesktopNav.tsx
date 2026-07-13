import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useNavClick } from '@/hooks/useNavClick';
import { useCity } from '@/hooks/useCity';
import { MOSCOW_WORKSHOP_LINKS, MOSCOW_NAV_LINKS, SUZDAL_NAV_LINKS } from '@/lib/cities';

interface DesktopNavProps {
  active?: string;
}

const DesktopNav = ({ active }: DesktopNavProps) => {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navClick = useNavClick();
  const city = useCity();

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  if (city === 'suzdal') {
    return (
      <nav className="hidden items-center gap-8 md:flex">
        {SUZDAL_NAV_LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            onClick={navClick(l.to)}
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
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <Icon name="ShoppingBag" size={14} /> Магазин
        </a>
      </nav>
    );
  }

  return (
    <nav className="hidden items-center gap-8 md:flex">
      <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
        <Link
          to="/moscow/workshops"
          onClick={navClick('/moscow/workshops')}
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
            {MOSCOW_WORKSHOP_LINKS.map((w) => (
              <Link
                key={w.to}
                to={w.to}
                onClick={navClick(w.to)}
                className="block px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                {w.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {MOSCOW_NAV_LINKS.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          onClick={navClick(l.to)}
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
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <Icon name="ShoppingBag" size={14} /> Магазин
      </a>
    </nav>
  );
};

export default DesktopNav;
