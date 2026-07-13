import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { ALL_FORMATS, PEOPLE_OPTIONS } from './formats/formatsData';
import FormatsFilters from './formats/FormatsFilters';
import FormatsResults from './formats/FormatsResults';
import FormatsCta from './formats/FormatsCta';
import { usePageMeta } from '@/hooks/usePageMeta';

const Formats = () => {
  usePageMeta({
    title: 'Форматы мастер-классов в «Дымов Керамика» | Выбрать занятие на ВДНХ',
    description:
      'Выберите формат мастер-класса по керамике в студии на ВДНХ: классические, детские, тематические, свидания, выездные. Подберём вариант под любой возраст и бюджет',
  });
  const [searchParams] = useSearchParams();
  const openAction = searchParams.get('open');
  const showSlug = searchParams.get('show');
  const [ageFilter, setAgeFilter] = useState<string | null>(null);
  const [dayFilter, setDayFilter] = useState<string>('any');
  const [durationFilter, setDurationFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>('any');
  const [peopleFilter, setPeopleFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!showSlug) return;
    const format = ALL_FORMATS.find((f) => f.slug === showSlug);
    if (!format) return;
    setExpanded(format.title);
    const timer = setTimeout(() => {
      document
        .getElementById(`format-${showSlug}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
    return () => clearTimeout(timer);
  }, [showSlug]);

  const reset = () => {
    setAgeFilter(null);
    setDayFilter('any');
    setDurationFilter(null);
    setLocationFilter('any');
    setPeopleFilter(null);
  };

  const results = useMemo(() => {
    return ALL_FORMATS.filter((f) => {
      if (ageFilter) {
        const minAge = parseInt(ageFilter);
        if (f.ageMin < minAge) return false;
      }
      if (dayFilter !== 'any' && f.daysKey !== dayFilter && f.daysKey !== 'any') return false;
      if (durationFilter && f.durationKey !== durationFilter) return false;
      if (locationFilter !== 'any' && f.location !== locationFilter && f.location !== 'both') return false;
      if (peopleFilter) {
        const opt = PEOPLE_OPTIONS.find((o) => o.value === peopleFilter);
        if (opt && (f.peopleMax < opt.min || f.peopleMin > opt.max)) return false;
      }
      return true;
    });
  }, [ageFilter, dayFilter, durationFilter, locationFilter, peopleFilter]);

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader active="/moscow/formats" />

      <div className="container py-12 md:py-16">
        {/* PAGE TITLE */}
        <div className="animate-fade-in text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="LayoutGrid" size={16} /> Форматы занятий
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold md:text-6xl">
            Выберите подходящий <span className="text-primary italic">формат</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Фильтруйте по времени, возрасту и месту — найдите идеальный вариант для себя.
          </p>
        </div>

        {/* FILTERS */}
        <FormatsFilters
          ageFilter={ageFilter}
          setAgeFilter={setAgeFilter}
          dayFilter={dayFilter}
          setDayFilter={setDayFilter}
          durationFilter={durationFilter}
          setDurationFilter={setDurationFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          peopleFilter={peopleFilter}
          setPeopleFilter={setPeopleFilter}
          resultsCount={results.length}
          reset={reset}
        />

        {/* RESULTS */}
        <FormatsResults
          results={results}
          expanded={expanded}
          setExpanded={setExpanded}
          reset={reset}
          openAction={openAction}
        />

        {/* CTA */}
        <FormatsCta />

        {/* SEO TEXT */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            Форматы мастер-классов в «Дымов Керамика»: выберите свой идеальный вариант
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Страница «Форматы» — это витрина возможностей школы керамики на ВДНХ. Здесь каждый, от
              ребёнка до взрослого, найдёт свой способ прикоснуться к гончарному искусству. За 20 лет
              мы поняли: универсального решения нет — кому-то нужен быстрый мастер-класс, а кто-то
              готов посвятить ремеслу целый день. Поэтому мы создали гибкую систему форматов: от
              классических занятий до камерных свиданий и масштабных корпоративов.
            </p>

            <h3 className="pt-4 font-display text-2xl font-semibold text-foreground">
              Кому подходит обучение в гончарной мастерской?
            </h3>
            <p>
              «Дымов Керамика» — пространство, где творчество доступно всем. Мы принимаем малышей с 3
              лет (вместе с родителями), школьников, студентов и взрослых. Мастера помогают раскрыть
              потенциал каждому, учат ручной лепке, работе на гончарном круге и росписи ангобами. В
              уютной студии на ВДНХ вы не просто проведёте время — уйдёте с авторским изделием,
              сделанным своими руками.
            </p>

            <h3 className="pt-4 font-display text-2xl font-semibold text-foreground">
              Все форматы занятий
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-foreground">
                  1. Классические и групповые мастер-классы
                </p>
                <p className="mt-1">
                  Базовый формат для знакомства с глиной — 1 час, группы до 20 человек. Выбирайте
                  детскую группу по выходным (3–10 лет) или промо-тарифы в будни (от 7 лет).
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  2. Тематические и расширенные форматы
                </p>
                <p className="mt-1">
                  Для углублённого погружения: тематические МК до 6,5 часов (от 12 лет), коворкинг с
                  поминутной оплатой для самостоятельной работы и романтическое свидание в мастерской
                  на 1,5 часа для двоих.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground">3. Праздники в «Дымов Керамика»</p>
                <p className="mt-1">
                  Мы специалисты по нестандартным торжествам: дни рождения для детей, корпоративы
                  вместо скучных банкетов, девичники и мальчишники. Проводим в студии на ВДНХ или с
                  выездом к вам.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground">4. Выездной мастер-класс</p>
                <p className="mt-1">
                  Приедем в офис, школу или загородный клуб. От 30 минут, для 1–100 человек, с полным
                  набором материалов и инструментов.
                </p>
              </div>
            </div>

            <h3 className="pt-4 font-display text-2xl font-semibold text-foreground">
              Как выбрать и забронировать?
            </h3>
            <p>
              Ориентируйтесь на количество человек, возраст и желаемое время. Не нашли идеальный
              вариант? Оставьте заявку — мы подберём индивидуальный формат под ваш бюджет и повод.
            </p>
            <p>
              Приходите в «Дымов Керамика» на ВДНХ, чтобы отвлечься от рутины, научиться новому и
              подарить себе и близким настоящий творческий вечер.
            </p>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
};

export default Formats;