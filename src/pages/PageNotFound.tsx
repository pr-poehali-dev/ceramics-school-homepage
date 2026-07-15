import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useCity } from '@/hooks/useCity';
import { CITIES } from '@/lib/cities';
import { usePageMeta } from '@/hooks/usePageMeta';

interface QuickLink {
  label: string;
  to: string;
  icon: string;
}

const QUICK_LINKS: Record<'moscow' | 'suzdal', QuickLink[]> = {
  moscow: [
    { label: 'Мастер-классы', to: '/moscow/workshops', icon: 'Palette' },
    { label: 'Сертификаты', to: '/moscow/certificates', icon: 'Gift' },
    { label: 'Форматы', to: '/moscow/formats', icon: 'Layers' },
  ],
  suzdal: [
    { label: 'Мастер-классы', to: '/suzdal/workshops', icon: 'Palette' },
    { label: 'Сертификаты', to: '/suzdal/certificates', icon: 'Gift' },
    { label: 'Экскурсии', to: '/suzdal/excursions', icon: 'MapPin' },
  ],
};

const PageNotFound = () => {
  const location = useLocation();
  const city = useCity();
  const cityConfig = CITIES[city];
  const quickLinks = QUICK_LINKS[city];

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

          <div className="mt-10 border-t border-border pt-8">
            <p className="text-sm font-medium text-muted-foreground">
              Возможно, вас заинтересует
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon name={link.icon} size={16} /> {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default PageNotFound;