import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';
import DesktopNav from '@/components/DesktopNav';
import MobileMenu from '@/components/MobileMenu';
import CartButton from '@/components/CartButton';
import TrackingButton from '@/components/TrackingButton';
import CitySwitcher from '@/components/CitySwitcher';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import MessengersMenu from '@/components/MessengersMenu';
import { useNavClick } from '@/hooks/useNavClick';
import { useCity } from '@/hooks/useCity';
import { usePageContent } from '@/hooks/usePageContent';
import { CITIES } from '@/lib/cities';
import { reachGoal, GOALS } from '@/lib/metrika';

interface SiteHeaderProps {
  active?: string;
}

const SiteHeader = ({ active }: SiteHeaderProps) => {
  const navClick = useNavClick();
  const city = useCity();
  const cityConfig = CITIES[city];
  const messengersContent = usePageContent(`${city}-messengers`);

  return (
  <>
  <AnnouncementBanner />
  <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
    <div className="container flex h-20 items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" onClick={navClick('/')} className="flex items-center">
          <Logo scale={false} />
        </Link>
        <CitySwitcher />
      </div>
      <DesktopNav active={active} />
      <div className="hidden items-center gap-3 md:flex">
        <a
          href={cityConfig.phoneHref}
          onClick={() => reachGoal(GOALS.PHONE_CLICK, city)}
          className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
        >
          {cityConfig.phone}
        </a>
        <MessengersMenu fields={messengersContent} />
      </div>
      <div className="flex items-center gap-3">
        <TrackingButton />
        <CartButton />
        <MobileMenu active={active} />
      </div>
    </div>
  </header>
  </>
  );
};

export default SiteHeader;