import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import SocialLinks from '@/components/SocialLinks';
import { useNavClick } from '@/hooks/useNavClick';
import { useCity } from '@/hooks/useCity';
import { openBooking } from '@/lib/booking';
import {
  CITIES,
  MOSCOW_WORKSHOP_LINKS,
  MOSCOW_NAV_LINKS,
  SUZDAL_WORKSHOP_LINKS,
  SUZDAL_NAV_LINKS,
} from '@/lib/cities';

const MOSCOW_CONTACTS = [
  { icon: 'Phone', label: 'Телефон', value: '+7 (985) 419-89-03', href: 'tel:+79854198903' },
  { icon: 'MessageCircle', label: 'WhatsApp', value: '+7 (985) 419-89-03', href: 'https://wa.me/79854198903' },
  { icon: 'Mail', label: 'Почта', value: 'hello@dymovceramic.ru', href: 'mailto:hello@dymovceramic.ru' },
  { icon: 'MapPin', label: 'Адрес', value: 'г. Москва, проспект Мира, д. 119, стр. 186', href: null },
  { icon: 'Clock', label: 'График работы', value: 'Пн–Вс, с 11:00 до 20:00', href: null },
];

const SUZDAL_CONTACTS = [
  { icon: 'Phone', label: 'Телефон', value: '8-915-157-64-85', href: 'tel:+79151576485' },
  { icon: 'MapPin', label: 'Адрес', value: 'г. Суздаль', href: null },
];

interface MobileMenuProps {
  active?: string;
}

const MobileMenu = ({ active }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);
  const [wsOpen, setWsOpen] = useState(false);
  const navClick = useNavClick();
  const city = useCity();
  const cityConfig = CITIES[city];
  const isSuzdal = city === 'suzdal';
  const navLinks = isSuzdal ? SUZDAL_NAV_LINKS : MOSCOW_NAV_LINKS;
  const contacts = isSuzdal ? SUZDAL_CONTACTS : MOSCOW_CONTACTS;
  const workshopsHome = isSuzdal ? '/suzdal/workshops' : '/moscow/workshops';
  const workshopLinks = isSuzdal ? SUZDAL_WORKSHOP_LINKS : MOSCOW_WORKSHOP_LINKS;

  const handleLink = (to: string) => (e: React.MouseEvent) => {
    navClick(to)(e);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Открыть меню"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary md:hidden"
      >
        <Icon name="Menu" size={22} />
      </button>

      {createPortal(
        <div className="md:hidden">
          {/* OVERLAY */}
          <div
            onClick={() => setOpen(false)}
            className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity ${
              open ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          />

          {/* PANEL */}
          <aside
            className={`fixed right-0 top-0 z-[110] flex h-full w-[86%] max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300 ${
              open ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <Link to="/" onClick={handleLink('/')} className="flex items-center">
            <Logo className="h-8" />
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
          {/* CITY SWITCHER */}
          <div className="mb-5 flex overflow-hidden rounded-xl border border-border">
            {Object.values(CITIES).map((c) =>
              c.key === city ? (
                <span
                  key={c.key}
                  className="flex flex-1 items-center justify-center gap-1.5 bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary"
                >
                  <Icon name="MapPin" size={15} />
                  {c.label}
                </span>
              ) : (
                <Link
                  key={c.key}
                  to={c.path}
                  onClick={() => setOpen(false)}
                  className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                >
                  <Icon name="MapPin" size={15} />
                  {c.label}
                </Link>
              ),
            )}
          </div>

          {/* NAV */}
          <nav className="flex flex-col gap-1">
            {/* Мастер-классы с подпунктами */}
            <div
              className={`flex items-center rounded-xl text-lg font-medium transition-colors ${
                active === workshopsHome ? 'bg-primary/10 text-primary' : 'text-foreground'
              }`}
            >
              <Link
                to={workshopsHome}
                onClick={handleLink(workshopsHome)}
                className="flex-1 rounded-l-xl px-4 py-3.5 hover:bg-muted"
              >
                Мастер-классы
              </Link>
              <button
                onClick={() => setWsOpen((v) => !v)}
                aria-label="Показать мастер-классы"
                className="flex h-full items-center rounded-r-xl px-4 py-3.5 hover:bg-muted"
              >
                <Icon
                  name="ChevronDown"
                  size={18}
                  className={`text-muted-foreground transition-transform ${wsOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
            {wsOpen && (
              <div className="mb-1 ml-3 flex flex-col gap-0.5 border-l border-border pl-3">
                {workshopLinks.map((w) => (
                  <Link
                    key={w.to}
                    to={w.to}
                    onClick={handleLink(w.to)}
                    className="rounded-lg px-3 py-2.5 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                  >
                    {w.label}
                  </Link>
                ))}
              </div>
            )}

            {navLinks.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                onClick={handleLink(n.to)}
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

            <a
              href="https://dymovceramic.ru/"
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center justify-between rounded-xl bg-primary/10 px-4 py-3.5 text-lg font-medium text-primary transition-colors hover:bg-primary/15"
            >
              <span className="flex items-center gap-2">
                <Icon name="ShoppingBag" size={18} /> Магазин керамики
              </span>
              <Icon name="ExternalLink" size={16} className="text-primary/70" />
            </a>
          </nav>

          {/* CONTACTS */}
          <div className="mt-8">
            <p className="mb-4 px-1 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Быстрая связь
            </p>
            <div className="space-y-1">
              {contacts.map((c) => {
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

          {/* SOCIALS */}
          <div className="mt-8">
            <p className="mb-4 px-1 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Мы в соцсетях
            </p>
            <SocialLinks variant="solid" />
          </div>
        </div>

            <div className="border-t border-border p-6">
              {isSuzdal ? (
                <Link to={workshopsHome} onClick={handleLink(workshopsHome)}>
                  <Button className="w-full rounded-full py-6 text-base">
                    Перейти к мастер-классам
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={() => {
                    setOpen(false);
                    openBooking();
                  }}
                  className="w-full rounded-full py-6 text-base"
                >
                  Записаться
                </Button>
              )}
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
};

export default MobileMenu;