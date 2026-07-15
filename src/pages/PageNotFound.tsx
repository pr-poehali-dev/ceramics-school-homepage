import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useCity } from '@/hooks/useCity';
import { CITIES } from '@/lib/cities';
import { usePageMeta } from '@/hooks/usePageMeta';

const PageNotFound = () => {
  const location = useLocation();
  const city = useCity();
  const cityConfig = CITIES[city];

  usePageMeta({
    title: 'Страница не найдена | «Дымов Керамика»',
    description: 'Такой страницы не существует или она была перемещена.',
  });

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground clay-texture">
      <SiteHeader />

      <div className="container flex flex-1 items-center py-24">
        <div className="mx-auto max-w-lg text-center">
          <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/10" />
            <Icon name="Frown" size={48} className="relative text-primary" />
          </div>

          <p className="font-display text-8xl font-semibold leading-none text-primary">404</p>

          <h1 className="mt-4 font-display text-2xl font-semibold md:text-3xl">
            Ой, кажется, эта страница разбилась
          </h1>
          <p className="mt-3 text-muted-foreground">
            Страница, которую вы ищете, не найдена — возможно, адрес изменился
            или был введён с опечаткой.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link to={cityConfig.path}>
                <Icon name="Home" size={18} className="mr-2" /> На главную
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link to={`${cityConfig.path}/contacts`}>
                <Icon name="MessageCircle" size={18} className="mr-2" /> Связаться с нами
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default PageNotFound;
