import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';
import SocialLinks from '@/components/SocialLinks';

const SHOP_URL = 'https://dymovceramic.ru/';

const WORKSHOP_LINKS = [
  { label: 'Лепка из глины', to: '/moscow/workshops/lepka' },
  { label: 'Гончарный круг', to: '/moscow/workshops/krug' },
  { label: 'Роспись ангобами', to: '/moscow/workshops/angoby' },
  { label: 'Роспись акрилом', to: '/moscow/workshops/akril' },
];

const SECTION_LINKS = [
  { label: 'Все мастер-классы', to: '/moscow/workshops' },
  { label: 'Форматы и цены', to: '/moscow/formats' },
  { label: 'Сертификаты', to: '/moscow/certificates' },
  { label: 'Отзывы', to: '/moscow/reviews' },
  { label: 'Контакты', to: '/moscow/contacts' },
];

const CUSTOMER_LINKS = [
  { label: 'Информация', to: '/moscow/info' },
  { label: 'Публичная оферта', to: '/moscow/offer' },
  { label: 'Политика конфиденциальности', to: '/moscow/privacy' },
  { label: 'Политика cookie', to: '/moscow/cookies' },
];

const FooterCol = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) => (
  <div>
    <h4 className="font-display text-base font-semibold text-foreground">{title}</h4>
    <ul className="mt-4 space-y-2.5">
      {links.map((l) => (
        <li key={l.to + l.label}>
          <Link
            to={l.to}
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const SiteFooter = () => (
  <footer className="mt-16 border-t border-border bg-secondary/40">
    <div className="container py-14">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        {/* About + contacts */}
        <div>
          <Logo className="h-9" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Студия керамики на ВДНХ. Мастер-классы по лепке, гончарному кругу и росписи для
            взрослых и детей с 2003 года.
          </p>
          <div className="mt-5 space-y-2.5 text-sm">
            <a
              href="tel:+79854198903"
              className="flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary"
            >
              <Icon name="Phone" size={16} className="text-primary" /> +7 (985) 419-89-03
            </a>
            <span className="flex items-center gap-2 text-muted-foreground">
              <Icon name="MapPin" size={16} className="text-primary" /> ВДНХ, Москва
            </span>
          </div>
          <SocialLinks size={18} variant="solid" className="mt-5" />
        </div>

        {/* Workshops */}
        <FooterCol title="Мастер-классы" links={WORKSHOP_LINKS} />

        {/* Sections */}
        <FooterCol title="Разделы" links={SECTION_LINKS} />

        {/* Customers */}
        <FooterCol title="Покупателям" links={CUSTOMER_LINKS} />

        {/* Shop */}
        <div>
          <h4 className="font-display text-base font-semibold text-foreground">Интернет-магазин</h4>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Авторская керамика ручной работы с доставкой — посуда, декор и подарки от «Дымов
            Керамика».
          </p>
          <a
            href={SHOP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Icon name="ShoppingBag" size={16} /> Перейти в магазин
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
        <span>© 2003–2026 «Дымов Керамика». Все права защищены.</span>
        <span className="flex flex-wrap items-center justify-center gap-1.5">
          Хотите такой же крутой сайт?
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:underline"
          >
            Star Media
            <Icon name="ArrowUpRight" size={15} />
          </a>
        </span>
      </div>
    </div>
  </footer>
);

export default SiteFooter;