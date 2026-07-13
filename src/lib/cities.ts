export type City = 'moscow' | 'suzdal';

export interface CityConfig {
  key: City;
  label: string;
  path: string;
  phone: string;
  phoneHref: string;
}

export const CITIES: Record<City, CityConfig> = {
  moscow: {
    key: 'moscow',
    label: 'Москва',
    path: '/moscow',
    phone: '+7 (985) 419-89-03',
    phoneHref: 'tel:+79854198903',
  },
  suzdal: {
    key: 'suzdal',
    label: 'Суздаль',
    path: '/suzdal',
    phone: '8-915-157-64-85',
    phoneHref: 'tel:+79151576485',
  },
};

export interface NavLink {
  label: string;
  to: string;
}

/** Пункты меню "Мастер-классы" (выпадающий список) для Москвы. */
export const MOSCOW_WORKSHOP_LINKS: NavLink[] = [
  { label: 'Лепка из глины', to: '/moscow/workshops/lepka' },
  { label: 'Гончарный круг', to: '/moscow/workshops/krug' },
  { label: 'Роспись ангобами', to: '/moscow/workshops/angoby' },
  { label: 'Роспись акрилом', to: '/moscow/workshops/akril' },
];

/** Основные пункты меню для Москвы (без "Мастер-классов", идут отдельным блоком). */
export const MOSCOW_NAV_LINKS: NavLink[] = [
  { label: 'Форматы', to: '/moscow/formats' },
  { label: 'Сертификаты', to: '/moscow/certificates' },
  { label: 'Отзывы', to: '/moscow/reviews' },
  { label: 'Контакты', to: '/moscow/contacts' },
];

/** Пункты меню для Суздаля. */
export const SUZDAL_NAV_LINKS: NavLink[] = [
  { label: 'Мастер-классы', to: '/suzdal/workshops' },
  { label: 'Сертификаты', to: '/suzdal/certificates' },
  { label: 'Экскурсии', to: '/suzdal/excursions' },
  { label: 'Контакты', to: '/suzdal/contacts' },
  { label: 'О фабрике', to: '/suzdal/about' },
];