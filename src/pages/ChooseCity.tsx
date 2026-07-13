import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';
import { usePageMeta } from '@/hooks/usePageMeta';

const MOSCOW_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/260e7e60-766b-4577-b0ce-5dd058cede6b.jpg';
const SUZDAL_IMG =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/0e9903bd-b9bd-4836-873c-fc3dab4623f7.jpg';

const ChooseCity = () => {
  usePageMeta({
    title: 'Гончарная школа «Дымов Керамика» в Москве и Суздале',
    description:
      'Ждем вас в нашей школе гончарных искусств «Дымов Керамика» в Москве и Суздале! Мастер-классы и уроки для детей и взрослых. Экскурсии, праздники. Выгодные предложения. Звоните!',
  });
  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      {/* LOGO */}
      <div className="flex flex-col items-center pt-12 pb-8 md:pt-16">
        <Logo className="h-14 origin-center md:h-16" />
        <h1 className="mt-5 text-center text-base text-muted-foreground md:text-lg">Одна из старейших гончарных школ — выберите город</h1>
      </div>

      {/* CHOICE BLOCKS */}
      <div className="grid min-h-[60vh] gap-1 md:grid-cols-2">
        {/* MOSCOW */}
        <Link
          to="/moscow"
          className="group relative flex items-end overflow-hidden"
        >
          <img
            src={MOSCOW_IMG}
            alt="Школа Дымов Керамика на ВДНХ в Москве"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:from-primary/80" />
          <div className="relative z-10 w-full p-8 text-primary-foreground md:p-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <Icon name="MapPin" size={13} /> Москва · ВДНХ
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-4xl">
              Школа керамики<br />«Дымов Керамика» на ВДНХ
            </h2>
            <span className="mt-5 inline-flex items-center gap-2 text-base font-medium transition-all group-hover:gap-3">
              Перейти на страницу школы
              <Icon name="ArrowRight" size={20} />
            </span>
          </div>
        </Link>

        {/* SUZDAL */}
        <Link
          to="/suzdal"
          className="group relative flex items-end overflow-hidden"
        >
          <img
            src={SUZDAL_IMG}
            alt="Фабрика и школа Дымов Керамика в Суздале"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:from-primary/80" />
          <div className="relative z-10 w-full p-8 text-primary-foreground md:p-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <Icon name="MapPin" size={13} /> Суздаль
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-4xl">
              Фабрика и Школа<br />«Дымов Керамика» в Суздале
            </h2>
            <span className="mt-5 inline-flex items-center gap-2 text-base font-medium transition-all group-hover:gap-3">
              Перейти на страницу фабрики
              <Icon name="ArrowRight" size={20} />
            </span>
          </div>
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-border bg-secondary/40">
        <div className="container flex flex-col items-center justify-center gap-1 py-6 text-sm text-muted-foreground">
          <span>© 2003–2026 «Дымов Керамика». Все права защищены.</span>
        </div>
      </footer>
    </div>
  );
};

export default ChooseCity;