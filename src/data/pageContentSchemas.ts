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
      { key: 'formatsTitle', label: 'Блок «Форматы» — заголовок', type: 'text' },
      { key: 'formatsSubtitle', label: 'Блок «Форматы» — подзаголовок', type: 'textarea' },
      { key: 'certificatesTitle', label: 'Блок «Сертификаты» — заголовок', type: 'text' },
      { key: 'certificatesText', label: 'Блок «Сертификаты» — текст', type: 'textarea' },
      { key: 'certificatesButtonText', label: 'Блок «Сертификаты» — текст кнопки', type: 'text' },
      { key: 'shopTitle', label: 'Блок «Магазин» — заголовок', type: 'text' },
      { key: 'shopText', label: 'Блок «Магазин» — текст', type: 'textarea' },
      { key: 'shopButtonText', label: 'Блок «Магазин» — текст кнопки', type: 'text' },
      { key: 'shopImg', label: 'Блок «Магазин» — картинка', type: 'image' },
      { key: 'seoTitle', label: 'SEO-текст — заголовок', type: 'text' },
      { key: 'seoParagraph1', label: 'SEO-текст — абзац 1', type: 'textarea' },
      { key: 'seoParagraph2', label: 'SEO-текст — абзац 2', type: 'textarea' },
      { key: 'seoParagraph3', label: 'SEO-текст — абзац 3', type: 'textarea' },
      { key: 'seoParagraph4', label: 'SEO-текст — абзац 4', type: 'textarea' },
      { key: 'seoSubtitle1', label: 'SEO-текст — подзаголовок 1', type: 'text' },
      { key: 'seoParagraph5', label: 'SEO-текст — абзац 5', type: 'textarea' },
      { key: 'seoParagraph6', label: 'SEO-текст — абзац 6', type: 'textarea' },
      { key: 'seoParagraph7', label: 'SEO-текст — абзац 7', type: 'textarea' },
      { key: 'seoSubtitle2', label: 'SEO-текст — подзаголовок 2', type: 'text' },
      { key: 'seoAdvantagesList', label: 'SEO-текст — список преимуществ (каждый пункт с новой строки)', type: 'textarea' },
      { key: 'seoPhone', label: 'SEO-текст — телефон в конце', type: 'text' },
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
      formatsTitle: 'Выберите свой формат',
      formatsSubtitle:
        'От разовых занятий до праздников и выездных мастер-классов — подберите подходящий вариант для себя, ребёнка или компании.',
      certificatesTitle: 'Подарите творчество на любую сумму',
      certificatesText:
        'Отличный подарок близким — незабываемый вечер в мастерской и изделие, созданное своими руками.',
      certificatesButtonText: 'Оформить сертификат',
      shopTitle: 'Керамика ручной работы с доставкой',
      shopText:
        'Не только мастер-классы — в нашем магазине «Дымов Керамика» вы найдёте авторскую посуду, декор и подарки, созданные вручную.',
      shopButtonText: 'Перейти в магазин',
      shopImg:
        'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/15712126-3d2f-4720-9917-7fe580f849d4.jpg',
      seoTitle: 'О школе «Дымов Керамика»',
      seoParagraph1:
        'Компания «Дымов Керамика» берёт своё начало в 2003 году в городе Суздаль, где супруги Вадим Дымов и Евгения Зеленская основали собственную фабрику по производству керамических изделий ручной работы.',
      seoParagraph2:
        'Наше производство — это сочетание традиционных методов ручной работы с материалами, современные технологии и авторское видение будущего русской керамики.',
      seoParagraph3:
        'С момента своего основания мануфактура «Дымов Керамика» стремительно развивалась, воплощая на практике новые творческие концепции. На сегодняшний день на базе фабрики сформировалось целое культурное пространство, логическим продолжением которого стало основание школы керамики в Москве.',
      seoParagraph4:
        'Сегодня керамику ручной работы можно не только приобрести, но и научиться делать её самому — для этого достаточно записаться на мастер-класс. Уютная мастерская, оборудованная всем необходимым инвентарём, расположена на ВДНХ и готова принять в своих стенах всех интересующихся гончарным производством.',
      seoSubtitle1: 'Творчество, доступное для детей и взрослых',
      seoParagraph5:
        'Создание керамических изделий — это удивительный творческий процесс, который не знает возрастных ограничений. Гончарное дело способно увлечь и детей, и взрослых. Каждый сделает для себя множество интересных открытий и раскроет творческий потенциал.',
      seoParagraph6:
        'Развивающие занятия для детей возрастом от 3 лет по ручной лепке способствуют развитию мелкой моторики, координации движений, абстрактного мышления и фантазии.',
      seoParagraph7:
        'Арт-терапия. Занятия с глиной успокаивают нервную систему, дают позитивный настрой, наполняют жизнь яркими красками и дарят положительные эмоции.',
      seoSubtitle2: 'Преимущества школы «Дымов Керамика»',
      seoAdvantagesList:
        'Занятия интересны детям и взрослым. Посетить мастер-класс с семьёй в нашей школе — отличная альтернатива совместного досуга.\nНаши преподаватели — опытные мастера, много лет проработавшие на гончарном производстве, готовые поделиться бесценными навыками со своими учениками.\nМы формируем небольшие группы по пять-шесть человек, благодаря чему каждому ученику уделяется достаточно внимания.\nНа занятиях вы научитесь не только создавать изделия с нуля, но и приобретёте навыки ручной росписи.\nМы работаем ежедневно. Вы всегда можете подобрать удобное время.\nМы предлагаем программы различной направленности, возможность индивидуального обучения, а также гибкую ценовую политику, акции и программы лояльности (скидки пенсионерам, студентам и т. д.).',
      seoPhone: '+7 (985) 419-89-03',
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
      { key: 'heroBadge', label: 'Метка над заголовком баннера', type: 'text' },
      { key: 'heroTitle', label: 'Заголовок на главном баннере', type: 'text' },
      { key: 'heroSubtitle', label: 'Подзаголовок на главном баннере', type: 'textarea' },
      { key: 'heroImg', label: 'Картинка главного баннера', type: 'image' },
      { key: 'heroButton1Text', label: 'Кнопка 1 — текст («К мастер-классам»)', type: 'text' },
      { key: 'heroButton2Text', label: 'Кнопка 2 — текст («Подарить сертификат»)', type: 'text' },
      { key: 'workshopsEyebrow', label: 'Блок «Мастер-классы» — метка', type: 'text' },
      { key: 'workshopsTitle', label: 'Блок «Мастер-классы» — заголовок', type: 'text' },
      { key: 'workshopsButtonText', label: 'Блок «Мастер-классы» — текст кнопки внизу', type: 'text' },
      { key: 'excursionsImg', label: 'Блок «Экскурсии» — картинка', type: 'image' },
      { key: 'excursionsBadge', label: 'Блок «Экскурсии» — метка', type: 'text' },
      { key: 'excursionsTitle', label: 'Блок «Экскурсии» — заголовок', type: 'text' },
      { key: 'excursionsText', label: 'Блок «Экскурсии» — текст', type: 'textarea' },
      { key: 'excursionsPriceAdult', label: 'Блок «Экскурсии» — цена взрослый', type: 'price' },
      { key: 'excursionsPriceKid', label: 'Блок «Экскурсии» — цена детский', type: 'price' },
      { key: 'excursionsButtonText', label: 'Блок «Экскурсии» — текст кнопки', type: 'text' },
      { key: 'reviewsEyebrow', label: 'Блок «Отзывы» — метка', type: 'text' },
      { key: 'reviewsTitle', label: 'Блок «Отзывы» — заголовок', type: 'text' },
      { key: 'reviewsButtonText', label: 'Блок «Отзывы» — текст кнопки внизу', type: 'text' },
    ],
    defaults: {
      metaTitle: 'Фабрика и школа керамики в Суздале «Дымов Керамика»',
      metaDescription:
        'Гончарная мастерская в Суздале ждет в гости детей и взрослых! Мастер-классы на гончарном круге, ручной лепке и росписи. Экскурсии.',
      heroBadge: 'Фабрика и школа керамики в Суздале',
      heroTitle: 'Создайте изделие из глины своими руками',
      heroSubtitle:
        'Тёплая атмосфера мастерской в самом сердце Суздаля, опытные преподаватели и настоящая радость творчества. Для взрослых и детей.',
      heroImg:
        'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/c6f10822-9087-43b5-af4a-0d27b8ec6a9b.jpg',
      heroButton1Text: 'Перейти к мастер-классам',
      heroButton2Text: 'Подарить сертификат',
      workshopsEyebrow: 'Наши услуги',
      workshopsTitle: 'Мастер-классы',
      workshopsButtonText: 'Все мастер-классы',
      excursionsImg:
        'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/6c567306-9774-4e90-ae66-a78ec8eb5977.png',
      excursionsBadge: 'Экскурсии',
      excursionsTitle: 'Загляните за кулисы производства',
      excursionsText:
        'Полный цикл создания керамики — от массозаготовки до обжига, росписи и упаковки. Экскурсия длится от 30 до 45 минут и подходит для взрослых и детей от 5 лет.',
      excursionsPriceAdult: '1 000 ₽',
      excursionsPriceKid: '600 ₽',
      excursionsButtonText: 'Подробнее об экскурсии',
      reviewsEyebrow: 'Отзывы',
      reviewsTitle: 'Нам доверяют',
      reviewsButtonText: 'Все отзывы и работы',
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
      { key: 'description', label: 'Блок «О мастер-классе» — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'benefit', label: 'Блок «Дети на мастер-классе» — текст', type: 'textarea' },
      { key: 'discountText', label: 'Блок «Льготникам — скидка» — текст', type: 'textarea' },
      { key: 'bookButtonText', label: 'Кнопка «Записаться» — текст', type: 'text' },
      { key: 'certificateButtonText', label: 'Кнопка «Купить сертификат» — текст', type: 'text' },
      { key: 'miniCtaTitle', label: 'Мини-блок записи — заголовок', type: 'text' },
      { key: 'miniCtaText', label: 'Мини-блок записи — текст', type: 'text' },
      { key: 'ctaTitle', label: 'Нижний блок — заголовок «Остались вопросы?»', type: 'text' },
      { key: 'ctaText', label: 'Нижний блок — текст', type: 'textarea' },
      { key: 'ctaPhone', label: 'Нижний блок — телефон', type: 'text' },
    ],
    defaults: {
      title: 'Лепка из глины',
      subtitle: 'Освойте разные техники ручной лепки и создайте изделие своими руками за 1 час.',
      price: '2 900 ₽',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/031d0b25-5ce6-4c27-8e82-d33ec3b0b178.png',
      description:
        'На мастер-классах вы можете освоить разные техники лепки из красной глины или глины шамот. Создадите изделия простейших скульптурных форм, возможна лепка из пласта, работа жгутами или отминка в специальных гипсовых формах изразцов, посуды.\nИзразец — плитка, которая традиционно используется в декоре интерьеров, для облицовки печей, каминов. В такие формы аккуратно закладывается — отминается глина и создаётся декоративный рельеф.\nРучная лепка зачастую проще, чем работа на гончарном круге, поэтому этот мастер-класс очень популярен среди родителей с детьми и начинающих керамистов. В зависимости от масштаба задумки за час занятия ученик успевает сделать 1–2 изделия. Возможности ручной лепки безграничны: предметы декора, украшения, тарелки, посуда, кухонная утварь и многое другое.\nВы сможете озвучить свои идеи, а мастер предложит различные варианты и техники выполнения. Также есть возможность декорировать авторское керамическое изделие различными штампами: деревянными заготовками, природными материалами, кружевом и так далее.\nПосле завершения мастер-класса все изделия остаются в мастерской на просушку и последующий обжиг. Через 2 недели, по желанию, можно будет приступить к росписи вашего изделия в рамках соответствующего мастер-класса.\nМастер-классы по лепке в детской группе (от 3 до 7 лет) проходят по выходным и праздничным дням. Длительность 1 час. Стоимость 1 900 руб. По предварительной записи по телефону, возможна оплата на сайте или в школе картой или наличными.',
      benefit: 'Дети до 7 лет на мастер-классах присутствуют в сопровождении взрослых.',
      discountText:
        'Социальная скидка для пенсионеров, студентов, именинников в день рождения, членов многодетных семей и инвалидов всех групп. Не распространяется на мастер-класс «Детская группа». Скидки не суммируются, действуют при предъявлении документа.',
      bookButtonText: 'Записаться',
      certificateButtonText: 'Купить сертификат',
      miniCtaTitle: 'Готовы попробовать?',
      miniCtaText: 'Запишитесь на удобное время — поможем с выбором.',
      ctaTitle: 'Остались вопросы?',
      ctaText: 'Поможем выбрать удобное время, уточним расписание и ответим на любые вопросы.',
      ctaPhone: '+7 (985) 419-89-03',
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
      { key: 'description', label: 'Блок «О мастер-классе» — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'benefit', label: 'Блок «Дети на мастер-классе» — текст', type: 'textarea' },
      { key: 'discountText', label: 'Блок «Льготникам — скидка» — текст', type: 'textarea' },
      { key: 'bookButtonText', label: 'Кнопка «Записаться» — текст', type: 'text' },
      { key: 'certificateButtonText', label: 'Кнопка «Купить сертификат» — текст', type: 'text' },
      { key: 'miniCtaTitle', label: 'Мини-блок записи — заголовок', type: 'text' },
      { key: 'miniCtaText', label: 'Мини-блок записи — текст', type: 'text' },
      { key: 'ctaTitle', label: 'Нижний блок — заголовок «Остались вопросы?»', type: 'text' },
      { key: 'ctaText', label: 'Нижний блок — текст', type: 'textarea' },
      { key: 'ctaPhone', label: 'Нижний блок — телефон', type: 'text' },
    ],
    defaults: {
      title: 'Гончарный круг',
      subtitle: 'Освойте азы гончарного ремесла и создайте изделие своими руками за 1 час.',
      price: '2 900 ₽',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/ab36a67f-4ea0-4d3a-8ebe-21e8a9dfb891.png',
      description:
        'Во время мастер-класса вы освоите азы гончарного ремесла. Узнаете, как правильно подготовить глину к работе, как центровать её на гончарном круге для создания симметричной формы, и овладеете секретами создания готовых изделий с помощью одного из древнейших ремёсел.\nВместе с мастером-гончаром вы выполните изделие, используя красную глину. Также занятие включает в себя лепку декоративных элементов: ручек или рельефных украшений.\nПосле завершения мастер-класса все изделия остаются в мастерской на просушку и последующий обжиг. Через 2 недели, по желанию, можно будет приступить к росписи вашего изделия в рамках соответствующего мастер-класса.',
      benefit: 'Дети до 7 лет на мастер-классах присутствуют в сопровождении взрослых.',
      discountText:
        'Социальная скидка для пенсионеров, студентов, именинников в день рождения, членов многодетных семей и инвалидов всех групп. Не распространяется на мастер-класс «Детская группа». Скидки не суммируются, действуют при предъявлении документа.',
      bookButtonText: 'Записаться',
      certificateButtonText: 'Купить сертификат',
      miniCtaTitle: 'Готовы попробовать?',
      miniCtaText: 'Запишитесь на удобное время — поможем с выбором.',
      ctaTitle: 'Остались вопросы?',
      ctaText: 'Поможем выбрать удобное время, уточним расписание и ответим на любые вопросы.',
      ctaPhone: '+7 (985) 419-89-03',
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
      { key: 'description', label: 'Блок «О мастер-классе» — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'benefit', label: 'Блок «Дети на мастер-классе» — текст', type: 'textarea' },
      { key: 'discountText', label: 'Блок «Льготникам — скидка» — текст', type: 'textarea' },
      { key: 'bookButtonText', label: 'Кнопка «Записаться» — текст', type: 'text' },
      { key: 'certificateButtonText', label: 'Кнопка «Купить сертификат» — текст', type: 'text' },
      { key: 'miniCtaTitle', label: 'Мини-блок записи — заголовок', type: 'text' },
      { key: 'miniCtaText', label: 'Мини-блок записи — текст', type: 'text' },
      { key: 'ctaTitle', label: 'Нижний блок — заголовок «Остались вопросы?»', type: 'text' },
      { key: 'ctaText', label: 'Нижний блок — текст', type: 'textarea' },
      { key: 'ctaPhone', label: 'Нижний блок — телефон', type: 'text' },
    ],
    defaults: {
      title: 'Роспись ангобами',
      subtitle: 'Красочно и сочно распишите керамику экологичной подглазурной краской.',
      price: '2 100 ₽',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/7f664b40-fac2-4114-b0ad-70fc8524f908.png',
      description:
        'На занятиях по росписи мы предлагаем для декорирования готовые изделия малого размера на выбор или предметы, которые вы создали ранее в нашей мастерской на занятиях по гончарному ремеслу или лепке.\nНа мастер-классе по росписи ангобами вы сможете красочно и сочно расписать изделие по своему вкусу. Ангоб — это специальная подглазурная краска по керамике, которая состоит из глины и цветных пигментов. Эта краска очень экологичная, ею могут пользоваться даже дети.\nМожно использовать традиционную роспись кистями или разнообразить узор при помощи дополнительных материалов и принтов (губки, природные фактуры, кружево и т.д.). Вы можете озвучить мастеру свои идеи, и он поможет выбрать наилучший вариант их воплощения в керамике.\nПосле завершения мастер-класса изделие остаётся в мастерской на просушку и последующий обжиг, после чего вы сможете его забрать.\nМастер-классы по росписи ангобами в детской группе (от 4 до 7 лет) проходят по выходным и праздничным дням. Длительность 1 час. Стоимость 1 900 руб. По предварительной записи по телефону, возможна оплата на сайте или в школе картой или наличными.',
      benefit: 'Дети до 7 лет на мастер-классах присутствуют в сопровождении взрослых.',
      discountText:
        'Социальная скидка для пенсионеров, студентов, именинников в день рождения, членов многодетных семей и инвалидов всех групп. Не распространяется на мастер-класс «Детская группа». Скидки не суммируются, действуют при предъявлении документа.',
      bookButtonText: 'Записаться',
      certificateButtonText: 'Купить сертификат',
      miniCtaTitle: 'Готовы попробовать?',
      miniCtaText: 'Запишитесь на удобное время — поможем с выбором.',
      ctaTitle: 'Остались вопросы?',
      ctaText: 'Поможем выбрать удобное время, уточним расписание и ответим на любые вопросы.',
      ctaPhone: '+7 (985) 419-89-03',
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
      { key: 'description', label: 'Блок «О мастер-классе» — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'benefit', label: 'Блок «Дети на мастер-классе» — текст', type: 'textarea' },
      { key: 'discountText', label: 'Блок «Льготникам — скидка» — текст', type: 'textarea' },
      { key: 'bookButtonText', label: 'Кнопка «Записаться» — текст', type: 'text' },
      { key: 'certificateButtonText', label: 'Кнопка «Купить сертификат» — текст', type: 'text' },
      { key: 'miniCtaTitle', label: 'Мини-блок записи — заголовок', type: 'text' },
      { key: 'miniCtaText', label: 'Мини-блок записи — текст', type: 'text' },
      { key: 'ctaTitle', label: 'Нижний блок — заголовок «Остались вопросы?»', type: 'text' },
      { key: 'ctaText', label: 'Нижний блок — текст', type: 'textarea' },
      { key: 'ctaPhone', label: 'Нижний блок — телефон', type: 'text' },
    ],
    defaults: {
      title: 'Роспись акрилом',
      subtitle: 'Попробуйте себя в роли художника — забирайте готовое изделие с собой сразу.',
      price: '1 500 ₽',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/0bce1c46-ce6d-45d4-9a78-fc97b423975d.jpg',
      description:
        'Хотите попробовать себя в роли маленького художника и творца прекрасного? Даже если вы никогда не брали в руки кисть и вам кажется, что это очень сложно, мы на практике покажем, что можно с первого занятия получать удовольствие как от процесса, так и от результата.\nРасписанная вручную керамика станет не только отличным подарком для родных и близких, но и памятным сувениром о незабываемом мероприятии, которое вы посетили. На занятиях по росписи акрилом мы предлагаем для декорирования на выбор керамическую тарелку малой формы, декоративный гриб или изразец.\nИзделия уникальны. Их выпускает наш завод в Суздале по нашим эскизам специально для нашей школы.\nСтоимость мастер-класса по росписи акрилом составляет 1 500 рублей с участника с учётом изделия под роспись. Продолжительность мастер-класса — 1 час. Изделие можно забрать с собой уже через 10 минут после изготовления.',
      benefit: 'Группы от 10 участников. Изделие можно забрать с собой через 10 минут.',
      discountText:
        'Социальная скидка для пенсионеров, студентов, именинников в день рождения, членов многодетных семей и инвалидов всех групп. Не распространяется на мастер-класс «Детская группа». Скидки не суммируются, действуют при предъявлении документа.',
      bookButtonText: 'Записаться',
      certificateButtonText: 'Купить сертификат',
      miniCtaTitle: 'Готовы попробовать?',
      miniCtaText: 'Запишитесь на удобное время — поможем с выбором.',
      ctaTitle: 'Остались вопросы?',
      ctaText: 'Поможем выбрать удобное время, уточним расписание и ответим на любые вопросы.',
      ctaPhone: '+7 (985) 419-89-03',
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
      { key: 'statPositiveCount', label: 'Статистика — количество положительных оценок', type: 'text' },
      { key: 'yandexReviewUrl', label: 'Ссылка «Отзыв на Яндексе»', type: 'text' },
      { key: 'twoGisReviewUrl', label: 'Ссылка «Отзыв в 2ГИС»', type: 'text' },
      { key: 'ctaTitle', label: 'Блок CTA — заголовок', type: 'text' },
      { key: 'ctaText', label: 'Блок CTA — текст', type: 'textarea' },
      { key: 'ctaButtonText', label: 'Блок CTA — текст кнопки', type: 'text' },
    ],
    defaults: {
      metaTitle: 'Отзывы о студии керамики Дымов Керамика | ВДНХ, Москва',
      metaDescription:
        'Честные отзывы гостей о мастер-классах в студии керамики «Дымов Керамика» на ВДНХ. 101+ отзыв, средняя оценка 5.0. Узнайте, что говорят участники о лепке, гончарном круге и росписи керамики.',
      h1: 'наши гости',
      subtitle: 'Тёплые слова участников мастер-классов и работы, созданные их руками.',
      statPositiveCount: '+700',
      yandexReviewUrl: 'https://yandex.ru/profile/8182762882?lang=ru&utm_source=copy_link&utm_medium=social&utm_campaign=share',
      twoGisReviewUrl: 'https://2gis.ru/moscow/firm/4504128908512077',
      ctaTitle: 'Хотите так же?',
      ctaText: 'Выберите формат мастер-класса и создайте своё изделие из глины — впечатления останутся надолго.',
      ctaButtonText: 'Выбрать формат',
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
      { key: 'subtitle', label: 'Подзаголовок под H1', type: 'textarea' },
      { key: 'phone', label: 'Телефон', type: 'text' },
      { key: 'address', label: 'Адрес для выдачи изделий', type: 'text' },
      { key: 'workHours', label: 'Время работы', type: 'text' },
      { key: 'deliveryText1', label: 'Блок «Доставка» — абзац 1', type: 'textarea' },
      { key: 'deliveryText2', label: 'Блок «Доставка» — абзац 2 (до телефона)', type: 'textarea' },
      { key: 'deliveryText2After', label: 'Блок «Доставка» — текст после телефона', type: 'textarea' },
      { key: 'pickupIntro', label: 'Блок «Выдача» — вводный текст', type: 'textarea' },
      { key: 'pickupSteps', label: 'Блок «Выдача» — шаги инструкции (каждый с новой строки)', type: 'textarea' },
      { key: 'pickupNoteAfterPhone', label: 'Блок «Выдача» — текст после адреса/телефона', type: 'text' },
      { key: 'pickupPhotoNote', label: 'Блок «Выдача» — «Изделие выдаётся по фотографии»', type: 'text' },
      { key: 'pickupStorageNote', label: 'Блок «Выдача» — срок хранения изделий', type: 'text' },
      { key: 'pickupWarning', label: 'Блок «Выдача» — предупреждение про въезд на ВДНХ', type: 'textarea' },
      { key: 'pickupFootnote', label: 'Блок «Выдача» — сноска про утилизацию', type: 'textarea' },
    ],
    defaults: {
      metaTitle: 'Информация о доставке и выдаче изделий | Дымов Керамика',
      metaDescription:
        'Информация о доставке готовых изделий по Москве и условиях выдачи керамики после мастер-класса в студии «Дымов Керамика» на ВДНХ. Стоимость доставки уточняется у администратора по телефону +7 (985) 419-89-03.',
      h1: 'Полезная информация',
      subtitle: 'Доставка готовых изделий и условия их выдачи после мастер-класса.',
      phone: '+7 (985) 419-89-03',
      address: 'ВДНХ, проспект Мира, 119, строение 186',
      workHours: 'Ежедневно с 11:00 до 20:00',
      deliveryText1: 'В нашей школе есть услуга курьерской доставки готовых изделий по Москве. Услуга платная.',
      deliveryText2: 'Стоимость доставки уточняется у администратора по номеру',
      deliveryText2After: 'и зависит от адреса, по которому будет доставлена ваша посылка.',
      pickupIntro: 'Вы прошли мастер-класс в Школе керамики на ВДНХ. Для уточнения статуса готовности изделия вам нужно:',
      pickupSteps:
        'Подписать изделие либо поставить дату проведения мастер-класса.\nСделать фото своей работы.\nЧерез 15 дней прислать фото на WhatsApp на номер 8 (985) 419-89-03.\nПодписаться на нашу страницу в Instagram @dymovceramicschool — в актуальных историях можно посмотреть изделия после глазурного обжига.',
      pickupNoteAfterPhone: 'Готовое изделие можно забрать через 15 дней по адресу:',
      pickupPhotoNote: 'Изделие выдаётся по фотографии.',
      pickupStorageNote: 'Мы бережно храним ваши изделия в течение 2 месяцев с даты проведения мастер-класса.',
      pickupWarning: 'Обращаем ваше внимание! Въезд на территорию ВДНХ платный. С условиями въезда и парковки можно ознакомиться на сайте ВДНХ.',
      pickupFootnote: 'По истечении срока хранения мы оставляем за собой право утилизировать изделия либо передать их на благотворительную ярмарку.',
    },
  },
  {
    key: 'moscow-offer',
    title: 'Москва — публичная оферта',
    city: 'moscow',
    status: 'ready',
    path: '/moscow/offer',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок под H1', type: 'text' },
      { key: 'documentText', label: 'Текст документа (## заголовок раздела, - пункт списка, обычная строка — абзац)', type: 'textarea' },
    ],
    defaults: {
      metaTitle: 'Публичная оферта | Дымов Керамика',
      metaDescription:
        'Публичная оферта студии керамики «Дымов Керамика». Условия оказания услуг, проведения мастер-классов, продажи товаров и возврата. Официальные документы.',
      h1: 'Публичная оферта',
      subtitle: 'Договор',
      documentText:
        'ООО «ТД «ДЫМОВ КЕРАМИКА», именуемое в дальнейшем «Продавец», предлагает любому лицу, именуемому в дальнейшем «Заказчик», заключить настоящий Договор, являющийся публичной офертой, о нижеследующем:\n' +
        '## Термины и определения\n' +
        'Акцепт — полное и безоговорочное принятие публичной оферты (заключение настоящего Договора) путём оформления Заказа.\n' +
        'Интернет-магазин — информационный ресурс, расположенный по адресу https://dymovceramicschool.ru, с помощью которого Продавец осуществляет реализацию подарочных сертификатов, мастер-классов, курсов и прочих товаров и услуг (далее — Товар) дистанционным способом.\n' +
        'Договор — договор, по которому Продавец обязуется передать в обусловленный срок товары и/или оказать услуги Заказчику.\n' +
        'Заказчик — физическое лицо, юридическое лицо или индивидуальный предприниматель, приобретающие Товар в Интернет-магазине.\n' +
        'Продавец — ООО «ТД «ДЫМОВ КЕРАМИКА», осуществляющее реализацию Товара в Интернет-магазине.\n' +
        'Публичная оферта — обращённое к неопределённому кругу лиц предложение заключить Договор на конкретных условиях.\n' +
        'Товар — представленный в Интернет-магазине на момент оформления Заказа Заказчиком перечень наименований товаров и услуг.\n' +
        'Заказ — перечень выбранных Заказчиком в Интернет-магазине товаров и услуг, включая сведения об их количестве и стоимости. Оформление Заказа Заказчиком является Акцептом настоящей Публичной оферты.\n' +
        '## 1. Предмет Договора\n' +
        '1.1. Продавец обязуется передать в собственность товары и/или оказать услуги Заказчику, а Заказчик — принять и оплатить Товар (товары и/или услуги) на условиях настоящего Договора.\n' +
        '1.2. Настоящий Договор описывает общие правовые принципы взаимодействия Заказчика и Продавца. Детальные сведения относительно актуальных условий оплаты и выполнения Заказов указаны в соответствующих разделах Интернет-магазина.\n' +
        '## 2. Формирование Заказа. Передача товаров и/или оказание услуг\n' +
        '2.1. Представленные в Интернет-магазине сведения о Товаре имеют справочный характер и не могут в полной мере передавать всю информацию о свойствах и характеристиках Товара. Заказчик имеет право до заключения Договора получить у Продавца всю интересующую его информацию. Оформление Заказчиком Заказа означает, что Заказчик получил всю информацию, которая должна быть ему предоставлена в соответствии с действующим законодательством.\n' +
        '2.2. Заказчик оформляет Заказ путём набора Товара в корзину в Интернет-магазине. В случае полной или частичной невозможности исполнения Заказа Заказчик оповещается об этом по указанным им при оформлении Заказа адресу электронной почты или номеру телефона, при этом Продавец и Заказчик могут договориться заменить отсутствующий Товар другим.\n' +
        '2.3. Заказчик обязан предоставить Продавцу информацию о реквизитах, месте своего нахождения и/или ином адресе доставки и/или другую информацию в объёме, достаточном для обработки Продавцом Заказа и доставки товаров. Предоставленная Заказчиком информация должна быть полной и достоверной, включая, при необходимости, номер помещения, номер внутреннего телефона, номер домофона и т.п.\n' +
        '2.4. Заказчик согласен принять товары по адресу, указанному при оформлении Заказа. Заказчик обязан обеспечить лицу, осуществляющему доставку, свободный и беспрепятственный доступ в указанное для доставки помещение, в том числе посредством подачи заявки в службу охраны, консьержу и т.п., либо принять товары непосредственно на пропускном пункте при наличии такового.\n' +
        '2.5. Условия доставки определяются в соответствии с размещённой в Интернет-магазине информацией.\n' +
        '2.6. Доставленные товары передаются Заказчику по месту его нахождения (иному указанному адресу доставки), а при отсутствии Заказчика — любому лицу, находящемуся в указанном Заказчиком в качестве адреса доставки помещении (квартире, офисе). Полномочия лица, доставившего товары, и лица, принимающего товары по указанному Заказчиком адресу, следуют из обстановки, в которой они действуют (абзац 2 пункта 1 статьи 182 Гражданского кодекса РФ), и Заказчик не вправе предъявлять претензии, связанные с получением товаров неуполномоченным лицом.\n' +
        '2.7. Услуги подлежат оказанию по адресу, указанному в описании соответствующих услуг согласно размещённой в Интернет-магазине информации.\n' +
        '2.8. Товары, входящие в Заказ, передаются Заказчику на основании накладной, составленной в письменной форме. При приёме товаров Заказчик обязан осмотреть их, убедиться в соответствии доставленных товаров сформированному Заказу и накладной (по ассортименту, количеству, стоимости), подписать накладную и совершить все иные действия, необходимые для принятия товаров. Подписанием накладной Заказчик подтверждает, что полученные им товары соответствуют Заказу. Риск подписания накладной без проверки лежит на Покупателе, претензии о несоответствии поставленных товаров условиям Заказа в этом случае Продавцом не принимаются.\n' +
        '2.9. Право собственности на товары, риски утраты или повреждения товаров переходят от Продавца к Заказчику в момент передачи Заказа и подписания Заказчиком накладной.\n' +
        '2.10. Продавец обязан передать Заказчику товары и/или оказать услуги надлежащего качества. Качество Товара должно отвечать требованиям действующего законодательства РФ.\n' +
        '2.11. Заказчик, которому предоставлен Товар ненадлежащего качества, если это не было оговорено Продавцом, вправе по своему выбору потребовать: безвозмездного устранения недостатков; соразмерного уменьшения цены; прочее — в соответствии с действующим законодательством РФ.\n' +
        '2.12. Возврат уплаченных Заказчиком за Товар ненадлежащего качества денежных средств осуществляется в безналичной и наличной формах. Срок возврата денежных средств Заказчику — в течение 10 (десяти) дней со дня подтверждения принятия Продавцом предъявленного Заказчиком требования.\n' +
        '## 3. Цена и порядок оплаты\n' +
        '3.1. Действующие на момент формирования Заказа цены указываются в соответствующем разделе Интернет-магазина.\n' +
        '3.2. Продавец имеет право в любой момент до подтверждения возможности исполнения сформированного Заказчиком Заказа изменить цены в одностороннем порядке. Подтверждением возможности исполнения Заказа является получение сформированной обратной связи в Интернет-магазине о принятии Заказа к исполнению.\n' +
        '3.3. Заказчик обязан оплатить сформированный им Заказ до передачи или непосредственно при передаче ему товаров и/или оказании услуг, если иное не предусмотрено отдельным Договором, действующим между Заказчиком и Продавцом.\n' +
        '3.4. Заказ может быть оплачен Заказчиком банковской картой (курьеру) или безналичными (с расчётного счёта) денежными средствами.\n' +
        '3.5. Продавец оставляет за собой право в любой момент изменить перечень доступных способов оплаты без внесения изменений в настоящий Договор. Действующие на момент формирования Заказа способы оплаты указываются в соответствующем разделе Интернет-магазина.\n' +
        '## 4. Разрешение споров\n' +
        '4.1. Все споры и разногласия, которые могут возникнуть между Сторонами, будут разрешаться путём переговоров на основе действующего законодательства Российской Федерации.\n' +
        '4.2. Не урегулированные в процессе переговоров споры разрешаются в суде по месту нахождения Продавца в порядке, установленном действующим законодательством Российской Федерации.\n' +
        '## 5. Информация для Покупателей\n' +
        '5.1. Полное фирменное наименование Продавца и его место нахождения указаны в разделе 7 настоящего Договора.\n' +
        '5.2. Срок действия настоящего Договора — с даты оформления Заказа и до выполнения Сторонами всех его условий.\n' +
        '5.3. Предложение о заключении Договора (оферта) может быть отозвано Продавцом в случаях невозможности исполнения полностью или частично, или в указанные Заказчиком при формировании Заказа сроки и способом.\n' +
        '## 6. Прочие условия\n' +
        '6.1. Заказчик не вправе уступать свои права по настоящему Договору третьему лицу без предварительного уведомления Продавца. Перевод обязанностей Заказчика по настоящему Договору допускается с предварительного письменного согласия Продавца.\n' +
        '6.2. Продавец оставляет за собой право в одностороннем порядке вносить изменения в условия настоящего Договора путём размещения актуальной редакции по адресу https://dymovceramicschool.ru.\n' +
        '6.3. Вся информация и документы, а также персональная информация, передаваемые в рамках настоящего Договора и в связи с его исполнением, конфиденциальны и не подлежат разглашению.\n' +
        '## 7. Реквизиты Продавца\n' +
        'Общество с ограниченной ответственностью «Торговый дом «Дымов Керамика»\n' +
        'Адрес места нахождения / юридический адрес: Россия, 121609, г. Москва, ул. Крылатская, д. 37\n' +
        'ОГРН: 1177746793432   ИНН: 7731377855   КПП: 773101001   ОКПО: 19008116\n' +
        'Расч. счёт № 40702810638000070234 ПАО «Сбербанк России»\n' +
        'Корр. счёт № 30101810400000000225 в ГУ Банка России по ЦФО г. Москва, БИК 044525225',
    },
  },
  {
    key: 'moscow-privacy',
    title: 'Москва — политика конфиденциальности',
    city: 'moscow',
    status: 'ready',
    path: '/moscow/privacy',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок под H1', type: 'text' },
      { key: 'documentText', label: 'Текст документа (## заголовок раздела, - пункт списка, обычная строка — абзац)', type: 'textarea' },
    ],
    defaults: {
      metaTitle: 'Политика конфиденциальности | Дымов Керамика',
      metaDescription:
        'Политика конфиденциальности и обработки персональных данных ООО «ТД «Дымов Керамика». Условия сбора, хранения и защиты персональной информации пользователей сайта и услуг студии керамики на ВДНХ.',
      h1: 'Политика конфиденциальности',
      subtitle: 'Политика в отношении обработки персональных данных',
      documentText:
        'Настоящая Политика в отношении обработки персональных данных разработана в соответствии с Федеральным законом от 27.07.2006 г. №152-ФЗ «О персональных данных».\n' +
        '## 1. Общие положения\n' +
        '1.1. Настоящая Политика разработана Обществом с ограниченной ответственностью «ТД «Дымов Керамика» (ООО «ТД «Дымов Керамика»), зарегистрированным в качестве юридического лица в Российской Федерации, имеющим место нахождения по адресу: 121609, г. Москва, ул. Крылатская, 37 (ИНН: 7731377855; КПП: 773101001; ОГРН: 1177746793432). Фактический адрес: 129223, Москва, Проспект Мира 119с186.\n' +
        '1.2. Настоящая Политика определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных в ООО «ТД «Дымов Керамика» с целью защиты прав и свобод человека и гражданина при обработке его персональных данных, в том числе защиты прав на неприкосновенность частной жизни, личную и семейную тайну.\n' +
        '1.3. Настоящая Политика распространяется на информацию, которая может быть получена ООО «ТД «Дымов Керамика» в процессе использования Пользователями сервисов ООО «ТД «Дымов Керамика», в том числе Веб-сайта, Call-центра и относящейся к персональной информации (персональным данным) Пользователей, являющихся физическими лицами, использующими сервисы, предоставляемые ООО «ТД «Дымов Керамика» в соответствии с условиями, изложенными в Соглашении.\n' +
        '1.4. Политика обработки персональных данных в ООО «ТД «Дымов Керамика» разработана в соответствии с Федеральным законом от 27.07.2006 г. №152-ФЗ «О персональных данных».\n' +
        '1.5. В настоящей Политике используются следующие термины и определения:\n' +
        '1.5.1. Определения, касающиеся персональных данных: персональные данные — любая информация, относящаяся к прямо или косвенно определённому или определяемому физическому лицу (субъекту персональных данных); обработка персональных данных — любое действие (операция) или совокупность действий (операций), совершаемых с использованием средств автоматизации или без использования таких средств с персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение персональных данных; автоматизированная обработка персональных данных — обработка персональных данных с помощью средств вычислительной техники; распространение персональных данных — действия, направленные на раскрытие персональных данных неопределённому кругу лиц; предоставление персональных данных — действия, направленные на раскрытие персональных данных определённому лицу или определённому кругу лиц; блокирование персональных данных — временное прекращение обработки персональных данных; уничтожение персональных данных — действия, в результате которых невозможно восстановить содержание персональных данных; обезличивание персональных данных — действия, в результате которых невозможно определить без использования дополнительной информации принадлежность персональных данных конкретному субъекту; информационная система персональных данных — совокупность содержащихся в базах данных персональных данных и обеспечивающих их обработку информационных технологий и технических средств; трансграничная передача персональных данных — передача персональных данных на территорию иностранного государства.\n' +
        '1.5.2. Пользователь — физическое лицо, субъект персональных данных, использующее Веб-сайт или Call-центр ООО «ТД «Дымов Керамика».\n' +
        '1.5.5. Веб-сайт — сайт https://dymovceramicschool.ru/ в сети Интернет, принадлежащий ООО «ТД «Дымов Керамика», содержащий информацию о предлагаемых товарах и услугах.\n' +
        '1.5.6. Call-центр — специализированная организация, занимающаяся обработкой обращений Пользователей и информированием по голосовым каналам связи в интересах ООО «ТД «Дымов Керамика».\n' +
        '1.5.7. Сервисы — совокупность средств дистанционного взаимодействия Пользователя и ООО «ТД «Дымов Керамика», в том числе Веб-сайт или Call-центр.\n' +
        '1.6. Действие Политики распространяется на все персональные данные субъектов, обрабатываемые в ООО «ТД «Дымов Керамика» с применением средств автоматизации и без применения таких средств.\n' +
        '1.7. К настоящей Политике должен иметь доступ любой субъект персональных данных. Настоящая Политика доступна Пользователям на странице Веб-сайта ООО «ТД «Дымов Керамика».\n' +
        '1.8. Использование любым Пользователем любого Сервиса, предоставляемого ООО «ТД «Дымов Керамика», означает согласие такого Пользователя с условиями, изложенными в настоящей Политике.\n' +
        '## 2. Принципы и условия обработки персональных данных\n' +
        '2.1. Обработка персональных данных Пользователей осуществляется самостоятельно или в составе другой информации конфиденциального характера в соответствии с требованиями, установленными: Федеральным законом от 27.07.2006 г. №152-ФЗ «О персональных данных» и принятыми в соответствии с ним нормативными правовыми актами; федеральными законами, регулирующими особенности регулирования отдельных видов конфиденциальной информации; настоящей Политикой.\n' +
        '2.2. Обработка персональных данных в ООО «ТД «Дымов Керамика» осуществляется на основе принципов:\n' +
        '2.2.1. Законности и справедливости целей и способов обработки персональных данных, соответствия целей обработки персональных данных целям, заранее определённым и заявленным при сборе персональных данных, а также полномочиям ООО «ТД «Дымов Керамика» в рамках взаимоотношений с субъектами персональных данных;\n' +
        '2.2.2. Соответствия объёма и характера обрабатываемых персональных данных, способов обработки персональных данных целям обработки персональных данных;\n' +
        '2.2.3. Достоверности персональных данных, их достаточности для целей обработки, недопустимости обработки персональных данных, избыточных по отношению к целям, заявленным при сборе персональных данных;\n' +
        '2.2.4. Недопустимости объединения созданных для несовместимых между собой целей баз данных, содержащих персональные данные;\n' +
        '2.2.5. Хранения персональных данных в форме, позволяющей определить субъекта персональных данных, не дольше, чем этого требуют цели их обработки;\n' +
        '2.2.6. Уничтожения по достижении целей обработки персональных данных или в случае утраты необходимости в их достижении.\n' +
        '2.3. Обработка персональных данных осуществляется в соответствии с условиями, предусмотренными законодательством Российской Федерации.\n' +
        '2.4. ООО «ТД «Дымов Керамика», его сотрудники и иные лица, получившие доступ к персональным данным, обязаны не раскрывать третьим лицам и не распространять персональные данные без согласия субъекта персональных данных, если иное не предусмотрено федеральным законом.\n' +
        '2.5. Настоящая Политика является обязательной для всех сотрудников ООО «ТД «Дымов Керамика», имеющих доступ к персональным данным и осуществляющих обработку персональных данных Пользователей в соответствии с возложенными на них должностными обязанностями.\n' +
        '## 3. Обработка персональных данных\n' +
        '3.1. ООО «ТД «Дымов Керамика» является оператором персональных данных.\n' +
        '3.2. ООО «ТД «Дымов Керамика» самостоятельно или совместно с другими лицами организует и (или) осуществляет обработку персональных данных, а также определяет цели обработки персональных данных, состав персональных данных, подлежащих обработке, действия (операции), совершаемые с персональными данными.\n' +
        '3.3. Обработка персональных данных субъектов персональных данных осуществляется в ООО «ТД «Дымов Керамика» в следующих целях: осуществления Пользователем заказов товаров и услуг с помощью Веб-сайта или Call-центра; предоставления персональных данных Пользователей лицам, определяемым в соответствии с пунктом 3.5. настоящей Политики; использования обезличенных персональных данных для статистических целей.\n' +
        '3.4. Обработка персональных данных осуществляется: ООО «ТД «Дымов Керамика» непосредственно (в том числе сотрудниками ООО «ТД «Дымов Керамика»); другими лицами по поручению ООО «ТД «Дымов Керамика» в соответствии с пунктом 3.5. настоящей Политики.\n' +
        '3.5. ООО «ТД «Дымов Керамика» вправе поручить обработку персональных данных другому лицу с согласия субъекта персональных данных, если иное не предусмотрено федеральным законом, на основании заключаемого с этим лицом договора. Лицо, осуществляющее обработку персональных данных по поручению ООО «ТД «Дымов Керамика», обязано соблюдать принципы и правила обработки персональных данных, предусмотренные Федеральным законом от 27.07.2006 г. №152-ФЗ «О персональных данных».\n' +
        '3.6. В случае поручения обработки персональных данных другому лицу в соответствии с пунктом 3.5. настоящей Политики ООО «ТД «Дымов Керамика» до предоставления Пользователем персональных данных уведомляет Пользователя о таких лицах, которым поручается обработка персональных данных Пользователя.\n' +
        '3.7. ООО «ТД «Дымов Керамика» не осуществляет обработку специальных категорий персональных данных.\n' +
        '3.8. В зависимости от используемого Пользователем Сервиса Пользователем могут предоставляться следующие персональные данные: фамилия, имя, отчество; возраст (дата рождения); место жительства; сведения о документе, удостоверяющем личность (паспортные данные); ИНН; СНИЛС; номер телефона Пользователя; иные данные, предоставление которых предусмотрено при предоставлении отдельных сервисов.\n' +
        '3.9. ООО «ТД «Дымов Керамика» определяет состав персональных данных при взаимодействии с Пользователем посредством соответствующего Сервиса.\n' +
        '3.10. В ООО «ТД «Дымов Керамика» обработка персональных данных осуществляется с использованием средств автоматизации и без использования средств автоматизации.\n' +
        '3.11. В ООО «ТД «Дымов Керамика» не осуществляется принятие на основании исключительно автоматизированной обработки персональных данных решений, порождающих юридические последствия в отношении Пользователя или иным образом затрагивающих его права и законные интересы.\n' +
        '3.12. Автоматизированная обработка персональных данных осуществляется в соответствии с настоящей Политикой.\n' +
        '3.13. Поручение третьим лицам обработки персональных данных Пользователей и передача в указанных целях персональных данных осуществляется с соблюдением следующих условий: поручение обработки персональных данных осуществляется на основании договора, в котором предусмотрена обязанность такой третьей стороны по обеспечению конфиденциальности и безопасности персональных данных при их обработке; передача персональных данных осуществляется в объёме и в целях, предусмотренных в указанном выше договоре; в случае, когда это необходимо, получено согласие Пользователя на передачу персональных данных в порядке, предусмотренном настоящей Политикой.\n' +
        '3.14. Трансграничная передача персональных данных осуществляется только с соблюдением требований, установленных статьёй 12 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».\n' +
        '## 4. Права Пользователей (субъектов персональных данных)\n' +
        '4.1. Пользователь (субъект персональных данных) имеет право: требовать уточнения своих персональных данных, их блокирования или уничтожения в случае, если персональные данные являются неполными, устаревшими, недостоверными, незаконно полученными или не являются необходимыми для заявленной цели обработки, а также принимать предусмотренные законом меры по защите своих прав; обжаловать в уполномоченный орган по защите прав субъектов персональных данных или в судебном порядке неправомерные действия или бездействие при обработке его персональных данных; на защиту своих прав и законных интересов, в том числе на возмещение убытков и (или) компенсацию морального вреда в судебном порядке; осуществлять иные права, предусмотренные Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».\n' +
        '4.2. Пользователь (субъект персональных данных) вправе отозвать согласие на обработку его персональных данных. В случае отзыва субъектом персональных данных согласия на обработку персональных данных оператор вправе продолжить обработку персональных данных без согласия субъекта персональных данных при наличии оснований, указанных в пунктах 2–11 части 1 статьи 6, части 2 статьи 10 и части 2 статьи 11 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».\n' +
        '## 5. Права ООО «ТД «Дымов Керамика»\n' +
        '5.1. ООО «ТД «Дымов Керамика» вправе: использовать персональные данные Пользователей, полученные в соответствии с настоящей Политикой, в порядке и на условиях, предусмотренных настоящей Политикой; осуществлять передачу персональных данных Пользователей третьим лицам для их обработки с соблюдением требований, установленных законодательством и настоящей Политикой; продолжить обработку персональных данных Пользователей после получения отзыва его согласия на обработку персональных данных в случаях, установленных в пункте 4.2. настоящей Политики; отказывать в предоставлении персональных данных в случаях, предусмотренных законодательством; использовать обезличенные данные Пользователей с соблюдением требований к обезличиванию и хранению персональных данных; осуществлять иные полномочия, предусмотренные законодательством.\n' +
        '## 6. Согласие Пользователя на обработку персональных данных\n' +
        '6.1. Пользователь выражает своё согласие на обработку ООО «ТД «Дымов Керамика» персональных данных в порядке и на условиях, предусмотренных настоящей Политикой.\n' +
        '6.2. Пользователь выражает своё согласие на обработку персональных данных следующим образом: регистрируясь (создавая личный кабинет) на Веб-сайте с момента выражения им согласия с условиями Оферты, в которой имеется ссылка на настоящую Политику; с момента предоставления Пользователем персональных данных для пользования Сервисами, предусматривающими предоставление Пользователями персональных данных.\n' +
        '6.3. Осуществляя действия, предусмотренные в пункте 6.2. настоящей Политики, Пользователь выражает своё безусловное согласие с порядком и условиями обработки его персональных данных на условиях, установленных настоящей Политикой. В случае несогласия Пользователя с условиями, предусмотренными настоящей Политикой, Пользователь не вправе использовать отдельные Сервисы, предусматривающие необходимость предоставления им персональных данных.\n' +
        '## 7. Обеспечение безопасности персональных данных\n' +
        '7.1. При обработке персональных данных ООО «ТД «Дымов Керамика» обязано принимать необходимые правовые, организационные и технические меры и обеспечивает их принятие для защиты персональных данных от неправомерного или случайного доступа к ним, уничтожения, изменения, блокирования, копирования, предоставления, распространения персональных данных, а также от иных неправомерных действий в отношении персональных данных.\n' +
        '## 8. Заключительные положения\n' +
        '8.1. Настоящая Политика является внутренним документом ООО «ТД «Дымов Керамика» и доступна Пользователю на Веб-сайте.\n' +
        '8.2. Настоящая Политика подлежит изменению, дополнению в случае появления новых законодательных актов и специальных нормативных актов по обработке и защите персональных данных, а также в иных случаях по решению ООО «ТД «Дымов Керамика».\n' +
        '8.3. Контроль исполнения требований настоящей Политики осуществляется лицом, ответственным за организацию обработки персональных данных в ООО «ТД «Дымов Керамика».\n' +
        '8.4. Ответственность работников ООО «ТД «Дымов Керамика», осуществляющих обработку персональных данных и имеющих право доступа к ним, за невыполнение требований норм, регулирующих обработку и защиту персональных данных, определяется в соответствии с законодательством Российской Федерации.\n' +
        '8.5. ООО «ТД «Дымов Керамика» не проверяет полноту и достоверность предоставленных Пользователями персональных данных, однако исходит из того, что указанные данные являются достоверными и предоставлены самим Пользователем, при этом Пользователь обладает полной дееспособностью и предоставляет эти данные самостоятельно, действуя при этом в своём интересе.',
    },
  },
  {
    key: 'moscow-cookies',
    title: 'Москва — политика cookie',
    city: 'moscow',
    status: 'ready',
    path: '/moscow/cookies',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1', type: 'text' },
      { key: 'documentText', label: 'Текст документа (## заголовок раздела, - пункт списка, обычная строка — абзац)', type: 'textarea' },
    ],
    defaults: {
      metaTitle: 'Политика использования cookie — «Дымов Керамика», Москва',
      metaDescription:
        'Как сайт студии керамики «Дымов Керамика» на ВДНХ использует файлы cookie: какие данные собираются и как их можно отключить в браузере.',
      h1: 'Политика использования файлов cookie',
      documentText:
        'Настоящая Политика использования файлов cookie регулирует порядок использования файлов cookie и аналогичных технологий на сайте https://dymovceramicschool.ru, принадлежащем ООО «ТД «Дымов Керамика». Использование файлов cookie тесно связано с обработкой персональных данных. Более подробную информацию о том, как и зачем мы обрабатываем ваши персональные данные, вы можете найти в нашей Политике конфиденциальности.\n' +
        '## Что такое cookie?\n' +
        'Файлы cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве (компьютере, смартфоне, планшете) при посещении веб-сайтов. Они позволяют сайту запоминать ваши действия и настройки (например, язык, размер шрифта, регион и др.) на определённый период, чтобы вам не приходилось вводить их повторно при каждом посещении.\n' +
        '## Какие cookie мы используем?\n' +
        'На нашем Сайте используются следующие категории файлов cookie:\n' +
        '1. Обязательные (технически необходимые) cookie. Обеспечивают базовую функциональность сайта: работу контактных форм, авторизацию, безопасность и сохранение сессии. Эти файлы устанавливаются автоматически и не требуют вашего согласия. Отказ от них сделает сайт частично или полностью неработоспособным.\n' +
        '2. Аналитические cookie. Используются для сбора статистики о посещениях сайта с помощью сервиса Яндекс.Метрика — данные хранятся на серверах в Российской Федерации. Эти cookie помогают нам анализировать поведение пользователей, улучшать структуру сайта и качество услуг. IP-адреса обезличиваются.\n' +
        '## Сторонние сервисы\n' +
        'Мы используем аналитические инструменты третьих лиц, которые могут устанавливать собственные cookie. Мы не контролируем их политику, но требуем соблюдения норм защиты данных.\n' +
        '## Управление cookie\n' +
        'При первом посещении сайта вы увидите баннер согласия на cookie, где сможете:\n' +
        '- принять все cookie;\n' +
        '- выбрать категории (например, разрешить только обязательные);\n' +
        '- отклонить аналитические cookie.\n' +
        '## Ваши возможности\n' +
        'Вы также можете в любой момент:\n' +
        '- изменить настройки согласия через баннер (если он остаётся доступным);\n' +
        '- удалить cookie вручную через настройки браузера;\n' +
        '- отключить сохранение новых cookie.\n' +
        'Важно: отказ от аналитических cookie не повлияет на основную функциональность сайта.\n' +
        '## Изменения в Политике\n' +
        'Мы оставляем за собой право вносить изменения в настоящую Политику. Актуальная версия всегда размещается на данной странице с указанием даты обновления.\n' +
        '## Контакты\n' +
        'По всем вопросам, связанным с использованием cookie или обработкой персональных данных, вы можете обратиться к нам:\n' +
        'Электронная почта: hello@dymovceramic.ru\n' +
        'Телефон: +7 (985) 419-89-03',
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
      { key: 'age', label: 'Возраст (в шапке)', type: 'text' },
      { key: 'duration', label: 'Длительность', type: 'text' },
      { key: 'description', label: 'Блок «О мастер-классе» — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'extraServicePrice', label: 'Доп. услуга «Обжиг» — цена', type: 'text' },
      { key: 'bookingPhone', label: 'Блок «Запись по телефону» — номер', type: 'text' },
      { key: 'ageNoteText', label: 'Блок «Возраст участников» — текст', type: 'textarea' },
    ],
    defaults: {
      title: 'Гончарное ремесло',
      subtitle:
        'Гончарное дело — это настоящее волшебство! Глина в руках человека, из обычного комочка, способна превращаться в удивительные по своей красоте и гармонии изделия.',
      price: '3000',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/f1276934-81b2-4761-a942-5591d7f8e338.jpg',
      age: 'Дети с 7 лет и взрослые',
      duration: '1 час',
      description:
        'Во время мастер-класса вы узнаете основные приёмы получения формы на гончарном круге, и освоите азы работы с глиной, а так же сможете выкрутить от одного до трёх изделий из красной глины (чашка, салатник, горшочек).\nПродолжительность занятия 45–60 минут, включая краткий экскурсионный рассказ и организационные вопросы.\nВ стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.\nПосле завершения мастер-класса рекомендуется воспользоваться дополнительными услугами и оставить изделия в мастерской, где их ждёт покрытие бесцветной глазурью и обжиг.',
      extraServicePrice: '180 руб. / изделие',
      bookingPhone: '+7 (915) 157-64-85',
      ageNoteText: 'Рассчитан для детей с 7 лет и взрослых. Продолжительность занятия — 1 час.',
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
      { key: 'age', label: 'Возраст (в шапке)', type: 'text' },
      { key: 'duration', label: 'Длительность', type: 'text' },
      { key: 'description', label: 'Блок «О мастер-классе» — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'extraServicePrice', label: 'Доп. услуга «Обжиг» — цена', type: 'text' },
      { key: 'bookingPhone', label: 'Блок «Запись по телефону» — номер', type: 'text' },
      { key: 'ageNoteText', label: 'Блок «Возраст участников» — текст', type: 'textarea' },
    ],
    defaults: {
      title: 'Гончарное ремесло и роспись ангобами',
      subtitle:
        'Гончарное дело — это настоящее волшебство! Глина в руках человека, из обычного комочка, способна превращаться в удивительные по своей красоте и гармонии изделия.',
      price: '3650',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/a105ba85-0ace-4ad3-ab39-4441a2d4bcc6.jpg',
      age: 'Дети с 7 лет и взрослые',
      duration: '1,5 часа',
      description:
        'На мастер-классе вы сможете не только изготовить изделие своими руками, но и расписать его ангобами.\nАнгоб — это специальная подглазурная краска по керамике, которая состоит из глины и цветных пигментов. В отличие от глазурей, эта краска очень экологичная, ей могут пользоваться даже дети.\nВо время мастер-класса вы узнаете основные приёмы получения формы на гончарном круге, и освоите азы работы с глиной, а так же сможете выкрутить от одного до двух изделий из красной глины (чашка, салатник, горшочек), которое можно украсить ангобами по своему вкусу.\nПродолжительность занятия 60–90 минут (в зависимости от количества участников), включая краткий экскурсионный рассказ и организационные вопросы.\nВ стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.\nВ стоимость занятия покрытие бесцветной глазурью и обжиг — не входят.\nЕсли вы хотите получить полностью готовое изделие, которое можно использовать в интерьере своего дома, вам необходимо воспользоваться дополнительными услугами и оставить изделие на глазурованный обжиг.',
      extraServicePrice: '200 руб. / изделие',
      bookingPhone: '+7 (915) 157-64-85',
      ageNoteText: 'Рассчитан для детей с 7 лет и взрослых. Продолжительность занятия — 1,5 часа.',
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
      { key: 'age', label: 'Возраст (в шапке)', type: 'text' },
      { key: 'duration', label: 'Длительность', type: 'text' },
      { key: 'description', label: 'Блок «О мастер-классе» — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'extraServicePrice', label: 'Доп. услуга «Обжиг» — цена', type: 'text' },
      { key: 'bookingPhone', label: 'Блок «Запись по телефону» — номер', type: 'text' },
      { key: 'ageNoteText', label: 'Блок «Возраст участников» — текст', type: 'textarea' },
    ],
    defaults: {
      title: 'Роспись керамических тарелок',
      subtitle:
        'Хотите попробовать себя в роли художника и творца прекрасного? Даже если вы никогда не брали в руки кисть и вам кажется, что это очень сложно, мы на практике покажем, что можно с первого занятия получать удовольствие, как от процесса, так и от результата.',
      price: '2300',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/3ebbf82b-af86-48c7-bd4b-568d71bea10f.jpg',
      age: 'Дети с 3 лет и взрослые',
      duration: '1 час',
      description:
        'Расписанная вручную керамическая тарелка станет отличным подарком для родных и близких, памятным сувениром о незабываемом путешествии в Суздаль. На занятиях по росписи мы предлагаем для декорирования керамическую тарелку малой формы или утиль, который выберете.\nМастер предложит выбрать тип росписи: роспись пигментами или роспись акриловыми красками.\nМожно использовать традиционную роспись кистями или разнообразить узор при помощи дополнительных материалов и принтов (губки, природные фактуры, кружево и т.д.). Мастер может продемонстрировать различные примеры орнаментов на выбор.\nПродолжительность занятия 45–60 минут, включая краткий экскурсионный рассказ и организационные вопросы.\nВ стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.\nПосле завершения мастер-класса рекомендуется воспользоваться дополнительными услугами и оставить изделия в мастерской, где их ждёт покрытие бесцветной глазурью и обжиг.',
      extraServicePrice: '200 руб. / изделие',
      bookingPhone: '+7 (915) 157-64-85',
      ageNoteText: 'Рассчитан для детей с 3 лет и взрослых. Продолжительность занятия — 1 час.',
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
      { key: 'age', label: 'Возраст (в шапке)', type: 'text' },
      { key: 'duration', label: 'Длительность', type: 'text' },
      { key: 'description', label: 'Блок «О мастер-классе» — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'extraServicePrice', label: 'Доп. услуга «Обжиг» — цена', type: 'text' },
      { key: 'bookingPhone', label: 'Блок «Запись по телефону» — номер', type: 'text' },
      { key: 'ageNoteText', label: 'Блок «Возраст участников» — текст', type: 'textarea' },
    ],
    defaults: {
      title: 'Изготовление изразцов',
      subtitle:
        'Изразец — это плитка из керамики, которая традиционно используется в декоре интерьеров, для облицовки печей, каминов, фасадов и т.д.',
      price: '2450',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/2509f970-e5ac-4b63-be09-6600e954392d.jpg',
      age: 'Дети с 7 лет и взрослые',
      duration: '1 час',
      description:
        'На мастер-классе по изготовлению изразцовых плит, вы сможете изготовить изразец своими руками. Полностью готовое изделие можно использовать при декорировании своего дома — украсив стену, печь или камин, тем самым превратив свой интерьер в единственный и неповторимый!\nМастер-класс будет интересен и взрослым и детям! Работа не сложная, но кропотливая и очень увлекательная!\nТак же вы научитесь работать со специальными гипсовыми формами, каждая из которых имеет свой уникальный рисунок. В такие формы аккуратно закладывается — отминается, глина и создаётся декоративный рельеф.\nЗа один мастер-класс вы сможете изготовить до 2-х изразцовых плиток.\nПродолжительность занятия 45–60 минут, включая краткий экскурсионный рассказ и организационные вопросы.\nВ стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.\nПосле завершения мастер-класса рекомендуется воспользоваться дополнительными услугами и оставить изделия в мастерской, где их ждёт покрытие бесцветной глазурью и обжиг.',
      extraServicePrice: '200 руб. / изделие',
      bookingPhone: '+7 (915) 157-64-85',
      ageNoteText: 'Рассчитан для детей с 7 лет и взрослых. Продолжительность занятия — 1 час.',
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
      { key: 'age', label: 'Возраст (в шапке)', type: 'text' },
      { key: 'duration', label: 'Длительность', type: 'text' },
      { key: 'description', label: 'Блок «О мастер-классе» — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'extraServicePrice', label: 'Доп. услуга «Обжиг» — цена', type: 'text' },
      { key: 'bookingPhone', label: 'Блок «Запись по телефону» — номер', type: 'text' },
      { key: 'ageNoteText', label: 'Блок «Возраст участников» — текст', type: 'textarea' },
    ],
    defaults: {
      title: 'Изготовление изразцов и роспись ангобами',
      subtitle:
        'Изразец — это плитка из керамики, которая традиционно используется в декоре интерьеров, для облицовки печей, каминов, фасадов и т.д. В качестве декора на изразцах, как правило, присутствуют рельефные картинки и роспись.',
      price: '3250',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/5ed56727-04b1-4e8e-a4e7-56712723a813.jpg',
      age: 'Дети с 7 лет и взрослые',
      duration: '1,5 часа',
      description:
        'На мастер-классе вы сможете не только изготовить изразец своими руками, но и расписать его ангобами.\nАнгоб — это специальная подглазурная краска по керамике, которая состоит из глины и цветных пигментов. В отличие от глазурей, эта краска очень экологичная, ей могут пользоваться даже дети.\nЗа одно занятие вы научитесь работать со специальными гипсовыми формами, каждая из которых имеет свой уникальный рисунок. В такие формы аккуратно закладывается (отминается) глина и создаётся декоративный рельеф, который можно украсить ангобами по своему вкусу.\nМастер-класс будет интересен и взрослым и детям! Работа не сложная, но кропотливая и очень увлекательная!\nПродолжительность занятия 60–90 минут (в зависимости от количества участников), включая краткий экскурсионный рассказ и организационные вопросы.\nВ стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.\nВ стоимость занятия покрытие бесцветной глазурью и обжиг — не входят.\nЕсли вы хотите получить полностью готовое изделие, которое можно использовать в интерьере своего дома, вам необходимо воспользоваться дополнительными услугами и оставить изделие на глазурованный обжиг.',
      extraServicePrice: '200 руб. / изделие',
      bookingPhone: '+7 (915) 157-64-85',
      ageNoteText: 'Рассчитан для детей с 7 лет и взрослых. Продолжительность занятия — 1,5 часа.',
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
      { key: 'age', label: 'Возраст (в шапке)', type: 'text' },
      { key: 'duration', label: 'Длительность', type: 'text' },
      { key: 'description', label: 'Блок «О мастер-классе» — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'extraServicePrice', label: 'Доп. услуга «Обжиг» — цена', type: 'text' },
      { key: 'bookingPhone', label: 'Блок «Запись по телефону» — номер', type: 'text' },
      { key: 'ageNoteText', label: 'Блок «Возраст участников» — текст', type: 'textarea' },
    ],
    defaults: {
      title: 'Кружевная керамика',
      subtitle: 'Изготовление керамической кружевной тарелки.',
      price: '2800',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/2f872373-81e5-4152-a08e-1006706e22d2.jpg',
      age: 'Дети с 7 лет и взрослые',
      duration: '1 час',
      description:
        'Изготовление керамической кружевной тарелки состоит из трёх этапов.\nНа мастер-классе мы проходим два этапа.\nПервый этап — подготовительный. Способом ручной отминки глины в гипсовой форме изготавливаются тарелки.\nВторой этап — творческий. С помощью различных кружев, применяя безграничную фантазию, вы декорируете тарелочку. Одним словом создаёте авторское, почти дизайнерское изделие.\nЗаключительный этап: изделие ждёт покрытие цветной глазурью и обжиг.\nПродолжительность занятия 45–60 минут, включая краткий экскурсионный рассказ и организационные вопросы.\nВ стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.\nПосле завершения мастер-класса рекомендуется воспользоваться дополнительными услугами и оставить изделия в мастерской, где их ждёт покрытие бесцветной глазурью и обжиг.',
      extraServicePrice: '200 руб. / изделие',
      bookingPhone: '+7 (915) 157-64-85',
      ageNoteText: 'Рассчитан для детей с 7 лет и взрослых. Продолжительность занятия — 1 час.',
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
      { key: 'age', label: 'Возраст (в шапке)', type: 'text' },
      { key: 'duration', label: 'Длительность', type: 'text' },
      { key: 'description', label: 'Блок «О мастер-классе» — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'extraServicePrice', label: 'Доп. услуга «Обжиг» — цена', type: 'text' },
      { key: 'bookingPhone', label: 'Блок «Запись по телефону» — номер', type: 'text' },
      { key: 'ageNoteText', label: 'Блок «Возраст участников» — текст', type: 'textarea' },
    ],
    defaults: {
      title: 'Кружевная керамика с росписью',
      subtitle: 'Изготовление керамической кружевной тарелки.',
      price: '3370',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/d946944f-b0dc-4ba0-b8ec-109ca1a37e1c.jpg',
      age: 'Дети с 7 лет и взрослые',
      duration: '1 час 30 мин.',
      description:
        'На мастер-классе вы сможете не только изготовить кружевную тарелку своими руками, но и расписать её ангобами.\nАнгоб — это специальная подглазурная краска по керамике, которая состоит из глины и цветных пигментов. В отличие от глазурей, эта краска очень экологичная, ей могут пользоваться даже дети.\nЗа одно занятие вы научитесь работать со специальными гипсовыми формами. В такие формы аккуратно закладывается (отминается) глина и создаётся тарелка глубокой или более плоской по виду. Также можно будущей тарелке придать форму самостоятельно, не используя гипсовую заготовку — это придаст вашей тарелке индивидуальности и эксклюзивности. Такую тарелку можно украсить ангобами по своему вкусу.\nМастер-класс будет интересен и взрослым, и детям! Работа не сложная, но кропотливая и очень увлекательная!\nПродолжительность занятия 60–90 минут (в зависимости от количества участников), включая краткий экскурсионный рассказ и организационные вопросы.\nВ стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.\nВ стоимость занятия покрытие бесцветной глазурью и обжиг — не входят.\nЕсли вы хотите получить полностью готовое изделие, которое можно использовать в интерьере своего дома, вам необходимо воспользоваться дополнительными услугами и оставить изделие на глазурованный обжиг.',
      extraServicePrice: '200 руб. / изделие',
      bookingPhone: '+7 (915) 157-64-85',
      ageNoteText: 'Рассчитан для детей с 7 лет и взрослых. Продолжительность занятия — 1 час 30 мин.',
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
      { key: 'age', label: 'Возраст (в шапке)', type: 'text' },
      { key: 'duration', label: 'Длительность', type: 'text' },
      { key: 'description', label: 'Блок «О мастер-классе» — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'extraServicePrice', label: 'Доп. услуга «Обжиг» — цена', type: 'text' },
      { key: 'bookingPhone', label: 'Блок «Запись по телефону» — номер', type: 'text' },
      { key: 'ageNoteText', label: 'Блок «Возраст участников» — текст', type: 'textarea' },
    ],
    defaults: {
      title: 'Лепка керамических изделий',
      subtitle: 'Глина очень благодарный материал — она пластична, податлива, послушна человеческим рукам.',
      price: '2770',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/2fa9a608-118d-44b1-a594-cf35b732aa30.jpg',
      age: 'Дети с 3 лет и взрослые',
      duration: '1 час',
      description:
        'Лепка из глины — прекрасный способ отдохнуть душой, отключиться от каждодневных проблем, изменить свою жизнь, впустив в неё творчество. Возможности ручной лепки безграничны: предметы декора, животные, украшения, тарелки, посуда, и многое другое.\nНа мастер-классе вы получите бесценный опыт, узнаете способы изготовления различных изделий из глины, освоите одну из техник ручной лепки (жгутовая лепка, лепка из кома, лепка из пластов).\nРабота с глиной развивает образно-ассоциативное мышление, воображение, мелкую моторику рук. К тому же, сувениры и подарки на любой праздник, выполненные своими руками в виде малых скульптур, всегда более ценны и производят большее впечатление, чем фабричные изделия.\nЕсли вы давно мечтаете работать с глиной, не стоит это откладывать! Обязательно запишитесь к нам на мастер-класс! Попробуйте себя в этом замысловатом деле, и, возможно, очень скоро маленький кусочек глины в ваших руках превратится в шедевр!\nПродолжительность занятия 45–60 минут, включая краткий экскурсионный рассказ и организационные вопросы.\nВ стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.\nПосле завершения мастер-класса рекомендуется воспользоваться дополнительными услугами и оставить изделия в мастерской, где их ждёт покрытие бесцветной глазурью и обжиг.',
      extraServicePrice: '200 руб. / изделие',
      bookingPhone: '+7 (915) 157-64-85',
      ageNoteText: 'Рассчитан для детей с 3 лет и взрослых. Продолжительность занятия — 1 час.',
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
      { key: 'age', label: 'Возраст (в шапке)', type: 'text' },
      { key: 'duration', label: 'Длительность', type: 'text' },
      { key: 'description', label: 'Блок «О мастер-классе» — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'extraServicePrice', label: 'Доп. услуга «Обжиг» — цена', type: 'text' },
      { key: 'bookingPhone', label: 'Блок «Запись по телефону» — номер', type: 'text' },
      { key: 'ageNoteText', label: 'Блок «Возраст участников» — текст', type: 'textarea' },
    ],
    defaults: {
      title: 'Лепка керамических изделий с росписью',
      subtitle: 'Глина очень благодарный материал — она пластична, податлива, послушна человеческим рукам.',
      price: '3250',
      img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/e92d28ed-ca0f-4410-9e1c-798d9d2f5976.jpg',
      age: 'Дети с 3 лет и взрослые',
      duration: '1 час 30 мин.',
      description:
        'Мастер-класс по лепке с росписью — это создание всевозможной посуды, предметов интерьера, украшений и т.д. Идеи, которыми вы вдохновитесь, поможем воплотить в реальность и сделаем их яркими и красочными с помощью росписи ангобами.\nАнгоб — это специальная подглазурная краска по керамике, которая состоит из глины и цветных пигментов. В отличие от глазурей, эта краска очень экологичная, ей могут пользоваться даже дети.\nНа занятиях по ручной лепке на свободную тему у каждого своя задумка работы, наша задача помочь осуществить эту мечту. На таких занятиях можно вдохновиться примерами, которые есть в мастерской, принести свой эскиз или идею из интернета и обсудить с мастером возможность воплощения.\nРучные изделия — это всегда оригинально, необычно и ценно, а сделанные собственноручно и расписанные под вашу цветовую гамму и настроение, это ещё и особенно, в них дорога каждая вмятинка и каждый мазок, сделанный кистью.\nПродолжительность занятия 60–90 минут (в зависимости от количества участников), включая краткий экскурсионный рассказ и организационные вопросы.\nВ стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.\nВ стоимость занятия покрытие бесцветной глазурью и обжиг — не входят.\nЕсли вы хотите получить полностью готовое изделие, которое можно использовать в интерьере своего дома, вам необходимо воспользоваться дополнительными услугами и оставить изделие на глазурованный обжиг.',
      extraServicePrice: '200 руб. / изделие',
      bookingPhone: '+7 (915) 157-64-85',
      ageNoteText: 'Рассчитан для детей с 3 лет и взрослых. Продолжительность занятия — 1 час 30 мин.',
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
      { key: 'bannerImg', label: 'Картинка баннера', type: 'image' },
      { key: 'description', label: 'Описание — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'durationNote', label: 'Строка про длительность программы (с иконкой)', type: 'text' },
      { key: 'cancelWarning', label: 'Предупреждение об отмене посещения', type: 'textarea' },
      { key: 'address', label: 'Адрес проведения экскурсий', type: 'textarea' },
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
      bannerImg:
        'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/6c567306-9774-4e90-ae66-a78ec8eb5977.png',
      description:
        'Мы приглашаем индивидуальные и организованные группы на экскурсию по фабрике «Дымов Керамика» в Суздале.\nОсобый интерес у посетителей вызывает непосредственно процесс изготовления керамических изделий, который они могут наблюдать в цехах и познакомиться с основными этапами производства.\nЭкскурсионная программа включает в себя посещение основных объектов предприятия, просмотр полного цикла процесса изготовления от участка массозаготовки до участка сортировки и упаковки, знакомство с особенностями производства и секретами технологии обработки глины, обжига, росписи и декорирования.',
      durationNote: 'По времени программа занимает от 30 до 45 минут.',
      cancelWarning: 'Обращаем ваше внимание на то, что при опоздании или отказе менее чем за 24 часа стоимость посещения не возвращается.',
      address: 'Владимирская область, г. Суздаль, ул. Васильевская, 41а.',
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
      { key: 'badge', label: 'Метка над заголовком', type: 'text' },
      { key: 'h1', label: 'Заголовок H1', type: 'text' },
      { key: 'heroImg', label: 'Картинка баннера', type: 'image' },
      { key: 'factoryTitle', label: 'Блок «Фабрика» — заголовок', type: 'text' },
      { key: 'factoryText', label: 'Блок «Фабрика» — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'schoolTitle', label: 'Блок «Школа» — заголовок', type: 'text' },
      { key: 'schoolText', label: 'Блок «Школа» — абзацы (каждый с новой строки)', type: 'textarea' },
      { key: 'schoolButtonText', label: 'Блок «Школа» — текст кнопки', type: 'text' },
    ],
    defaults: {
      metaTitle: 'Гончарная школа в Суздале «Дымов Керамика»',
      metaDescription:
        'Мы рады пригласить вас на курсы керамики и гончарного мастерства в Суздале. Лучшие мастера. Мастер-классы и экскурсии. Действуют скидки для групп! Звоните!',
      badge: 'С 2003 года в Суздале',
      h1: 'О фабрике',
      heroImg:
        'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/149adc21-4153-494c-a82b-0489b3754fe0.jpg',
      factoryTitle: 'Фабрика',
      factoryText:
        'Компания «Дымов Керамика» берёт своё начало в 2003 году в Суздале, где семья Дымовых основала фабрику по производству керамических изделий ручной работы.\nНаше производство — это сочетание традиционных методов ручной работы с материалами, современные технологии и авторское видение будущего русской керамики.\nС момента своего основания фабрика стремительно развивается, воплощая на практике новые творческие концепции. На сегодняшний день сформировалось целое культурное пространство, логическим продолжением которого стало основание школы керамики в Москве.',
      schoolTitle: 'Школа',
      schoolText:
        'Сегодня керамику ручной работы можно не только приобрести, но и научиться делать её самому — для этого достаточно записаться на мастер-класс.\nУютная мастерская, оборудованная всем необходимым инвентарём, готова принять в своих стенах всех интересующихся гончарным производством.',
      schoolButtonText: 'Перейти к мастер-классам',
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
      { key: 'statPositiveCount', label: 'Статистика — количество положительных оценок', type: 'text' },
      { key: 'yandexReviewUrl', label: 'Ссылка «Отзыв на Яндексе»', type: 'text' },
      { key: 'ctaTitle', label: 'Блок CTA — заголовок', type: 'text' },
      { key: 'ctaText', label: 'Блок CTA — текст', type: 'textarea' },
      { key: 'ctaButtonText', label: 'Блок CTA — текст кнопки', type: 'text' },
    ],
    defaults: {
      metaTitle: 'Отзывы о фабрике и школе керамики «Дымов Керамика» в Суздале',
      metaDescription:
        'Честные отзывы гостей о мастер-классах и экскурсиях на фабрике «Дымов Керамика» в Суздале. Узнайте, что говорят участники о гончарном ремесле, лепке и росписи керамики.',
      h1: 'наши гости',
      subtitle: 'Тёплые слова участников мастер-классов и экскурсий на фабрике в Суздале.',
      statPositiveCount: '500+',
      yandexReviewUrl: 'https://yandex.ru/maps/org/dymov_keramika/',
      ctaTitle: 'Хотите так же?',
      ctaText: 'Выберите мастер-класс и создайте своё изделие из глины — впечатления останутся надолго.',
      ctaButtonText: 'Выбрать мастер-класс',
    },
  },
  {
    key: 'suzdal-offer',
    title: 'Суздаль — публичная оферта',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/offer',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок под H1', type: 'text' },
      { key: 'documentText', label: 'Текст документа (## заголовок раздела, - пункт списка, обычная строка — абзац)', type: 'textarea' },
    ],
    defaults: {
      metaTitle: 'Публичная оферта | Дымов Керамика Суздаль',
      metaDescription:
        'Публичная оферта студии керамики «Дымов Керамика Суздаль». Условия оказания услуг, проведения мастер-классов, продажи товаров и возврата. Официальные документы.',
      h1: 'Публичная оферта Суздаль',
      subtitle: 'Договор',
      documentText:
        'Общество с ограниченной ответственностью «ДЫМОВ КЕРАМИКА», именуемое в дальнейшем «Исполнитель», предлагает любому лицу, именуемому в дальнейшем «Заказчик», заключить настоящий Договор, являющийся публичной офертой об оказании услуг.\n' +
        'Оферта считается принятой, а договор заключённым с момента получения Исполнителем подтверждения «Заказчика» о намерении воспользоваться услугами, которое может быть выражено в устной форме, письменной или любой иной форме.\n' +
        '## 1. Предмет договора\n' +
        '1.1. Исполнитель обязуется оказать Заказчику услуги в сфере проведения мастер-классов и/или экскурсионных мероприятий (далее — «Услуги»), а Заказчик обязуется принять оказанные Услуги и оплатить их в порядке и на условиях, установленных настоящим Договором.\n' +
        '1.2. Перечень, содержание, программа, продолжительность, стоимость, даты, время и место оказания Услуг размещаются на официальном сайте Исполнителя по адресу: https://dymovceramicschool.ru/suzdal и являются неотъемлемой частью настоящего Договора.\n' +
        '1.3. Исполнитель вправе привлекать третьих лиц для оказания Услуг без дополнительного согласования с Заказчиком, оставаясь ответственным за надлежащее оказание Услуг.\n' +
        '## 2. Права и обязанности сторон\n' +
        '2.1. Исполнитель обязуется:\n' +
        '2.1.1. Оказать Услуги в соответствии с заявленной программой и с соблюдением требований действующего законодательства РФ, включая нормы безопасности.\n' +
        '2.1.2. Обеспечить наличие материалов и оборудования, необходимых для оказания Услуг, если иное прямо не указано в описании Услуг.\n' +
        '2.1.3. Предоставлять Заказчику информационную и консультационную поддержку по вопросам оказания Услуг по телефону: +7-915-157-64-85.\n' +
        '2.1.4. В случае изменения условий оказания услуг (цены, даты, места проведения и иных изменений) уведомить Заказчика не менее чем за 1 (один) календарный день до начала действия таких изменений.\n' +
        '2.1.5. Осуществить возврат денежных средств Заказчику исключительно в случаях и в порядке, прямо предусмотренных разделом 4 настоящего Договора.\n' +
        '2.2. Заказчик обязуется:\n' +
        '2.2.1. При оформлении заявки предоставить достоверные и полные данные, включая: фамилию, имя, отчество участника/участников; контактный номер телефона.\n' +
        '2.2.2. Самостоятельно и своевременно отслеживать информацию об Услугах на сайте Исполнителя.\n' +
        '2.2.3. Уведомлять Исполнителя об изменении контактных данных незамедлительно, в письменной форме, путём направления сообщения на электронную почту mk@dymovceramicschool.ru либо через мессенджеры.\n' +
        '2.2.4. Произвести оплату Услуг в полном объёме и в сроки, установленные настоящим Договором.\n' +
        '2.2.5. Обеспечить явку участников к месту оказания Услуг в установленное время. Опоздание более чем на 30 (тридцать) минут с момента начала мастер-класса и (или) экскурсии либо неявка приравниваются к отказу от участия.\n' +
        '2.3. Заказчик вправе:\n' +
        '2.3.1. Отказаться от исполнения настоящего Договора до начала оказания Услуг, при условии соблюдения порядка и сроков уведомления, установленных настоящим Договором.\n' +
        '2.3.2. Уведомление об отказе считается надлежащим только при направлении его в письменной форме (по электронной почте или через мессенджер) с обязательным указанием: ФИО участника/участников; контактных данных; даты мероприятия; причины отказа.\n' +
        '## 3. Стоимость услуг и порядок оплаты\n' +
        '3.1. Для подтверждения участия Заказчик вносит предоплату (плату за услугу бронирования) в размере 1 000 (одна тысяча) рублей с каждого участника, которая является платой за бронирование за Заказчиком места (квоты участия) в конкретном мастер-классе и/или экскурсионном мероприятии, проводимом Исполнителем, на определённую дату и время, а также за резервирование Исполнителем необходимых организационных, материальных и временных ресурсов. В случае отказа Заказчика от участия в конкретном мастер-классе и/или экскурсионном мероприятии по любым основаниям услуга бронирования считается оказанной в полном объёме, а сумма платы за бронирование возврату не подлежит.\n' +
        '3.2. Предоплата является обеспечительной мерой и засчитывается в общую стоимость Услуг, если иное прямо не указано Исполнителем.\n' +
        '3.3. Оплата осуществляется путём безналичного перечисления денежных средств на расчётный счёт Исполнителя либо наличными средствами.\n' +
        '3.4. Заказчик обязан произвести оплату в течение 1 (одного) календарного дня с момента получения счёта либо подтверждения стоимости.\n' +
        '3.5. Факт оплаты является подтверждением согласия Заказчика со всеми условиями настоящего Договора без исключений.\n' +
        '3.6. Окончательная оплата Услуг (мастер-класса и/или экскурсионного мероприятия) осуществляется Заказчиком в 1 (одной) из форм: предоплата в размере 100% (сто процентов) стоимости Услуг путём перечисления безналичных денежных средств на расчётный счёт Исполнителя; либо постоплата, путём внесения денежных средств непосредственно в месте проведения мастер-класса и/или экскурсионного мероприятия, если такой способ оплаты допускается Исполнителем. Услуги считаются оплаченными с момента поступления денежных средств на расчётный счёт Исполнителя либо с момента внесения денежных средств.\n' +
        '## 4. Порядок и условия возврата денежных средств\n' +
        '4.1. В случае отказа от участия за 14 (четырнадцать) и более календарных дней до даты проведения мастер-класса и (или) экскурсии, Исполнитель обязуется вернуть Участнику 100% стоимости билета.\n' +
        '4.2. В случае отказа от участия за 7 (семь) – 13 (тринадцать) календарных дней до даты проведения мастер-класса и (или) экскурсии, Исполнитель обязуется вернуть Участнику 50% стоимости билета.\n' +
        '4.3. В случае отказа от участия за 2 (два) – 6 (шесть) календарных дней до даты проведения мастер-класса и (или) экскурсии, Исполнитель обязуется вернуть Участнику 30% стоимости билета.\n' +
        '4.4. При отказе менее чем за 24 часа, а также при неявке участника, опоздании либо досрочном прекращении участия, денежные средства возврату не подлежат.\n' +
        '4.5. Возврат осуществляется в течение 10 (десяти) рабочих дней с момента получения надлежащего уведомления.\n' +
        '4.6. Возврат производится исключительно на тот же банковский счёт (карту), с которого была произведена оплата.\n' +
        '4.7. Установленные условия возврата являются существенным условием договора и принимаются Заказчиком в момент акцепта оферты.\n' +
        '## 5. Ответственность сторон\n' +
        '5.1. Исполнитель не несёт ответственности за убытки, понесённые Заказчиком вследствие: неявки; опоздания; отказа без соблюдения установленного порядка уведомления.\n' +
        '5.2. Заказчик несёт полную материальную ответственность за вред, причинённый имуществу Исполнителя по его вине либо по вине участников.\n' +
        '## 6. Прочие условия\n' +
        '6.1. Заказчик не вправе уступать свои права по настоящему Договору третьему лицу без предварительного уведомления Исполнителя. Перевод обязанностей Заказчика по настоящему Договору допускается с предварительного письменного согласия Исполнителя.\n' +
        '6.2. Исполнитель оставляет за собой право в одностороннем порядке вносить изменения в условия настоящего Договора путём размещения актуальной редакции по адресу https://dymovceramicschool.ru.\n' +
        '6.3. Вся информация и документы, а также персональная информация, передаваемые в рамках настоящего Договора и в связи с его исполнением, конфиденциальны и не подлежат разглашению.\n' +
        '6.4. Заказчик подтверждает, что все условия настоящего договора ему ясны, и он принимает их безусловно и в полном объёме.\n' +
        '## 7. Реквизиты Исполнителя\n' +
        'ООО «Дымов. Керамика»\n' +
        'ИНН 3325011280   КПП 332501001\n' +
        'р/с 40702810610090100313\n' +
        'БИК 041708602\n' +
        'к/с 30101810000000000602\n' +
        'ОСБ № 8611 г. Владимир ПАО «Сбербанк»\n' +
        'Адрес: 601261, Владимирская обл., Суздальский р-н, с. Ивановское, ул. Солнечная, д. 7\n' +
        'Тел: 8-49231-2-43-66\n' +
        'E-mail: mk@dymovceramic.ru\n' +
        'Генеральный директор: Савин А.А.',
    },
  },
  {
    key: 'suzdal-privacy',
    title: 'Суздаль — политика конфиденциальности',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/privacy',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок под H1', type: 'text' },
      { key: 'documentText', label: 'Текст документа (## заголовок раздела, - пункт списка, обычная строка — абзац)', type: 'textarea' },
    ],
    defaults: {
      metaTitle: 'Политика конфиденциальности | Дымов Керамика в Суздале',
      metaDescription:
        'Политика конфиденциальности и обработки персональных данных ООО «Дымов. Керамика». Условия сбора, хранения и защиты персональной информации пользователей сайта фабрики и школы керамики в Суздале.',
      h1: 'Политика конфиденциальности',
      subtitle: 'Политика в отношении обработки персональных данных',
      documentText:
        'Настоящая Политика в отношении обработки персональных данных разработана в соответствии с Федеральным законом от 27.07.2006 г. №152-ФЗ «О персональных данных».\n' +
        '## 1. Общие положения\n' +
        '1.1. Настоящая Политика разработана Обществом с ограниченной ответственностью «Дымов. Керамика» (ООО «Дымов. Керамика»), зарегистрированным в качестве юридического лица в Российской Федерации, имеющим место нахождения по адресу: 601261, Владимирская обл., Суздальский р-н, с. Ивановское, ул. Солнечная, д. 7 (ИНН: 3325011280; КПП: 332501001). Фактический адрес: Владимирская область, г. Суздаль, ул. Васильевская, 41а.\n' +
        '1.2. Настоящая Политика определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных в ООО «Дымов. Керамика» с целью защиты прав и свобод человека и гражданина при обработке его персональных данных, в том числе защиты прав на неприкосновенность частной жизни, личную и семейную тайну.\n' +
        '1.3. Настоящая Политика распространяется на информацию, которая может быть получена ООО «Дымов. Керамика» в процессе использования Пользователями сервисов ООО «Дымов. Керамика», в том числе Веб-сайта и относящейся к персональной информации (персональным данным) Пользователей, являющихся физическими лицами, использующими сервисы, предоставляемые ООО «Дымов. Керамика» в соответствии с условиями, изложенными в Соглашении.\n' +
        '1.4. Политика обработки персональных данных в ООО «Дымов. Керамика» разработана в соответствии с Федеральным законом от 27.07.2006 г. №152-ФЗ «О персональных данных».\n' +
        '1.5. В настоящей Политике используются следующие термины и определения:\n' +
        '1.5.1. Определения, касающиеся персональных данных: персональные данные — любая информация, относящаяся к прямо или косвенно определённому или определяемому физическому лицу (субъекту персональных данных); обработка персональных данных — любое действие (операция) или совокупность действий (операций), совершаемых с использованием средств автоматизации или без использования таких средств с персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение персональных данных; автоматизированная обработка персональных данных — обработка персональных данных с помощью средств вычислительной техники; распространение персональных данных — действия, направленные на раскрытие персональных данных неопределённому кругу лиц; предоставление персональных данных — действия, направленные на раскрытие персональных данных определённому лицу или определённому кругу лиц; блокирование персональных данных — временное прекращение обработки персональных данных; уничтожение персональных данных — действия, в результате которых невозможно восстановить содержание персональных данных; обезличивание персональных данных — действия, в результате которых невозможно определить без использования дополнительной информации принадлежность персональных данных конкретному субъекту; информационная система персональных данных — совокупность содержащихся в базах данных персональных данных и обеспечивающих их обработку информационных технологий и технических средств; трансграничная передача персональных данных — передача персональных данных на территорию иностранного государства.\n' +
        '1.5.2. Пользователь — физическое лицо, субъект персональных данных, использующее Веб-сайт ООО «Дымов. Керамика».\n' +
        '1.5.3. Веб-сайт — сайт https://dymovceramicschool.ru/suzdal в сети Интернет, принадлежащий ООО «Дымов. Керамика», содержащий информацию о предлагаемых товарах и услугах.\n' +
        '1.5.4. Сервисы — совокупность средств дистанционного взаимодействия Пользователя и ООО «Дымов. Керамика», в том числе Веб-сайт.\n' +
        '1.6. Действие Политики распространяется на все персональные данные субъектов, обрабатываемые в ООО «Дымов. Керамика» с применением средств автоматизации и без применения таких средств.\n' +
        '1.7. К настоящей Политике должен иметь доступ любой субъект персональных данных. Настоящая Политика доступна Пользователям на странице Веб-сайта ООО «Дымов. Керамика».\n' +
        '1.8. Использование любым Пользователем любого Сервиса, предоставляемого ООО «Дымов. Керамика», означает согласие такого Пользователя с условиями, изложенными в настоящей Политике.\n' +
        '## 2. Принципы и условия обработки персональных данных\n' +
        '2.1. Обработка персональных данных Пользователей осуществляется самостоятельно или в составе другой информации конфиденциального характера в соответствии с требованиями, установленными: Федеральным законом от 27.07.2006 г. №152-ФЗ «О персональных данных» и принятыми в соответствии с ним нормативными правовыми актами; федеральными законами, регулирующими особенности регулирования отдельных видов конфиденциальной информации; настоящей Политикой.\n' +
        '2.2. Обработка персональных данных в ООО «Дымов. Керамика» осуществляется на основе принципов:\n' +
        '2.2.1. Законности и справедливости целей и способов обработки персональных данных, соответствия целей обработки персональных данных целям, заранее определённым и заявленным при сборе персональных данных, а также полномочиям ООО «Дымов. Керамика» в рамках взаимоотношений с субъектами персональных данных;\n' +
        '2.2.2. Соответствия объёма и характера обрабатываемых персональных данных, способов обработки персональных данных целям обработки персональных данных;\n' +
        '2.2.3. Достоверности персональных данных, их достаточности для целей обработки, недопустимости обработки персональных данных, избыточных по отношению к целям, заявленным при сборе персональных данных;\n' +
        '2.2.4. Недопустимости объединения созданных для несовместимых между собой целей баз данных, содержащих персональные данные;\n' +
        '2.2.5. Хранения персональных данных в форме, позволяющей определить субъекта персональных данных, не дольше, чем этого требуют цели их обработки;\n' +
        '2.2.6. Уничтожения по достижении целей обработки персональных данных или в случае утраты необходимости в их достижении.\n' +
        '2.3. Обработка персональных данных осуществляется в соответствии с условиями, предусмотренными законодательством Российской Федерации.\n' +
        '2.4. ООО «Дымов. Керамика», его сотрудники и иные лица, получившие доступ к персональным данным, обязаны не раскрывать третьим лицам и не распространять персональные данные без согласия субъекта персональных данных, если иное не предусмотрено федеральным законом.\n' +
        '2.5. Настоящая Политика является обязательной для всех сотрудников ООО «Дымов. Керамика», имеющих доступ к персональным данным и осуществляющих обработку персональных данных Пользователей в соответствии с возложенными на них должностными обязанностями.\n' +
        '## 3. Обработка персональных данных\n' +
        '3.1. ООО «Дымов. Керамика» является оператором персональных данных.\n' +
        '3.2. ООО «Дымов. Керамика» самостоятельно или совместно с другими лицами организует и (или) осуществляет обработку персональных данных, а также определяет цели обработки персональных данных, состав персональных данных, подлежащих обработке, действия (операции), совершаемые с персональными данными.\n' +
        '3.3. Обработка персональных данных субъектов персональных данных осуществляется в ООО «Дымов. Керамика» в следующих целях: осуществления Пользователем записи на мастер-классы и экскурсии с помощью Веб-сайта; предоставления персональных данных Пользователей лицам, определяемым в соответствии с пунктом 3.5. настоящей Политики; использования обезличенных персональных данных для статистических целей.\n' +
        '3.4. Обработка персональных данных осуществляется: ООО «Дымов. Керамика» непосредственно (в том числе сотрудниками ООО «Дымов. Керамика»); другими лицами по поручению ООО «Дымов. Керамика» в соответствии с пунктом 3.5. настоящей Политики.\n' +
        '3.5. ООО «Дымов. Керамика» вправе поручить обработку персональных данных другому лицу с согласия субъекта персональных данных, если иное не предусмотрено федеральным законом, на основании заключаемого с этим лицом договора. Лицо, осуществляющее обработку персональных данных по поручению ООО «Дымов. Керамика», обязано соблюдать принципы и правила обработки персональных данных, предусмотренные Федеральным законом от 27.07.2006 г. №152-ФЗ «О персональных данных».\n' +
        '3.6. В случае поручения обработки персональных данных другому лицу в соответствии с пунктом 3.5. настоящей Политики ООО «Дымов. Керамика» до предоставления Пользователем персональных данных уведомляет Пользователя о таких лицах, которым поручается обработка персональных данных Пользователя.\n' +
        '3.7. ООО «Дымов. Керамика» не осуществляет обработку специальных категорий персональных данных.\n' +
        '3.8. В зависимости от используемого Пользователем Сервиса Пользователем могут предоставляться следующие персональные данные: фамилия, имя, отчество; номер телефона Пользователя; адрес электронной почты; иные данные, предоставление которых предусмотрено при предоставлении отдельных сервисов.\n' +
        '3.9. ООО «Дымов. Керамика» определяет состав персональных данных при взаимодействии с Пользователем посредством соответствующего Сервиса.\n' +
        '3.10. В ООО «Дымов. Керамика» обработка персональных данных осуществляется с использованием средств автоматизации и без использования средств автоматизации.\n' +
        '3.11. В ООО «Дымов. Керамика» не осуществляется принятие на основании исключительно автоматизированной обработки персональных данных решений, порождающих юридические последствия в отношении Пользователя или иным образом затрагивающих его права и законные интересы.\n' +
        '3.12. Автоматизированная обработка персональных данных осуществляется в соответствии с настоящей Политикой.\n' +
        '3.13. Поручение третьим лицам обработки персональных данных Пользователей и передача в указанных целях персональных данных осуществляется с соблюдением следующих условий: поручение обработки персональных данных осуществляется на основании договора, в котором предусмотрена обязанность такой третьей стороны по обеспечению конфиденциальности и безопасности персональных данных при их обработке; передача персональных данных осуществляется в объёме и в целях, предусмотренных в указанном выше договоре; в случае, когда это необходимо, получено согласие Пользователя на передачу персональных данных в порядке, предусмотренном настоящей Политикой.\n' +
        '3.14. Трансграничная передача персональных данных осуществляется только с соблюдением требований, установленных статьёй 12 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».\n' +
        '## 4. Права Пользователей (субъектов персональных данных)\n' +
        '4.1. Пользователь (субъект персональных данных) имеет право: требовать уточнения своих персональных данных, их блокирования или уничтожения в случае, если персональные данные являются неполными, устаревшими, недостоверными, незаконно полученными или не являются необходимыми для заявленной цели обработки, а также принимать предусмотренные законом меры по защите своих прав; обжаловать в уполномоченный орган по защите прав субъектов персональных данных или в судебном порядке неправомерные действия или бездействие при обработке его персональных данных; на защиту своих прав и законных интересов, в том числе на возмещение убытков и (или) компенсацию морального вреда в судебном порядке; осуществлять иные права, предусмотренные Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».\n' +
        '4.2. Пользователь (субъект персональных данных) вправе отозвать согласие на обработку его персональных данных. В случае отзыва субъектом персональных данных согласия на обработку персональных данных оператор вправе продолжить обработку персональных данных без согласия субъекта персональных данных при наличии оснований, указанных в пунктах 2–11 части 1 статьи 6, части 2 статьи 10 и части 2 статьи 11 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».\n' +
        '## 5. Права ООО «Дымов. Керамика»\n' +
        '5.1. ООО «Дымов. Керамика» вправе: использовать персональные данные Пользователей, полученные в соответствии с настоящей Политикой, в порядке и на условиях, предусмотренных настоящей Политикой; осуществлять передачу персональных данных Пользователей третьим лицам для их обработки с соблюдением требований, установленных законодательством и настоящей Политикой; продолжить обработку персональных данных Пользователей после получения отзыва его согласия на обработку персональных данных в случаях, установленных в пункте 4.2. настоящей Политики; отказывать в предоставлении персональных данных в случаях, предусмотренных законодательством; использовать обезличенные данные Пользователей с соблюдением требований к обезличиванию и хранению персональных данных; осуществлять иные полномочия, предусмотренные законодательством.\n' +
        '## 6. Согласие Пользователя на обработку персональных данных\n' +
        '6.1. Пользователь выражает своё согласие на обработку ООО «Дымов. Керамика» персональных данных в порядке и на условиях, предусмотренных настоящей Политикой.\n' +
        '6.2. Пользователь выражает своё согласие на обработку персональных данных с момента предоставления Пользователем персональных данных для пользования Сервисами, предусматривающими предоставление Пользователями персональных данных, в том числе при оформлении записи на мастер-класс или экскурсию.\n' +
        '6.3. Осуществляя действия, предусмотренные в пункте 6.2. настоящей Политики, Пользователь выражает своё безусловное согласие с порядком и условиями обработки его персональных данных на условиях, установленных настоящей Политикой. В случае несогласия Пользователя с условиями, предусмотренными настоящей Политикой, Пользователь не вправе использовать отдельные Сервисы, предусматривающие необходимость предоставления им персональных данных.\n' +
        '## 7. Обеспечение безопасности персональных данных\n' +
        '7.1. При обработке персональных данных ООО «Дымов. Керамика» обязано принимать необходимые правовые, организационные и технические меры и обеспечивает их принятие для защиты персональных данных от неправомерного или случайного доступа к ним, уничтожения, изменения, блокирования, копирования, предоставления, распространения персональных данных, а также от иных неправомерных действий в отношении персональных данных.\n' +
        '## 8. Заключительные положения\n' +
        '8.1. Настоящая Политика является внутренним документом ООО «Дымов. Керамика» и доступна Пользователю на Веб-сайте.\n' +
        '8.2. Настоящая Политика подлежит изменению, дополнению в случае появления новых законодательных актов и специальных нормативных актов по обработке и защите персональных данных, а также в иных случаях по решению ООО «Дымов. Керамика».\n' +
        '8.3. Контроль исполнения требований настоящей Политики осуществляется лицом, ответственным за организацию обработки персональных данных в ООО «Дымов. Керамика».\n' +
        '8.4. Ответственность работников ООО «Дымов. Керамика», осуществляющих обработку персональных данных и имеющих право доступа к ним, за невыполнение требований норм, регулирующих обработку и защиту персональных данных, определяется в соответствии с законодательством Российской Федерации.\n' +
        '8.5. ООО «Дымов. Керамика» не проверяет полноту и достоверность предоставленных Пользователями персональных данных, однако исходит из того, что указанные данные являются достоверными и предоставлены самим Пользователем, при этом Пользователь обладает полной дееспособностью и предоставляет эти данные самостоятельно, действуя при этом в своём интересе.',
    },
  },
  {
    key: 'suzdal-cookies',
    title: 'Суздаль — политика cookie',
    city: 'suzdal',
    status: 'ready',
    path: '/suzdal/cookies',
    fields: [
      { key: 'metaTitle', label: 'Title (для поисковиков)', type: 'text' },
      { key: 'metaDescription', label: 'Description (для поисковиков)', type: 'textarea' },
      { key: 'h1', label: 'Заголовок H1', type: 'text' },
      { key: 'documentText', label: 'Текст документа (## заголовок раздела, - пункт списка, обычная строка — абзац)', type: 'textarea' },
    ],
    defaults: {
      metaTitle: 'Политика использования файлов cookie | Дымов Керамика в Суздале',
      metaDescription:
        'Политика использования файлов cookie на сайте фабрики и школы керамики «Дымов Керамика» в Суздале.',
      h1: 'Политика использования файлов cookie',
      documentText:
        'Настоящая Политика использования файлов cookie регулирует порядок использования файлов cookie и аналогичных технологий на сайте https://dymovceramicschool.ru/suzdal, принадлежащем ООО «Дымов. Керамика». Использование файлов cookie тесно связано с обработкой персональных данных. Более подробную информацию о том, как и зачем мы обрабатываем ваши персональные данные, вы можете найти в нашей Политике конфиденциальности.\n' +
        '## Что такое cookie?\n' +
        'Файлы cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве (компьютере, смартфоне, планшете) при посещении веб-сайтов. Они позволяют сайту запоминать ваши действия и настройки (например, язык, размер шрифта, регион и др.) на определённый период, чтобы вам не приходилось вводить их повторно при каждом посещении.\n' +
        '## Какие cookie мы используем?\n' +
        'На нашем Сайте используются следующие категории файлов cookie:\n' +
        '1. Обязательные (технически необходимые) cookie. Обеспечивают базовую функциональность сайта: работу контактных форм, авторизацию, безопасность и сохранение сессии. Эти файлы устанавливаются автоматически и не требуют вашего согласия. Отказ от них сделает сайт частично или полностью неработоспособным.\n' +
        '2. Аналитические cookie. Используются для сбора статистики о посещениях сайта с помощью сервиса Яндекс.Метрика — данные хранятся на серверах в Российской Федерации. Эти cookie помогают нам анализировать поведение пользователей, улучшать структуру сайта и качество услуг. IP-адреса обезличиваются.\n' +
        '## Сторонние сервисы\n' +
        'Мы используем аналитические инструменты третьих лиц, которые могут устанавливать собственные cookie. Мы не контролируем их политику, но требуем соблюдения норм защиты данных.\n' +
        '## Управление cookie\n' +
        'При первом посещении сайта вы увидите баннер согласия на cookie, где сможете:\n' +
        '- принять все cookie;\n' +
        '- выбрать категории (например, разрешить только обязательные);\n' +
        '- отклонить аналитические cookie.\n' +
        '## Ваши возможности\n' +
        'Вы также можете в любой момент:\n' +
        '- изменить настройки согласия через баннер (если он остаётся доступным);\n' +
        '- удалить cookie вручную через настройки браузера;\n' +
        '- отключить сохранение новых cookie.\n' +
        'Важно: отказ от аналитических cookie не повлияет на основную функциональность сайта.\n' +
        '## Изменения в Политике\n' +
        'Мы оставляем за собой право вносить изменения в настоящую Политику. Актуальная версия всегда размещается на данной странице с указанием даты обновления.\n' +
        '## Контакты\n' +
        'По всем вопросам, связанным с использованием cookie или обработкой персональных данных, вы можете обратиться к нам:\n' +
        'Электронная почта: mk@dymovceramicschool.ru\n' +
        'Телефон: +7 (915) 157-64-85',
    },
  },
];

export const getPageSchema = (key: string) => PAGE_SCHEMAS.find((p) => p.key === key);