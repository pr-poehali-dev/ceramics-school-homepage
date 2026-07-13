import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useCity } from '@/hooks/useCity';
import { CITIES } from '@/lib/cities';
import { usePageMeta } from '@/hooks/usePageMeta';

interface ComingSoonProps {
  title: string;
}

const ComingSoon = ({ title }: ComingSoonProps) => {
  const city = useCity();
  const cityConfig = CITIES[city];

  usePageMeta({
    title: `${title} | «Дымов Керамика» в ${cityConfig.label === 'Москва' ? 'Москве' : cityConfig.label}`,
    description: `Раздел «${title}» скоро появится на сайте. Следите за обновлениями.`,
  });

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader />

      <div className="container py-24">
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border py-20 text-center">
          <Icon name="Construction" size={44} className="mx-auto mb-4 text-muted-foreground/50" />
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Раздел пока в разработке. Загляните чуть позже — мы уже готовим его для вас.
          </p>
          <Button asChild className="mt-6 rounded-full px-7">
            <Link to={cityConfig.path}>
              <Icon name="ArrowLeft" size={16} className="mr-2" /> На главную
            </Link>
          </Button>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default ComingSoon;
