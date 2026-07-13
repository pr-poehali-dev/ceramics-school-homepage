import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useCart } from '@/context/CartContext';
import { usePageMeta } from '@/hooks/usePageMeta';

const CERTIFICATE_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/858c5def-a2d9-4503-aef3-192e73b205e1.png';

const PRESETS = [
  { value: 1900, label: '1 900 ₽', popular: false },
  { value: 2100, label: '2 100 ₽', popular: false },
  { value: 2900, label: '2 900 ₽', popular: false },
  { value: 5000, label: '5 000 ₽', popular: true },
  { value: 7000, label: '7 000 ₽', popular: false },
  { value: 9000, label: '9 000 ₽', popular: false },
  { value: 10000, label: '10 000 ₽', popular: false },
  { value: 13000, label: '13 000 ₽', popular: false },
];


const Certificates = () => {
  usePageMeta({
    title: 'Сертификаты в гончарную мастерскую «Дымов Керамика» в Москве на ВДНХ',
    description:
      'Подарочные сертификаты на уроки гончарного мастерства. Сертификаты на гончарные мастер-классы для детей и взрослых в Москве.',
  });
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);

  const activeAmount = selected ?? 0;

  const handleAddToCart = () => {
    addItem({
      id: `certificate-${activeAmount}-${Date.now()}`,
      title: 'Подарочный сертификат «Дымов Керамика»',
      details: `Номинал ${formatNum(activeAmount)}`,
      price: activeAmount,
    });
    toast({
      title: 'Сертификат добавлен в корзину',
      description: 'Перейдите к оформлению, чтобы завершить покупку.',
    });
    navigate('/moscow/checkout');
  };

  const handlePreset = (val: number) => {
    setSelected(val);
  };

  const formatNum = (n: number) =>
    n.toLocaleString('ru-RU') + ' ₽';

  const canOrder = activeAmount >= 1000 && activeAmount <= 1000000;

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* HEADER */}
      <SiteHeader active="/moscow/certificates" />

      <div className="container py-12 md:py-16">
        {/* HERO BANNER */}
        <div className="animate-fade-in overflow-hidden rounded-[2rem] border border-border bg-card">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Icon name="Gift" size={16} /> Подарочные сертификаты
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
                Подарите впечатления,<br />
                <span className="text-primary italic">а не вещи</span>
              </h1>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">
                Сертификат на мастер-класс по керамике — подарок, который запомнится. Выберите
                готовый номинал или укажите свою сумму.
              </p>
            </div>
            <div className="relative flex h-full items-center justify-center p-8 md:justify-end md:p-12">
              <div className="pointer-events-none absolute inset-0 bg-accent/10" />
              <div className="relative animate-scale-in">
                <div className="absolute -inset-4 rounded-[2rem] bg-accent/20 blur-2xl" />
                <img
                  src={CERTIFICATE_IMG}
                  alt="Подарочный сертификат Дымов Керамика"
                  className="relative w-full max-w-sm rotate-2 rounded-2xl shadow-2xl ring-1 ring-border transition-transform duration-500 hover:rotate-0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          {/* CERTIFICATE PREVIEW */}
          <div className="animate-scale-in relative overflow-hidden rounded-[2rem] bg-primary px-10 py-12 text-primary-foreground shadow-2xl">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-white/5" />
            <div className="relative flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
                  Подарочный сертификат
                </p>
                <p className="mt-2 font-display text-2xl font-semibold md:text-3xl">
                  Дымов Керамика
                </p>
                <p className="mt-1 text-sm text-primary-foreground/70">
                  Студия керамики · ВДНХ, Москва
                </p>
              </div>
              <div className="mt-6 md:mt-0 md:text-right">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
                  Номинал
                </p>
                <p className="mt-1 font-display text-4xl font-semibold md:text-5xl">
                  {activeAmount >= 1000 ? formatNum(activeAmount) : '—'}
                </p>
              </div>
            </div>

            <div className="relative mt-8 border-t border-white/20 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                  <Icon name="Clock" size={15} /> Срок действия: 12 месяцев
                </div>
                <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                  <Icon name="Sparkles" size={15} /> Все мастер-классы студии
                </div>
              </div>
            </div>
          </div>

          {/* PRESET AMOUNTS */}
          <div className="mt-10">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Готовые номиналы
            </p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handlePreset(p.value)}
                  className={`relative rounded-xl border py-4 text-center text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    selected === p.value
                      ? 'border-primary bg-primary text-primary-foreground shadow-md'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                      Популярный
                    </span>
                  )}
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* PERKS */}
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { icon: 'Download', text: 'Отправим на e-mail сразу после оплаты' },
              { icon: 'CalendarDays', text: 'Действует 12 месяцев с момента покупки' },
              { icon: 'RefreshCcw', text: 'Можно использовать на любой мастер-класс' },
            ].map((p) => (
              <div key={p.text} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={p.icon} size={18} />
                </span>
                <p className="text-sm leading-snug text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Button
              size="lg"
              className="w-full rounded-xl py-6 text-base"
              disabled={!canOrder}
              onClick={handleAddToCart}
            >
              <Icon name="ShoppingBag" size={20} className="mr-2" />
              {canOrder
                ? `В корзину — ${formatNum(activeAmount)}`
                : 'Выберите номинал'}
            </Button>
            {!canOrder && activeAmount > 0 && (
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Укажите сумму от 1 000 до 1 000 000 ₽
              </p>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-3xl">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Частые вопросы</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="mt-8 space-y-4">
            {[
              {
                q: 'Как получить сертификат?',
                a: 'После оформления и оплаты сертификат придёт на вашу электронную почту в течение нескольких минут.',
              },
              {
                q: 'Можно ли использовать сертификат частями?',
                a: 'Да, сертификат можно использовать на несколько посещений, пока не закончится сумма. Срок действия при этом не продлевается.',
              },
              {
                q: 'Что если занятие стоит больше номинала?',
                a: 'Разницу можно доплатить на месте. Мы примем наличные или карту.',
              },
              {
                q: 'Можно ли вернуть сертификат?',
                a: 'Да, неиспользованный сертификат можно вернуть в течение 14 дней с момента покупки.',
              },
            ].map((item) => (
              <details key={item.q} className="group rounded-xl border border-border bg-card">
                <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-medium">
                  {item.q}
                  <Icon
                    name="ChevronDown"
                    size={18}
                    className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="border-t border-border px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* SEO TEXT */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            Подарочные сертификаты «Дымов Керамика»
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Школа гончарного мастерства «Дымов Керамика» предлагает вам порадовать своих близких
              оригинальным и запоминающимся подарком. Подарочный сертификат на уроки гончарного
              мастерства станет приятным сюрпризом даже для тех людей, которых, казалось бы, нечем
              удивить. Незабываемые часы, проведённые в гончарной мастерской, позволят зажечь огонь
              в глазах именинника, пробудить в нём интерес и творческий потенциал, здоровый азарт и
              детский восторг.
            </p>
            <p>
              Кроме того, сертификат «Дымов Керамика» даёт возможность не только интересно, но и
              полезно провести время. Работа с глиной — это, в первую очередь, отличный релакс,
              позволяющий отвлечься от будничных забот и проблем, успокоить нервную систему и
              развить творческие способности. К тому же, лепка и работа с гончарным кругом тренирует
              мелкую моторику рук, координацию движений и способность концентрировать своё внимание
              (что полезно и детям, и взрослым).
            </p>

            <h3 className="pt-4 font-display text-2xl font-semibold text-foreground">
              Что представляет собой подарочный сертификат по гончарному делу?
            </h3>
            <p>
              Подарочный сертификат «Дымов Керамика» — это интересный и необычный подарок на все
              случаи жизни. Такой презент приятно удивит именинника своей оригинальностью и не
              банальностью, а также подчеркнёт хороший вкус дарителя. Немаловажно и то, что подарку
              будут рады как взрослые, так и дети (у нас есть программы и для малышей от 4 лет, и для
              школьников младших, средних или старших классов).
            </p>
            <p>
              Сертификат представляет собой своеобразный пропуск в мир гончарного искусства.
            </p>
            <p>В соответствии с выбранным направлением, можно будет:</p>
            <ul className="space-y-2">
              {[
                'лепить из глины причудливые изделия (фигурки, украшения, элементы декора и т. д.);',
                'создавать на гончарном круге уникальную посуду или авторские вазы;',
                'штамповать необыкновенные изразцы;',
                'украшать свои творения волшебной росписью.',
              ].map((li) => (
                <li key={li} className="flex gap-2">
                  <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-primary" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
            <p>
              Сертификат может быть использован как для занятий в группе, так и для закрытых,
              индивидуальных мероприятий. К примеру, сертификат может стать прекрасным подарком для
              влюблённых, которые проведут в нашей мастерской незабываемое свидание в атмосфере
              творчества, романтики и уединения.
            </p>

            <h3 className="pt-4 font-display text-2xl font-semibold text-foreground">
              Какими бывают подарочные сертификаты «Дымов Керамика»?
            </h3>
            <p>
              Подарочные сертификаты «Дымов Керамика» действительны в течение года с момента продажи
              и открывают для своего владельца удивительные возможности. Вы можете порадовать
              именинника сертификатом на участие в определённом мастер-классе (на ваш выбор) или
              предоставить дорогому вам человеку право самому выбрать направление для творчества.
              Сертификаты с открытой суммой позволяют своему счастливому обладателю участвовать в
              нескольких мастер-классах или посещать те занятия, которые ему наиболее интересны.
            </p>
            <p>Так, к примеру, вы сможете приобрести следующие сертификаты «Дымов Керамика»:</p>
            <ul className="space-y-2">
              {[
                'сертификаты на обучение в гончарной мастерской (гончарные курсы для детей и взрослых);',
                'сертификаты на прохождение выбранных мастер-классов (таких, как «Гончарный круг», «Лепка», «Роспись» и многих других);',
                'сертификаты на индивидуальные занятия в гончарной мастерской (в том числе романтические свидания);',
                'сертификаты на проведение праздников и закрытых мероприятий (взрослых или детских дней рождения, корпоративов, девичников, занятий для группы детского сада или школьного класса и т. д.).',
              ].map((li) => (
                <li key={li} className="flex gap-2">
                  <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-primary" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
            <p>
              Уточнить стоимость интересующего вас мастер-класса или задать другие вопросы,
              касающиеся сертификатов, вы можете по телефону{' '}
              <a
                href="tel:+79854198903"
                className="font-semibold text-primary transition-colors hover:underline"
              >
                +7 (985) 419-89-03
              </a>
              .
            </p>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
};

export default Certificates;