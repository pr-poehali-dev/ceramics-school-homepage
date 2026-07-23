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
  path: string;
  fields: ContentFieldSchema[];
  defaults: Record<string, string>;
}

export const PAGE_SCHEMAS: PageSchema[] = [
  {
    key: 'home',
    title: 'Главная — выбор города',
    city: 'common',
    status: 'ready',
    path: '/',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1', type: 'text' },
      { key: 'moscowImg', label: 'Москва — картинка карточки', type: 'image' },
      { key: 'moscowBadge', label: 'Москва — метка на картинке', type: 'text' },
      { key: 'moscowTitle', label: 'Москва — заголовок под картинкой', type: 'text' },
      { key: 'moscowLinkText', label: 'Москва — текст ссылки', type: 'text' },
      { key: 'suzdalImg', label: 'Суздаль — картинка карточки', type: 'image' },
      { key: 'suzdalBadge', label: 'Суздаль — метка на картинке', type: 'text' },
      { key: 'suzdalTitle', label: 'Суздаль — заголовок под картинкой', type: 'text' },
      { key: 'suzdalLinkText', label: 'Суздаль — текст ссылки', type: 'text' },
    ],
    defaults: {
      metaTitle: 'Гончарные мастер-классы в Москве и Суздале | Дымов Керамика',
      metaDescription:
        'Мастерская «Дымов Керамика»: мастер-классы по лепке, работа на гончарном круге, роспись акрилом. Уроки для детей и взрослых в Москве и Суздале. Скидки, абонементы, сертификаты!',
      h1: 'Гончарные мастер-классы в Москве или Суздале — выберите город',
      moscowImg:
        'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/260e7e60-766b-4577-b0ce-5dd058cede6b.jpg',
      moscowBadge: 'Москва · ВДНХ',
      moscowTitle: 'Школа керамики «Дымов Керамика» на ВДНХ',
      moscowLinkText: 'Перейти на страницу школы',
      suzdalImg:
        'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/page-content/2f30440a43a8e3afc84cf515.jpg',
      suzdalBadge: 'Суздаль',
      suzdalTitle: 'Фабрика и Школа «Дымов Керамика» в Суздале',
      suzdalLinkText: 'Перейти на страницу фабрики',
    },
  },
  {
    key: 'moscow-home',
    title: 'Москва — главная',
    city: 'moscow',
    status: 'ready',
    path: '/moscow',
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
    path: '/suzdal',
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

  // MOSCOW — мастер-классы (карточки внутри)
  {
    key: 'moscow-workshops',
    title: 'Москва — мастер-классы (список)',
    city: 'moscow',
    status: 'ready',
    path: '/moscow/workshops',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок под H1', type: 'textarea' },
    ],
    defaults: {
      metaTitle: 'Мастер-классы по гончарному мастерству в Москве на ВДНХ',
      metaDescription:
        'Мастер-классы по керамике и гончарному делу для детей и взрослых в школе «Дымов Керамика». Уроки гончарного мастерства.',
      h1: 'Выберите, что хотите создавать',
      subtitle: 'Каждый мастер-класс — это час в тёплой атмосфере мастерской и своё изделие из глины на память.',
    },
  },
  {
    key: 'moscow-workshops-lepka',
    title: 'Москва — МК «Лепка»',
    city: 'moscow',
    status: 'ready',
    path: '/moscow/workshops/lepka',
    fields: [
      { key: 'title', label: 'Название', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
      { key: 'price', label: 'Цена', type: 'price' },
      { key: 'img', label: 'Картинка', type: 'image' },
    ],
    defaults: {
      title: 'Лепка из глины',
      subtitle: 'Освойте разные техники ручной лепки и создайте изделие своими руками за 1 час.',
      price: '2 900 ₽',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/031d0b25-5ce6-4c27-8e82-d33ec3b0b178.png',
    },
  },
  {
    key: 'moscow-workshops-krug',
    title: 'Москва — МК «Гончарный круг»',
    city: 'moscow',
    status: 'ready',
    path: '/moscow/workshops/krug',
    fields: [
      { key: 'title', label: 'Название', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
      { key: 'price', label: 'Цена', type: 'price' },
      { key: 'img', label: 'Картинка', type: 'image' },
    ],
    defaults: {
      title: 'Гончарный круг',
      subtitle: 'Освойте азы гончарного ремесла и создайте изделие своими руками за 1 час.',
      price: '2 900 ₽',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/ab36a67f-4ea0-4d3a-8ebe-21e8a9dfb891.png',
    },
  },
  {
    key: 'moscow-workshops-angoby',
    title: 'Москва — МК «Ангобы»',
    city: 'moscow',
    status: 'ready',
    path: '/moscow/workshops/angoby',
    fields: [
      { key: 'title', label: 'Название', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
      { key: 'price', label: 'Цена', type: 'price' },
      { key: 'img', label: 'Картинка', type: 'image' },
    ],
    defaults: {
      title: 'Роспись ангобами',
      subtitle: 'Красочно и сочно распишите керамику экологичной подглазурной краской.',
      price: '2 100 ₽',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/7f664b40-fac2-4114-b0ad-70fc8524f908.png',
    },
  },
  {
    key: 'moscow-workshops-akril',
    title: 'Москва — МК «Акрил»',
    city: 'moscow',
    status: 'ready',
    path: '/moscow/workshops/akril',
    fields: [
      { key: 'title', label: 'Название', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
      { key: 'price', label: 'Цена', type: 'price' },
      { key: 'img', label: 'Картинка', type: 'image' },
    ],
    defaults: {
      title: 'Роспись акрилом',
      subtitle: 'Попробуйте себя в роли художника — забирайте готовое изделие с собой сразу.',
      price: '1 500 ₽',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/0bce1c46-ce6d-45d4-9a78-fc97b423975d.jpg',
    },
  },
  {
    key: 'moscow-formats',
    title: 'Москва — форматы',
    city: 'moscow',
    status: 'ready',
    path: '/moscow/formats',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок под H1', type: 'textarea' },
    ],
    defaults: {
      metaTitle: 'Форматы мастер-классов в «Дымов Керамика» | Выбрать занятие на ВДНХ',
      metaDescription:
        'Выберите формат мастер-класса по керамике в студии на ВДНХ: классические, детские, тематические, свидания, выездные. Подберём вариант под любой возраст и бюджет',
      h1: 'Выберите подходящий формат',
      subtitle: 'Фильтруйте по времени, возрасту и месте — найдите идеальный вариант для себя.',
    },
  },
  {
    key: 'moscow-certificates',
    title: 'Москва — сертификаты',
    city: 'moscow',
    status: 'ready',
    path: '/moscow/certificates',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1Line1', label: 'Заголовок H1 — строка 1', type: 'text' },
      { key: 'h1Line2', label: 'Заголовок H1 — строка 2 (акцент)', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок под H1', type: 'textarea' },
      { key: 'phone', label: 'Телефон для справок', type: 'text' },
    ],
    defaults: {
      metaTitle: 'Сертификаты в гончарную мастерскую «Дымов Керамика» в Москве на ВДНХ',
      metaDescription:
        'Подарочные сертификаты на уроки гончарного мастерства. Сертификаты на гончарные мастер-классы для детей и взрослых в Москве.',
      h1Line1: 'Подарите впечатления,',
      h1Line2: 'а не вещи',
      subtitle: 'Сертификат на мастер-класс по керамике — подарок, который запомнится.',
      phone: '+7 (985) 419-89-03',
    },
  },
  {
    key: 'moscow-contacts',
    title: 'Москва — контакты',
    city: 'moscow',
    status: 'ready',
    path: '/moscow/contacts',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1 (акцент)', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок под H1', type: 'textarea' },
      { key: 'phone', label: 'Телефон', type: 'text' },
      { key: 'email', label: 'E-mail', type: 'text' },
      { key: 'address', label: 'Адрес', type: 'textarea' },
      { key: 'workHours', label: 'График работы', type: 'text' },
    ],
    defaults: {
      metaTitle: 'Контакты гончарной мастерской «Дымов Керамика» в Москве',
      metaDescription:
        'Школа керамики и гончарного мастерства «Дымов Керамика», город Москва, проспект Мира, дом 119 строение 186. График работы пн-вс с 11:00 до 20:00.',
      h1: 'ВДНХ',
      subtitle: 'Студия керамики в сердце ВДНХ. Приходите лепить — будем рады!',
      phone: '+7 (985) 419-89-03',
      email: 'hello@dymovceramic.ru',
      address: 'г. Москва, проспект Мира, д. 119, стр. 186',
      workHours: 'Пн – Вс, 11:00 – 20:00',
    },
  },
  {
    key: 'moscow-reviews',
    title: 'Москва — отзывы',
    city: 'moscow',
    status: 'ready',
    path: '/moscow/reviews',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1 (акцент)', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок под H1', type: 'textarea' },
    ],
    defaults: {
      metaTitle: 'Отзывы о студии керамики Дымов Керамика | ВДНХ, Москва',
      metaDescription:
        'Честные отзывы гостей о мастер-классах в студии керамики «Дымов Керамика» на ВДНХ. 101+ отзыв, средняя оценка 5.0. Узнайте, что говорят участники о лепке, гончарном круге и росписи керамики.',
      h1: 'наши гости',
      subtitle: 'Тёплые слова участников мастер-классов и работы, созданные их руками.',
    },
  },
  {
    key: 'moscow-info',
    title: 'Москва — доставка/выдача',
    city: 'moscow',
    status: 'ready',
    path: '/moscow/info',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1', type: 'text' },
      { key: 'phone', label: 'Телефон', type: 'text' },
      { key: 'address', label: 'Адрес для выдачи изделий', type: 'text' },
      { key: 'workHours', label: 'Время работы', type: 'text' },
    ],
    defaults: {
      metaTitle: 'Информация о доставке и выдаче изделий | Дымов Керамика',
      metaDescription:
        'Информация о доставке готовых изделий по Москве и условиях выдачи керамики после мастер-класса в студии «Дымов Керамика» на ВДНХ. Стоимость доставки уточняется у администратора по телефону +7 (985) 419-89-03.',
      h1: 'Полезная информация',
      phone: '+7 (985) 419-89-03',
      address: 'ВДНХ, проспект Мира, 119, строение 186',
      workHours: 'Ежедневно с 11:00 до 20:00',
    },
  },

  // SUZDAL
  {
    key: 'suzdal-workshops',
    title: 'Суздаль — мастер-классы (список)',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/workshops',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1 (акцент)', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок под H1', type: 'textarea' },
    ],
    defaults: {
      metaTitle: 'Мастер-классы по гончарному мастерству в Суздале',
      metaDescription:
        'Гончарные мастер-классы для детей и взрослых в школе «Дымов Керамика». Обучение гончарному делу. Курсы гончарного мастерства.',
      h1: 'мастер-классы',
      subtitle: 'Гончарное ремесло, лепка и роспись керамики на фабрике «Дымов Керамика» в Суздале.',
    },
  },
  {
    key: 'suzdal-workshops-goncharnoe-remeslo',
    title: 'Суздаль — МК «Гончарное ремесло»',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/workshops/goncharnoe-remeslo',
    fields: [
      { key: 'title', label: 'Название', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
      { key: 'price', label: 'Цена', type: 'price' },
      { key: 'img', label: 'Картинка', type: 'image' },
    ],
    defaults: {
      title: 'Гончарное ремесло',
      subtitle:
        'Гончарное дело — это настоящее волшебство! Глина в руках человека, из обычного комочка, способна превращаться в удивительные по своей красоте и гармонии изделия.',
      price: '3000',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/f1276934-81b2-4761-a942-5591d7f8e338.jpg',
    },
  },
  {
    key: 'suzdal-workshops-goncharnoe-remeslo-rospis-angobami',
    title: 'Суздаль — МК «Гончарное ремесло + роспись»',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/workshops/goncharnoe-remeslo-rospis-angobami',
    fields: [
      { key: 'title', label: 'Название', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
      { key: 'price', label: 'Цена', type: 'price' },
      { key: 'img', label: 'Картинка', type: 'image' },
    ],
    defaults: {
      title: 'Гончарное ремесло и роспись ангобами',
      subtitle:
        'Гончарное дело — это настоящее волшебство! Глина в руках человека, из обычного комочка, способна превращаться в удивительные по своей красоте и гармонии изделия.',
      price: '3650',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/a105ba85-0ace-4ad3-ab39-4441a2d4bcc6.jpg',
    },
  },
  {
    key: 'suzdal-workshops-rospis-keramicheskix-tarelok',
    title: 'Суздаль — МК «Роспись тарелок»',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/workshops/rospis-keramicheskix-tarelok',
    fields: [
      { key: 'title', label: 'Название', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
      { key: 'price', label: 'Цена', type: 'price' },
      { key: 'img', label: 'Картинка', type: 'image' },
    ],
    defaults: {
      title: 'Роспись керамических тарелок',
      subtitle:
        'Хотите попробовать себя в роли художника и творца прекрасного? Даже если вы никогда не брали в руки кисть и вам кажется, что это очень сложно, мы на практике покажем, что можно с первого занятия получать удовольствие, как от процесса, так и от результата.',
      price: '2300',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/3ebbf82b-af86-48c7-bd4b-568d71bea10f.jpg',
    },
  },
  {
    key: 'suzdal-workshops-izgotovlenie-izrazcov',
    title: 'Суздаль — МК «Изготовление изразцов»',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/workshops/izgotovlenie-izrazcov',
    fields: [
      { key: 'title', label: 'Название', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
      { key: 'price', label: 'Цена', type: 'price' },
      { key: 'img', label: 'Картинка', type: 'image' },
    ],
    defaults: {
      title: 'Изготовление изразцов',
      subtitle:
        'Изразец — это плитка из керамики, которая традиционно используется в декоре интерьеров, для облицовки печей, каминов, фасадов и т.д.',
      price: '2450',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/2509f970-e5ac-4b63-be09-6600e954392d.jpg',
    },
  },
  {
    key: 'suzdal-workshops-izgotovlenie-izrazczov-rospis-angobami',
    title: 'Суздаль — МК «Изразцы + роспись»',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/workshops/izgotovlenie-izrazczov-rospis-angobami',
    fields: [
      { key: 'title', label: 'Название', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
      { key: 'price', label: 'Цена', type: 'price' },
      { key: 'img', label: 'Картинка', type: 'image' },
    ],
    defaults: {
      title: 'Изготовление изразцов и роспись ангобами',
      subtitle:
        'Изразец — это плитка из керамики, которая традиционно используется в декоре интерьеров, для облицовки печей, каминов, фасадов и т.д. В качестве декора на изразцах, как правило, присутствуют рельефные картинки и роспись.',
      price: '3250',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/5ed56727-04b1-4e8e-a4e7-56712723a813.jpg',
    },
  },
  {
    key: 'suzdal-workshops-kruzhevnaya-keramika',
    title: 'Суздаль — МК «Кружевная керамика»',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/workshops/kruzhevnaya-keramika',
    fields: [
      { key: 'title', label: 'Название', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
      { key: 'price', label: 'Цена', type: 'price' },
      { key: 'img', label: 'Картинка', type: 'image' },
    ],
    defaults: {
      title: 'Кружевная керамика',
      subtitle: 'Изготовление керамической кружевной тарелки.',
      price: '2800',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/2f872373-81e5-4152-a08e-1006706e22d2.jpg',
    },
  },
  {
    key: 'suzdal-workshops-kruzhevnaya-keramika-s-rospisyu',
    title: 'Суздаль — МК «Кружевная керамика с росписью»',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/workshops/kruzhevnaya-keramika-s-rospisyu',
    fields: [
      { key: 'title', label: 'Название', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
      { key: 'price', label: 'Цена', type: 'price' },
      { key: 'img', label: 'Картинка', type: 'image' },
    ],
    defaults: {
      title: 'Кружевная керамика с росписью',
      subtitle: 'Изготовление керамической кружевной тарелки.',
      price: '3370',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/d946944f-b0dc-4ba0-b8ec-109ca1a37e1c.jpg',
    },
  },
  {
    key: 'suzdal-workshops-lepka-keramicheskih',
    title: 'Суздаль — МК «Лепка керамики»',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/workshops/lepka-keramicheskih',
    fields: [
      { key: 'title', label: 'Название', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
      { key: 'price', label: 'Цена', type: 'price' },
      { key: 'img', label: 'Картинка', type: 'image' },
    ],
    defaults: {
      title: 'Лепка керамических изделий',
      subtitle: 'Глина очень благодарный материал — она пластична, податлива, послушна человеческим рукам.',
      price: '2770',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/2fa9a608-118d-44b1-a594-cf35b732aa30.jpg',
    },
  },
  {
    key: 'suzdal-workshops-lepka-keramicheskih-s-rospisyu',
    title: 'Суздаль — МК «Лепка керамики с росписью»',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/workshops/lepka-keramicheskih-s-rospisyu',
    fields: [
      { key: 'title', label: 'Название', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'textarea' },
      { key: 'price', label: 'Цена', type: 'price' },
      { key: 'img', label: 'Картинка', type: 'image' },
    ],
    defaults: {
      title: 'Лепка керамических изделий с росписью',
      subtitle: 'Глина очень благодарный материал — она пластична, податлива, послушна человеческим рукам.',
      price: '3250',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/e92d28ed-ca0f-4410-9e1c-798d9d2f5976.jpg',
    },
  },
  {
    key: 'suzdal-certificates',
    title: 'Суздаль — сертификаты',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/certificates',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1 (акцент)', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок под H1', type: 'textarea' },
      { key: 'phone', label: 'Телефон для записи', type: 'text' },
    ],
    defaults: {
      metaTitle: 'Сертификаты в гончарную мастерскую «Дымов Керамика» в Суздале',
      metaDescription:
        'Подарочные сертификаты на уроки гончарного мастерства. Сертификаты на гончарные мастер-классы для детей и взрослых в Суздале.',
      h1: 'в школу',
      subtitle: 'Сертификат в школу «Дымов Керамика» в Суздале — подарок, который запомнится. Выберите номинал и оформите заказ.',
      phone: '8-915-157-64-85',
    },
  },
  {
    key: 'suzdal-excursions',
    title: 'Суздаль — экскурсии',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/excursions',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1', type: 'text' },
      { key: 'priceAdult', label: 'Цена — взрослый билет', type: 'price' },
      { key: 'priceKid', label: 'Цена — детский билет', type: 'price' },
      { key: 'duration', label: 'Длительность экскурсии', type: 'text' },
      { key: 'ageNote', label: 'Возрастные ограничения', type: 'text' },
      { key: 'phone', label: 'Телефон для записи', type: 'text' },
    ],
    defaults: {
      metaTitle: 'Экскурсии по производству «Дымов Керамика» в Суздале',
      metaDescription:
        'Мы приглашаем индивидуальные и организованные группы на экскурсию по фабрике «Дымов Керамика» в Суздале. Экскурсию можно посетить ежедневно с 9.00 до 18.00 Звоните!',
      h1: 'Экскурсии по производству «Дымов Керамика»',
      priceAdult: '1 000 ₽',
      priceKid: '600 ₽',
      duration: 'от 30 до 45 минут',
      ageNote: 'От 5 лет. Будет очень интересно и взрослым, и детям.',
      phone: '+7 (915) 157-64-85',
    },
  },
  {
    key: 'suzdal-contacts',
    title: 'Суздаль — контакты',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/contacts',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1 (акцент)', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок под H1', type: 'textarea' },
      { key: 'phone', label: 'Телефон', type: 'text' },
      { key: 'email', label: 'E-mail', type: 'text' },
      { key: 'address', label: 'Адрес', type: 'textarea' },
      { key: 'workHours', label: 'График работы', type: 'text' },
    ],
    defaults: {
      metaTitle: 'Контакты гончарной мастерской «Дымов Керамика» в Суздале',
      metaDescription:
        'Школа керамики и гончарного мастерства «Дымов Керамика», город Суздаль, улица Васильеская, дом 41а. График работы пн-вс с 9:00 до 18:00.',
      h1: 'Суздале',
      subtitle: 'Фабрика и школа «Дымов Керамика». Приходите лепить — будем рады!',
      phone: '+7 (915) 157-64-85',
      email: 'mk@dymovceramicschool.ru',
      address: 'Владимирская область, г. Суздаль, ул. Васильевская, 41а',
      workHours: 'Понедельник – Воскресенье, 9:00 – 18:00',
    },
  },
  {
    key: 'suzdal-about',
    title: 'Суздаль — о нас',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/about',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1', type: 'text' },
    ],
    defaults: {
      metaTitle: 'Гончарная школа в Суздале «Дымов Керамика»',
      metaDescription:
        'Мы рады пригласить вас на курсы керамики и гончарного мастерства в Суздале. Лучшие мастера. Мастер-классы и экскурсии. Действуют скидки для групп! Звоните!',
      h1: 'О фабрике',
    },
  },
  {
    key: 'suzdal-reviews',
    title: 'Суздаль — отзывы',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/reviews',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1 (акцент)', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок под H1', type: 'textarea' },
    ],
    defaults: {
      metaTitle: 'Отзывы о фабрике и школе керамики «Дымов Керамика» в Суздале',
      metaDescription:
        'Честные отзывы гостей о мастер-классах и экскурсиях на фабрике «Дымов Керамика» в Суздале. Узнайте, что говорят участники о гончарном ремесле, лепке и росписи керамики.',
      h1: 'наши гости',
      subtitle: 'Тёплые слова участников мастер-классов и экскурсий на фабрике в Суздале.',
    },
  },
];

export const getPageSchema = (key: string) => PAGE_SCHEMAS.find((p) => p.key === key);