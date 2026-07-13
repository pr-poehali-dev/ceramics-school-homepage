import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import { usePageMeta } from '@/hooks/usePageMeta';

interface SuzdalWorkshopData {
  slug: string;
  sku: string;
  badgeIcon: string;
  title: string;
  subtitle: string;
  img: string;
  price: number;
  age: string;
  duration: string;
  paragraphs: string[];
  extraServices: { title: string; price: string }[];
}

export const SUZDAL_WORKSHOP_DETAILS: Record<string, SuzdalWorkshopData> = {
  'goncharnoe-remeslo': {
    slug: 'goncharnoe-remeslo',
    sku: 'СУЗ-0001-Р',
    badgeIcon: 'Disc3',
    title: 'Гончарное ремесло',
    subtitle:
      'Гончарное дело — это настоящее волшебство! Глина в руках человека, из обычного комочка, способна превращаться в удивительные по своей красоте и гармонии изделия.',
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/f1276934-81b2-4761-a942-5591d7f8e338.jpg',
    price: 3000,
    age: 'Дети с 7 лет и взрослые',
    duration: '1 час',
    paragraphs: [
      'Во время мастер-класса вы узнаете основные приёмы получения формы на гончарном круге, и освоите азы работы с глиной, а так же сможете выкрутить от одного до трёх изделий из красной глины (чашка, салатник, горшочек).',
      'Продолжительность занятия 45–60 минут, включая краткий экскурсионный рассказ и организационные вопросы.',
      'В стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.',
      'После завершения мастер-класса рекомендуется воспользоваться дополнительными услугами и оставить изделия в мастерской, где их ждёт покрытие бесцветной глазурью и обжиг.',
    ],
    extraServices: [{ title: 'Обжиг', price: '180 руб. / изделие' }],
  },
  'goncharnoe-remeslo-rospis-angobami': {
    slug: 'goncharnoe-remeslo-rospis-angobami',
    sku: 'СУЗ-0002-Р',
    badgeIcon: 'Palette',
    title: 'Гончарное ремесло и роспись ангобами',
    subtitle:
      'Гончарное дело — это настоящее волшебство! Глина в руках человека, из обычного комочка, способна превращаться в удивительные по своей красоте и гармонии изделия.',
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/a105ba85-0ace-4ad3-ab39-4441a2d4bcc6.jpg',
    price: 3650,
    age: 'Дети с 7 лет и взрослые',
    duration: '1,5 часа',
    paragraphs: [
      'На мастер-классе вы сможете не только изготовить изделие своими руками, но и расписать его ангобами.',
      'Ангоб — это специальная подглазурная краска по керамике, которая состоит из глины и цветных пигментов. В отличие от глазурей, эта краска очень экологичная, ей могут пользоваться даже дети.',
      'Во время мастер-класса вы узнаете основные приёмы получения формы на гончарном круге, и освоите азы работы с глиной, а так же сможете выкрутить от одного до двух изделий из красной глины (чашка, салатник, горшочек), которое можно украсить ангобами по своему вкусу.',
      'Продолжительность занятия 60–90 минут (в зависимости от количества участников), включая краткий экскурсионный рассказ и организационные вопросы.',
      'В стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.',
      'В стоимость занятия покрытие бесцветной глазурью и обжиг — не входят.',
      'Если вы хотите получить полностью готовое изделие, которое можно использовать в интерьере своего дома, вам необходимо воспользоваться дополнительными услугами и оставить изделие на глазурованный обжиг.',
    ],
    extraServices: [{ title: 'Обжиг', price: '200 руб. / изделие' }],
  },
  'rospis-keramicheskix-tarelok': {
    slug: 'rospis-keramicheskix-tarelok',
    sku: 'СУЗ-0003-Р',
    badgeIcon: 'Brush',
    title: 'Роспись керамических тарелок',
    subtitle:
      'Хотите попробовать себя в роли художника и творца прекрасного? Даже если вы никогда не брали в руки кисть и вам кажется, что это очень сложно, мы на практике покажем, что можно с первого занятия получать удовольствие, как от процесса, так и от результата.',
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/3ebbf82b-af86-48c7-bd4b-568d71bea10f.jpg',
    price: 2300,
    age: 'Дети с 3 лет и взрослые',
    duration: '1 час',
    paragraphs: [
      'Расписанная вручную керамическая тарелка станет отличным подарком для родных и близких, памятным сувениром о незабываемом путешествии в Суздаль. На занятиях по росписи мы предлагаем для декорирования керамическую тарелку малой формы или утиль, который выберете.',
      'Мастер предложит выбрать тип росписи: роспись пигментами или роспись акриловыми красками.',
      'Можно использовать традиционную роспись кистями или разнообразить узор при помощи дополнительных материалов и принтов (губки, природные фактуры, кружево и т.д.). Мастер может продемонстрировать различные примеры орнаментов на выбор.',
      'Продолжительность занятия 45–60 минут, включая краткий экскурсионный рассказ и организационные вопросы.',
      'В стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.',
      'После завершения мастер-класса рекомендуется воспользоваться дополнительными услугами и оставить изделия в мастерской, где их ждёт покрытие бесцветной глазурью и обжиг.',
    ],
    extraServices: [{ title: 'Обжиг', price: '200 руб. / изделие' }],
  },
  'izgotovlenie-izrazcov': {
    slug: 'izgotovlenie-izrazcov',
    sku: 'СУЗ-0004-Р',
    badgeIcon: 'LayoutGrid',
    title: 'Изготовление изразцов',
    subtitle:
      'Изразец — это плитка из керамики, которая традиционно используется в декоре интерьеров, для облицовки печей, каминов, фасадов и т.д. В качестве декора на изразцах, как правило, присутствуют рельефные картинки и роспись. Изразцовые плитки известны на Руси с 9-го века, но особо популярны стали в 16–17 вв.',
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/2509f970-e5ac-4b63-be09-6600e954392d.jpg',
    price: 2450,
    age: 'Дети с 7 лет и взрослые',
    duration: '1 час',
    paragraphs: [
      'На мастер-классе по изготовлению изразцовых плит, вы сможете изготовить изразец своими руками. Полностью готовое изделие можно использовать при декорировании своего дома — украсив стену, печь или камин, тем самым превратив свой интерьер в единственный и неповторимый!',
      'Мастер-класс будет интересен и взрослым и детям! Работа не сложная, но кропотливая и очень увлекательная!',
      'Так же вы научитесь работать со специальными гипсовыми формами, каждая из которых имеет свой уникальный рисунок. В такие формы аккуратно закладывается — отминается, глина и создаётся декоративный рельеф.',
      'За один мастер-класс вы сможете изготовить до 2-х изразцовых плиток.',
      'Продолжительность занятия 45–60 минут, включая краткий экскурсионный рассказ и организационные вопросы.',
      'В стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.',
      'После завершения мастер-класса рекомендуется воспользоваться дополнительными услугами и оставить изделия в мастерской, где их ждёт покрытие бесцветной глазурью и обжиг.',
    ],
    extraServices: [{ title: 'Обжиг', price: '200 руб. / изделие' }],
  },
  'izgotovlenie-izrazczov-rospis-angobami': {
    slug: 'izgotovlenie-izrazczov-rospis-angobami',
    sku: 'СУЗ-0005-Р',
    badgeIcon: 'LayoutGrid',
    title: 'Изготовление изразцов и роспись ангобами',
    subtitle:
      'Изразец — это плитка из керамики, которая традиционно используется в декоре интерьеров, для облицовки печей, каминов, фасадов и т.д. В качестве декора на изразцах, как правило, присутствуют рельефные картинки и роспись.',
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/5ed56727-04b1-4e8e-a4e7-56712723a813.jpg',
    price: 3250,
    age: 'Дети с 7 лет и взрослые',
    duration: '1,5 часа',
    paragraphs: [
      'На мастер-классе вы сможете не только изготовить изразец своими руками, но и расписать его ангобами.',
      'Ангоб — это специальная подглазурная краска по керамике, которая состоит из глины и цветных пигментов. В отличие от глазурей, эта краска очень экологичная, ей могут пользоваться даже дети.',
      'За одно занятие вы научитесь работать со специальными гипсовыми формами, каждая из которых имеет свой уникальный рисунок. В такие формы аккуратно закладывается (отминается) глина и создаётся декоративный рельеф, который можно украсить ангобами по своему вкусу.',
      'Мастер-класс будет интересен и взрослым и детям! Работа не сложная, но кропотливая и очень увлекательная!',
      'Продолжительность занятия 60–90 минут (в зависимости от количества участников), включая краткий экскурсионный рассказ и организационные вопросы.',
      'В стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.',
      'В стоимость занятия покрытие бесцветной глазурью и обжиг — не входят.',
      'Если вы хотите получить полностью готовое изделие, которое можно использовать в интерьере своего дома, вам необходимо воспользоваться дополнительными услугами и оставить изделие на глазурованный обжиг.',
    ],
    extraServices: [{ title: 'Обжиг', price: '200 руб. / изделие' }],
  },
  'kruzhevnaya-keramika': {
    slug: 'kruzhevnaya-keramika',
    sku: 'СУЗ-0006-Р',
    badgeIcon: 'Flower2',
    title: 'Кружевная керамика',
    subtitle: 'Изготовление керамической кружевной тарелки.',
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/2f872373-81e5-4152-a08e-1006706e22d2.jpg',
    price: 2800,
    age: 'Дети с 7 лет и взрослые',
    duration: '1 час',
    paragraphs: [
      'Изготовление керамической кружевной тарелки состоит из трёх этапов.',
      'На мастер-классе мы проходим два этапа.',
      'Первый этап — подготовительный. Способом ручной отминки глины в гипсовой форме изготавливаются тарелки.',
      'Второй этап — творческий. С помощью различных кружев, применяя безграничную фантазию, вы декорируете тарелочку. Одним словом создаёте авторское, почти дизайнерское изделие.',
      'Заключительный этап: изделие ждёт покрытие цветной глазурью и обжиг.',
      'Продолжительность занятия 45–60 минут, включая краткий экскурсионный рассказ и организационные вопросы.',
      'В стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.',
      'После завершения мастер-класса рекомендуется воспользоваться дополнительными услугами и оставить изделия в мастерской, где их ждёт покрытие бесцветной глазурью и обжиг.',
    ],
    extraServices: [{ title: 'Обжиг', price: '200 руб. / изделие' }],
  },
  'lepka-keramicheskih': {
    slug: 'lepka-keramicheskih',
    sku: 'СУЗ-0008-Р',
    badgeIcon: 'Hand',
    title: 'Лепка керамических изделий',
    subtitle: 'Глина очень благодарный материал — она пластична, податлива, послушна человеческим рукам.',
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/2fa9a608-118d-44b1-a594-cf35b732aa30.jpg',
    price: 2770,
    age: 'Дети с 3 лет и взрослые',
    duration: '1 час',
    paragraphs: [
      'Лепка из глины — прекрасный способ отдохнуть душой, отключиться от каждодневных проблем, изменить свою жизнь, впустив в неё творчество. Возможности ручной лепки безграничны: предметы декора, животные, украшения, тарелки, посуда, и многое другое.',
      'На мастер-классе вы получите бесценный опыт, узнаете способы изготовления различных изделий из глины, освоите одну из техник ручной лепки (жгутовая лепка, лепка из кома, лепка из пластов).',
      'Работа с глиной развивает образно-ассоциативное мышление, воображение, мелкую моторику рук. К тому же, сувениры и подарки на любой праздник, выполненные своими руками в виде малых скульптур, всегда более ценны и производят большее впечатление, чем фабричные изделия.',
      'Если вы давно мечтаете работать с глиной, не стоит это откладывать! Обязательно запишитесь к нам на мастер-класс! Попробуйте себя в этом замысловатом деле, и, возможно, очень скоро маленький кусочек глины в ваших руках превратится в шедевр!',
      'Продолжительность занятия 45–60 минут, включая краткий экскурсионный рассказ и организационные вопросы.',
      'В стоимость мастер-класса входят затраты на материалы, инструменты и необходимые приспособления.',
      'После завершения мастер-класса рекомендуется воспользоваться дополнительными услугами и оставить изделия в мастерской, где их ждёт покрытие бесцветной глазурью и обжиг.',
    ],
    extraServices: [{ title: 'Обжиг', price: '200 руб. / изделие' }],
  },
};

const SuzdalWorkshopDetail = () => {
  const { slug } = useParams();
  const data = slug ? SUZDAL_WORKSHOP_DETAILS[slug] : undefined;
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  usePageMeta({
    title: data
      ? `${data.title} — мастер-класс в Суздале | «Дымов Керамика»`
      : 'Мастер-классы «Дымов Керамика» в Суздале',
    description: data?.subtitle || 'Мастер-классы по керамике на фабрике «Дымов Керамика» в Суздале.',
  });

  if (!data) {
    return <Navigate to="/suzdal/workshops" replace />;
  }

  const handleAddToCart = () => {
    addItem({
      id: `suzdal-${data.slug}`,
      title: data.title,
      details: `Билет «Разовый» · ${data.sku}`,
      price: data.price,
      qty,
    });
    toast({
      title: 'Добавлено в корзину',
      description: `${data.title} × ${qty} шт.`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader active="/suzdal/workshops" />

      <div className="container py-10 md:py-14">
        {/* BACK */}
        <Link
          to="/suzdal/workshops"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <Icon name="ArrowLeft" size={16} /> Назад к мастер-классам
        </Link>

        {/* HERO */}
        <div className="relative mt-8 animate-scale-in overflow-hidden rounded-[2rem] shadow-xl">
          <img
            src={data.img}
            alt={data.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/25" />

          <div className="relative flex min-h-[26rem] flex-col justify-end p-7 text-white md:min-h-[32rem] md:p-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              <Icon name={data.badgeIcon} size={16} /> Мастер-класс · {data.sku}
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-tight md:text-6xl">
              {data.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/85 md:text-xl">{data.subtitle}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                <Icon name="Tag" size={16} /> {data.price.toLocaleString('ru-RU')} руб.
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                <Icon name="Clock" size={16} /> {data.duration}
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                <Icon name="Star" size={16} /> {data.age}
              </span>
            </div>
          </div>
        </div>

        {/* DESCRIPTION + ORDER */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          {/* DESCRIPTION */}
          <div className="rounded-2xl border border-border bg-card p-7 md:p-10">
            <h2 className="flex items-center gap-3 font-display text-2xl font-semibold">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name="Info" size={20} />
              </span>
              О мастер-классе
            </h2>

            <div className="mt-6 space-y-4">
              {data.paragraphs.map((p, i) => (
                <p key={i} className="leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>

            {/* EXTRA SERVICES */}
            <div className="mt-8 rounded-2xl border border-border/60 bg-secondary/40 p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Icon name="Wrench" size={18} className="text-primary" /> Дополнительные услуги
              </h3>
              <ul className="mt-3 space-y-1.5">
                {data.extraServices.map((s) => (
                  <li key={s.title} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{s.title}</span>
                    <span className="font-semibold text-foreground">{s.price}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-muted-foreground">
                Выполнение дополнительных услуг занимает (в зависимости от вида и размера изделия)
                от 60 дней.
              </p>
            </div>

            {/* PICKUP INFO */}
            <div className="mt-6 rounded-2xl border border-border/60 bg-secondary/40 p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Icon name="PackageCheck" size={18} className="text-primary" /> Готовое изделие
                можно получить
              </h3>
              <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <Icon name="MapPin" size={16} className="mt-0.5 shrink-0 text-primary" />
                  <span>
                    В мастерской «Дымов Керамика» в Москве на ВДНХ, Проспект Мира, д. 119, стр.
                    186, пн–пт с 11:00 до 19:00 (бесплатная доставка), контактный телефон{' '}
                    <a href="tel:+74955000171" className="font-medium text-foreground hover:text-primary">
                      +7 (495) 500-01-71
                    </a>
                    .
                  </span>
                </li>
                <li className="flex gap-2">
                  <Icon name="Truck" size={16} className="mt-0.5 shrink-0 text-primary" />
                  <span>
                    Воспользовавшись услугами транспортной компании. Отправка осуществляется за счёт
                    получателя (клиента).
                  </span>
                </li>
              </ul>
              <p className="mt-3 text-sm text-muted-foreground">
                Как только ваши изделия доставят в Москву из Суздаля (в течение 60 дней), вы будете
                оповещены по телефону.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Готовые изделия хранятся в мастерской ВДНХ 2 месяца с момента доставки. По истечении
                этого срока мы оставляем за собой право утилизовать их, либо передать на
                благотворительную ярмарку. Не забывайте забирать свои работы!
              </p>
            </div>
          </div>

          {/* ORDER CARD */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
              <p className="text-sm font-semibold text-foreground">Билет: Разовый</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Количество</span>
                <div className="flex items-center rounded-full border border-border bg-card">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                    aria-label="Уменьшить"
                  >
                    <Icon name="Minus" size={15} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                    aria-label="Увеличить"
                  >
                    <Icon name="Plus" size={15} />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="text-sm font-semibold text-foreground">Стоимость</span>
                <span className="font-display text-2xl font-semibold text-primary">
                  {(data.price * qty).toLocaleString('ru-RU')} руб.
                </span>
              </div>

              <Button onClick={handleAddToCart} className="mt-5 w-full rounded-full">
                <Icon name="ShoppingCart" size={16} className="mr-2" /> Добавить в корзину
              </Button>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/15 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/30 text-primary">
                <Icon name="Phone" size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Запись по телефону</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Запись на мастер-классы только по телефону{' '}
                  <a href="tel:+79151576485" className="font-medium text-foreground hover:text-primary">
                    8-915-157-64-85
                  </a>
                  . Оплата на месте картой или наличными.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-secondary/40 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name="Baby" size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Возраст участников</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Рассчитан для детей с 7 лет и взрослых. Продолжительность занятия — 1 час.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default SuzdalWorkshopDetail;