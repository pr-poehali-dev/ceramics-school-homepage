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

/** Пункты меню "Мастер-классы" (выпадающий список) для Суздаля. */
export const SUZDAL_WORKSHOP_LINKS: NavLink[] = [
  { label: 'Гончарное ремесло', to: '/suzdal/workshops/goncharnoe-remeslo' },
  { label: 'Гончарное ремесло и роспись ангобами', to: '/suzdal/workshops/goncharnoe-remeslo-rospis-angobami' },
  { label: 'Роспись керамических тарелок', to: '/suzdal/workshops/rospis-keramicheskix-tarelok' },
  { label: 'Изготовление изразцов', to: '/suzdal/workshops/izgotovlenie-izrazcov' },
  { label: 'Изготовление изразцов и роспись ангобами', to: '/suzdal/workshops/izgotovlenie-izrazczov-rospis-angobami' },
  { label: 'Кружевная керамика', to: '/suzdal/workshops/kruzhevnaya-keramika' },
  { label: 'Кружевная керамика с росписью', to: '/suzdal/workshops/kruzhevnaya-keramika-s-rospisyu' },
  { label: 'Лепка керамических изделий', to: '/suzdal/workshops/lepka-keramicheskih' },
  { label: 'Лепка керамических изделий с росписью', to: '/suzdal/workshops/lepka-keramicheskih-s-rospisyu' },
];

/** Основные пункты меню для Суздаля (без "Мастер-классов", идут отдельным блоком). */
export const SUZDAL_NAV_LINKS: NavLink[] = [
  { label: 'Сертификаты', to: '/suzdal/certificates' },
  { label: 'Экскурсии', to: '/suzdal/excursions' },
  { label: 'Отзывы', to: '/suzdal/reviews' },
  { label: 'Контакты', to: '/suzdal/contacts' },
  { label: 'О фабрике', to: '/suzdal/about' },
];