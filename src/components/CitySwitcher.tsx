import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { SUZDAL_URL } from '@/lib/cities';

const CitySwitcher = () => {
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
    <div className="relative hidden md:block" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <Icon name="MapPin" size={15} />
        Москва
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
        <div className="w-44 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
          <Link
            to="/moscow"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-muted"
          >
            <Icon name="Check" size={13} />
            Москва
          </Link>
          <a
            href={SUZDAL_URL}
            className="flex items-center gap-2 px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <Icon name="Check" size={13} className="opacity-0" />
            Суздаль
          </a>
        </div>
      </div>
    </div>
  );
};

export default CitySwitcher;