import { Link, useParams, Navigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import UtilBlock from '@/pages/workshop-detail/UtilBlock';
import AskQuestionDialog from '@/components/AskQuestionDialog';
import { openBooking } from '@/lib/booking';
import { usePageMeta } from '@/hooks/usePageMeta';

const WORKSHOP_META: Record<string, { title: string; description: string }> = {
  krug: {
    title: 'Мастер-класс на гончарном круге в «Дымов Керамика», Москва',
    description:
      'Мастер-класс лепки на гончарном круге для детей и взрослых на ВДНХ в Москве. Действуют скидки для пенсионеров и многодетных семей. Запишитесь онлайн!',
  },
  lepka: {
    title: 'Мастер-класс "Лепка" в гончарной школе «Дымов Керамика» в Москве',
    description:
      'Мастер-класс по лепке из глины для детей и взрослых на ВДНХ. Школа лепки из глины в Москве. Действуют скидки для пенсионеров и многодетных семей.',
  },
  angoby: {
    title: 'Мастер-класс «Роспись ангобами» в «Дымов Керамика», Москва',
    description:
      'Ручная роспись керамических тарелок и изделий из глины для детей и взрослых на ВДНХ. Действуют скидки для пенсионеров и многодетных семей.',
  },
  akril: {
    title: 'Мастер-класс «Роспись акрилом» в «Дымов Керамика», Москва',
    description:
      'Роспись акрилом керамических тарелок и изделий из глины для детей и взрослых на ВДНХ. Скидки для пенсионеров и многодетных семей. Запись онлайн!',
  },
};

interface WorkshopData {
  slug: string;
  badgeIcon: string;
  title: string;
  subtitle: string;
  img: string;
  stats: { icon: string; text: string }[];
  paragraphs: string[];
  benefit?: string | null;
}

export const WORKSHOP_DETAILS: Record<string, WorkshopData> = {
  lepka: {
    slug: 'lepka',
    badgeIcon: 'Hand',
    title: 'Лепка из глины',
    subtitle: 'Освойте разные техники ручной лепки и создайте изделие своими руками за 1 час.',
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/031d0b25-5ce6-4c27-8e82-d33ec3b0b178.png',
    stats: [
      { icon: 'Tag', text: '2 900 ₽' },
      { icon: 'Clock', text: '1 час' },
      { icon: 'Star', text: 'Возраст 3+' },
      { icon: 'Percent', text: 'Льготникам скидка' },
    ],
    paragraphs: [
      'На мастер-классах вы можете освоить разные техники лепки из красной глины или глины шамот. Создадите изделия простейших скульптурных форм, возможна лепка из пласта, работа жгутами или отминка в специальных гипсовых формах изразцов, посуды.',
      'Изразец — плитка, которая традиционно используется в декоре интерьеров, для облицовки печей, каминов. В такие формы аккуратно закладывается — отминается глина и создаётся декоративный рельеф.',
      'Ручная лепка зачастую проще, чем работа на гончарном круге, поэтому этот мастер-класс очень популярен среди родителей с детьми и начинающих керамистов. В зависимости от масштаба задумки за час занятия ученик успевает сделать 1–2 изделия. Возможности ручной лепки безграничны: предметы декора, украшения, тарелки, посуда, кухонная утварь и многое другое.',
      'Вы сможете озвучить свои идеи, а мастер предложит различные варианты и техники выполнения. Также есть возможность декорировать авторское керамическое изделие различными штампами: деревянными заготовками, природными материалами, кружевом и так далее.',
      'После завершения мастер-класса все изделия остаются в мастерской на просушку и последующий обжиг. Через 2 недели, по желанию, можно будет приступить к росписи вашего изделия в рамках соответствующего мастер-класса.',
      'Мастер-классы по лепке в детской группе (от 3 до 7 лет) проходят по выходным и праздничным дням. Длительность 1 час. Стоимость 1 900 руб. По предварительной записи по телефону, возможна оплата на сайте или в школе картой или наличными.',
    ],
    benefit: 'Дети до 7 лет на мастер-классах присутствуют в сопровождении взрослых.',
  },
  krug: {
    slug: 'krug',
    badgeIcon: 'Disc3',
    title: 'Гончарный круг',
    subtitle: 'Освойте азы гончарного ремесла и создайте изделие своими руками за 1 час.',
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/ab36a67f-4ea0-4d3a-8ebe-21e8a9dfb891.png',
    stats: [
      { icon: 'Tag', text: '2 900 ₽' },
      { icon: 'Clock', text: '1 час' },
      { icon: 'Star', text: 'Возраст 7+' },
      { icon: 'Percent', text: 'Льготникам скидка' },
    ],
    paragraphs: [
      'Во время мастер-класса вы освоите азы гончарного ремесла. Узнаете, как правильно подготовить глину к работе, как центровать её на гончарном круге для создания симметричной формы, и овладеете секретами создания готовых изделий с помощью одного из древнейших ремёсел.',
      'Вместе с мастером-гончаром вы выполните изделие, используя красную глину. Также занятие включает в себя лепку декоративных элементов: ручек или рельефных украшений.',
      'После завершения мастер-класса все изделия остаются в мастерской на просушку и последующий обжиг. Через 2 недели, по желанию, можно будет приступить к росписи вашего изделия в рамках соответствующего мастер-класса.',
    ],
    benefit: 'Дети до 7 лет на мастер-классах присутствуют в сопровождении взрослых.',
  },
  angoby: {
    slug: 'angoby',
    badgeIcon: 'Palette',
    title: 'Роспись ангобами',
    subtitle: 'Красочно и сочно распишите керамику экологичной подглазурной краской.',
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/7f664b40-fac2-4114-b0ad-70fc8524f908.png',
    stats: [
      { icon: 'Tag', text: '2 100 ₽' },
      { icon: 'Clock', text: '1 час' },
      { icon: 'Star', text: 'Возраст 3+' },
      { icon: 'Percent', text: 'Льготникам скидка' },
    ],
    paragraphs: [
      'На занятиях по росписи мы предлагаем для декорирования готовые изделия малого размера на выбор или предметы, которые вы создали ранее в нашей мастерской на занятиях по гончарному ремеслу или лепке.',
      'На мастер-классе по росписи ангобами вы сможете красочно и сочно расписать изделие по своему вкусу. Ангоб — это специальная подглазурная краска по керамике, которая состоит из глины и цветных пигментов. Эта краска очень экологичная, ею могут пользоваться даже дети.',
      'Можно использовать традиционную роспись кистями или разнообразить узор при помощи дополнительных материалов и принтов (губки, природные фактуры, кружево и т.д.). Вы можете озвучить мастеру свои идеи, и он поможет выбрать наилучший вариант их воплощения в керамике.',
      'После завершения мастер-класса изделие остаётся в мастерской на просушку и последующий обжиг, после чего вы сможете его забрать.',
      'Мастер-классы по росписи ангобами в детской группе (от 4 до 7 лет) проходят по выходным и праздничным дням. Длительность 1 час. Стоимость 1 900 руб. По предварительной записи по телефону, возможна оплата на сайте или в школе картой или наличными.',
    ],
    benefit: 'Дети до 7 лет на мастер-классах присутствуют в сопровождении взрослых.',
  },
  akril: {
    slug: 'akril',
    badgeIcon: 'Brush',
    title: 'Роспись акрилом',
    subtitle: 'Попробуйте себя в роли художника — забирайте готовое изделие с собой сразу.',
    img: 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/0bce1c46-ce6d-45d4-9a78-fc97b423975d.jpg',
    stats: [
      { icon: 'Tag', text: '1 500 ₽' },
      { icon: 'Clock', text: '1 час' },
      { icon: 'Users', text: 'Группы от 10' },
      { icon: 'PackageCheck', text: 'Забрать через 10 мин' },
    ],
    paragraphs: [
      'Хотите попробовать себя в роли маленького художника и творца прекрасного? Даже если вы никогда не брали в руки кисть и вам кажется, что это очень сложно, мы на практике покажем, что можно с первого занятия получать удовольствие как от процесса, так и от результата.',
      'Расписанная вручную керамика станет не только отличным подарком для родных и близких, но и памятным сувениром о незабываемом мероприятии, которое вы посетили. На занятиях по росписи акрилом мы предлагаем для декорирования на выбор керамическую тарелку малой формы, декоративный гриб или изразец.',
      'Изделия уникальны. Их выпускает наш завод в Суздале по нашим эскизам специально для нашей школы.',
      'Стоимость мастер-класса по росписи акрилом составляет 1 500 рублей с участника с учётом изделия под роспись. Продолжительность мастер-класса — 1 час. Изделие можно забрать с собой уже через 10 минут после изготовления.',
    ],
    benefit: 'Группы от 10 участников. Изделие можно забрать с собой через 10 минут.',
  },
};

const WorkshopDetail = () => {
  const { slug } = useParams();
  const data = slug ? WORKSHOP_DETAILS[slug] : undefined;
  const meta = slug ? WORKSHOP_META[slug] : undefined;

  usePageMeta({
    title: meta?.title || 'Мастер-классы «Дымов Керамика» в Москве',
    description:
      meta?.description ||
      'Мастер-классы по керамике и гончарному делу для детей и взрослых в школе «Дымов Керамика» на ВДНХ.',
  });

  if (!data) {
    return <Navigate to="/moscow/workshops" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <SiteHeader active="/moscow/workshops" />

      <div className="container py-10 md:py-14">
        {/* BACK */}
        <Link
          to="/moscow/workshops"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <Icon name="ArrowLeft" size={16} /> Назад к услугам
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
              <Icon name={data.badgeIcon} size={16} /> Мастер-класс
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-tight md:text-6xl">
              {data.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/85 md:text-xl">{data.subtitle}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              {data.stats.map((s) => (
                <span
                  key={s.text}
                  className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur"
                >
                  <Icon name={s.icon} size={16} className="text-white" />
                  {s.text}
                </span>
              ))}
            </div>

            <Button size="lg" onClick={openBooking} className="mt-7 w-fit rounded-full px-10 text-base">
              <Icon name="CalendarCheck" size={18} className="mr-2" /> Записаться
            </Button>
          </div>
        </div>

        {/* DESCRIPTION + NOTES */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          {/* DESCRIPTION */}
          <div className="rounded-2xl border border-border bg-card p-7 md:p-10">
            <h2 className="flex items-center gap-3 font-display text-2xl font-semibold">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name="Info" size={20} />
              </span>
              О мастер-классе
            </h2>

            {/* Первый абзац — вводный, крупнее */}
            <p className="mt-5 text-lg leading-relaxed text-foreground/90 md:text-xl">
              {data.paragraphs[0]}
            </p>

            {/* Остальные абзацы */}
            {data.paragraphs.length > 1 && (
              <div className="mt-6 space-y-4 border-t border-border/60 pt-6">
                {data.paragraphs.slice(1).map((p, i) => (
                  <p key={i} className="leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* NOTES — правая колонка */}
          <div className="space-y-4 lg:sticky lg:top-24">
            {data.benefit && (
              <div className="flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/15 p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/30 text-primary">
                  <Icon name="Baby" size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Дети на мастер-классе</p>
                  <p className="mt-1 text-sm text-muted-foreground">{data.benefit}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-secondary/40 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name="Percent" size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Льготникам — скидка</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Социальная скидка для пенсионеров, студентов, именинников в день рождения, членов
                  многодетных семей и инвалидов всех групп. Не распространяется на мастер-класс
                  «Детская группа». Скидки не суммируются, действуют при предъявлении документа.
                </p>
              </div>
            </div>

            {/* Мини-CTA записаться */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center">
              <p className="text-sm font-semibold text-foreground">Готовы попробовать?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Запишитесь на удобное время — поможем с выбором.
              </p>
              <Button onClick={openBooking} className="mt-4 w-full rounded-full">
                <Icon name="CalendarCheck" size={16} className="mr-2" /> Записаться
              </Button>
            </div>
          </div>
        </div>

        {/* УТИЛЬ ДЛЯ РОСПИСИ */}
        {slug === 'angoby' && <UtilBlock />}

        {/* CTA BANNER */}
        <div className="relative mt-14 overflow-hidden rounded-[2rem] bg-primary px-8 py-12 text-center text-primary-foreground md:px-16">
          <Icon
            name={data.badgeIcon}
            size={200}
            className="pointer-events-none absolute -left-8 -top-8 opacity-10"
          />
          <div className="relative">
            <h3 className="font-display text-3xl font-semibold md:text-4xl">Остались вопросы?</h3>
            <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
              Поможем выбрать удобное время, уточним расписание и ответим на любые вопросы.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <a href="tel:+79854198903">
                <Button size="lg" variant="secondary" className="rounded-full px-8">
                  <Icon name="Phone" size={18} className="mr-2" /> Позвонить
                </Button>
              </a>
              <AskQuestionDialog>
                <Button size="lg" variant="secondary" className="rounded-full px-8">
                  <Icon name="Send" size={18} className="mr-2" /> Написать
                </Button>
              </AskQuestionDialog>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
};

export default WorkshopDetail;