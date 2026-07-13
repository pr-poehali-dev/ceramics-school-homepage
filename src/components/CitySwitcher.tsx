import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useCity } from '@/hooks/useCity';
import { CITIES } from '@/lib/cities';

const CitySwitcher = () => {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const city = useCity();

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
        {CITIES[city].label}
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
          {Object.values(CITIES).map((c) => (
            <Link
              key={c.key}
              to={c.path}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                city === c.key ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Icon name="Check" size={13} className={city === c.key ? '' : 'opacity-0'} />
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitySwitcher;
