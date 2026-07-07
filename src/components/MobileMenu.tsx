import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const NAV = [
  { label: 'Мастер-классы', to: '/workshops' },
  { label: 'Форматы', to: '/formats' },
  { label: 'Подарочные сертификаты', to: '/certificates' },
  { label: 'Контакты', to: '/contacts' },
];

const CONTACTS = [
  { icon: 'Phone', label: 'Телефон', value: '+7 (985) 419-89-03', href: 'tel:+79854198903' },
  { icon: 'MessageCircle', label: 'WhatsApp', value: '+7 (985) 419-89-03', href: 'https://wa.me/79854198903' },
  { icon: 'Mail', label: 'Почта', value: 'hello@dymovceramic.ru', href: 'mailto:hello@dymovceramic.ru' },
  { icon: 'MapPin', label: 'Адрес', value: 'г. Москва, проспект Мира, д. 119, стр. 186', href: null },
  { icon: 'Clock', label: 'График работы', value: 'Пн–Вс, с 11:00 до 20:00', href: null },
];

interface MobileMenuProps {
  active?: string;
}

const MobileMenu = ({ active }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Открыть меню"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary md:hidden"
      >
        <Icon name="Menu" size={22} />
      </button>

      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* PANEL */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-[86%] max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300 md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <Link to="/moscow" onClick={() => setOpen(false)} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Icon name="Flame" size={20} />
            </span>
            <span className="font-display text-xl font-semibold leading-none">
              Дымов<br />
              <span className="text-primary text-sm">Керамика</span>
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Закрыть меню"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* NAV */}
          <nav className="flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-medium transition-colors ${
                  active === n.to
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {n.label}
                <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
              </Link>
            ))}
          </nav>

          {/* CONTACTS */}
          <div className="mt-8">
            <p className="mb-4 px-1 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Быстрая связь
            </p>
            <div className="space-y-1">
              {CONTACTS.map((c) => {
                const inner = (
                  <>
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon name={c.icon} size={17} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-muted-foreground">{c.label}</span>
                      <span className="block text-sm font-medium leading-snug">{c.value}</span>
                    </span>
                  </>
                );
                return c.href ? (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={c.label} className="flex items-start gap-3 rounded-xl px-2 py-2.5">
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-border p-6">
          <Button className="w-full rounded-full py-6 text-base">Записаться</Button>
        </div>
      </aside>
    </>
  );
};

export default MobileMenu;
