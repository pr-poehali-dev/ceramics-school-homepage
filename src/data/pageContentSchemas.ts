/**
 * Единый реестр редактируемых страниц сайта для CMS-панели в /admin.
 *
 * status: 'ready' — страница уже подключена к редактируемому контенту (правки
 *   из админки сразу отображаются на сайте).
 * status: 'soon' — страница пока не переведена на редактируемый контент,
 *   попадёт в один из следующих этапов работ.
 *
 * defaults — исходный текст/цены/картинки страницы. Служит как значение по
 * умолчанию, если в базе ещё нет сохранённых правок, и как источник для
 * первого открытия страницы в админке (чтобы редактор не показывал пустые поля).
 */

export type ContentFieldType = 'text' | 'textarea' | 'price' | 'image';

export interface ContentFieldSchema {
  key: string;
  label: string;
  type: ContentFieldType;
}

export interface PageSchema {
  key: string;
  title: string;
  city: 'common' | 'moscow' | 'suzdal';
  status: 'ready' | 'soon';
  fields: ContentFieldSchema[];
  defaults: Record<string, string>;
}

export const PAGE_SCHEMAS: PageSchema[] = [
  {
    key: 'home',
    title: 'Главная — выбор города',
    city: 'common',
    status: 'ready',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1', type: 'text' },
    ],
    defaults: {
      metaTitle: 'Гончарные мастер-классы в Москве и Суздале | Дымов Керамика',
      metaDescription:
        'Мастерская «Дымов Керамика»: мастер-классы по лепке, работа на гончарном круге, роспись акрилом. Уроки для детей и взрослых в Москве и Суздале. Скидки, абонементы, сертификаты!',
      h1: 'Гончарные мастер-классы в Москве или Суздале — выберите город',
    },
  },
  {
    key: 'moscow-home',
    title: 'Москва — главная',
    city: 'moscow',
    status: 'ready',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'heroTitle', label: 'Заголовок на главном баннере', type: 'text' },
      { key: 'heroSubtitle', label: 'Подзаголовок на главном баннере', type: 'textarea' },
      { key: 'heroImg', label: 'Картинка главного баннера', type: 'image' },
      { key: 'service1Title', label: 'Услуга 1 — название', type: 'text' },
      { key: 'service1Desc', label: 'Услуга 1 — описание', type: 'text' },
      { key: 'service1Price', label: 'Услуга 1 — цена', type: 'price' },
      { key: 'service1Img', label: 'Услуга 1 — картинка', type: 'image' },
      { key: 'service2Title', label: 'Услуга 2 — название', type: 'text' },
      { key: 'service2Desc', label: 'Услуга 2 — описание', type: 'text' },
      { key: 'service2Price', label: 'Услуга 2 — цена', type: 'price' },
      { key: 'service2Img', label: 'Услуга 2 — картинка', type: 'image' },
      { key: 'service3Title', label: 'Услуга 3 — название', type: 'text' },
      { key: 'service3Desc', label: 'Услуга 3 — описание', type: 'text' },
      { key: 'service3Price', label: 'Услуга 3 — цена', type: 'price' },
      { key: 'service3Img', label: 'Услуга 3 — картинка', type: 'image' },
      { key: 'service4Title', label: 'Услуга 4 — название', type: 'text' },
      { key: 'service4Desc', label: 'Услуга 4 — описание', type: 'text' },
      { key: 'service4Price', label: 'Услуга 4 — цена', type: 'price' },
      { key: 'service4Img', label: 'Услуга 4 — картинка', type: 'image' },
    ],
    defaults: {
      metaTitle: 'Школа керамики в Москве «Дымов Керамика»',
      metaDescription:
        'Гончарная мастерская в Москве ждет в гости детей и взрослых! Мастер-классы, курсы, праздники, аренда зала. Действуют скидки для пенсионеров и многодетных семей!',
      heroTitle: 'Создайте изделие из глины своими руками',
      heroSubtitle:
        'Тёплая атмосфера мастерской, опытные преподаватели и настоящая радость творчества. Для взрослых и детей.',
      heroImg:
        'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/15712126-3d2f-4720-9917-7fe580f849d4.jpg',
      service1Title: 'Лепка',
      service1Desc: 'Ручная работа с глиной',
      service1Price: 'от 1900₽',
      service1Img:
        'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/031d0b25-5ce6-4c27-8e82-d33ec3b0b178.png',
      service2Title: 'Гончарный круг',
      service2Desc: 'Создание на круге',
      service2Price: 'от 2900₽',
      service2Img:
        'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/ab36a67f-4ea0-4d3a-8ebe-21e8a9dfb891.png',
      service3Title: 'Ангобы',
      service3Desc: 'Роспись цветной глиной',
      service3Price: 'от 1900₽',
      service3Img:
        'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/7f664b40-fac2-4114-b0ad-70fc8524f908.png',
      service4Title: 'Акрил',
      service4Desc: 'Роспись готовых изделий',
      service4Price: 'от 1500₽',
      service4Img:
        'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/0bce1c46-ce6d-45d4-9a78-fc97b423975d.jpg',
    },
  },
  {
    key: 'suzdal-home',
    title: 'Суздаль — главная',
    city: 'suzdal',
    status: 'ready',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'heroTitle', label: 'Заголовок на главном баннере', type: 'text' },
      { key: 'heroSubtitle', label: 'Подзаголовок на главном баннере', type: 'textarea' },
      { key: 'heroImg', label: 'Картинка главного баннера', type: 'image' },
    ],
    defaults: {
      metaTitle: 'Фабрика и школа керамики в Суздале «Дымов Керамика»',
      metaDescription:
        'Гончарная мастерская в Суздале ждет в гости детей и взрослых! Мастер-классы на гончарном круге, ручной лепке и росписи. Экскурсии.',
      heroTitle: 'Создайте изделие из глины своими руками',
      heroSubtitle:
        'Тёплая атмосфера мастерской в самом сердце Суздаля, опытные преподаватели и настоящая радость творчества. Для взрослых и детей.',
      heroImg:
        'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/c6f10822-9087-43b5-af4a-0d27b8ec6a9b.jpg',
    },
  },

  // Страницы ниже пока не переведены на редактируемый контент — в разработке.
  { key: 'moscow-workshops', title: 'Москва — мастер-классы (список)', city: 'moscow', status: 'soon', fields: [], defaults: {} },
  { key: 'moscow-workshops-lepka', title: 'Москва — МК «Лепка»', city: 'moscow', status: 'soon', fields: [], defaults: {} },
  { key: 'moscow-workshops-krug', title: 'Москва — МК «Гончарный круг»', city: 'moscow', status: 'soon', fields: [], defaults: {} },
  { key: 'moscow-workshops-angoby', title: 'Москва — МК «Ангобы»', city: 'moscow', status: 'soon', fields: [], defaults: {} },
  { key: 'moscow-workshops-akril', title: 'Москва — МК «Акрил»', city: 'moscow', status: 'soon', fields: [], defaults: {} },
  { key: 'moscow-formats', title: 'Москва — форматы', city: 'moscow', status: 'soon', fields: [], defaults: {} },
  { key: 'moscow-certificates', title: 'Москва — сертификаты', city: 'moscow', status: 'soon', fields: [], defaults: {} },
  { key: 'moscow-contacts', title: 'Москва — контакты', city: 'moscow', status: 'soon', fields: [], defaults: {} },
  { key: 'moscow-reviews', title: 'Москва — отзывы', city: 'moscow', status: 'soon', fields: [], defaults: {} },
  { key: 'moscow-info', title: 'Москва — доставка/выдача', city: 'moscow', status: 'soon', fields: [], defaults: {} },
  { key: 'suzdal-workshops', title: 'Суздаль — мастер-классы (список)', city: 'suzdal', status: 'soon', fields: [], defaults: {} },
  { key: 'suzdal-certificates', title: 'Суздаль — сертификаты', city: 'suzdal', status: 'soon', fields: [], defaults: {} },
  { key: 'suzdal-excursions', title: 'Суздаль — экскурсии', city: 'suzdal', status: 'soon', fields: [], defaults: {} },
  { key: 'suzdal-contacts', title: 'Суздаль — контакты', city: 'suzdal', status: 'soon', fields: [], defaults: {} },
  { key: 'suzdal-about', title: 'Суздаль — о нас', city: 'suzdal', status: 'soon', fields: [], defaults: {} },
  { key: 'suzdal-reviews', title: 'Суздаль — отзывы', city: 'suzdal', status: 'soon', fields: [], defaults: {} },
];

export const getPageSchema = (key: string) => PAGE_SCHEMAS.find((p) => p.key === key);
