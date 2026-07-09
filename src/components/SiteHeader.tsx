import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';
import DesktopNav from '@/components/DesktopNav';
import MobileMenu from '@/components/MobileMenu';
import CartButton from '@/components/CartButton';
import { useNavClick } from '@/hooks/useNavClick';

interface SiteHeaderProps {
  active?: string;
}

const SiteHeader = ({ active }: SiteHeaderProps) => {
  const navClick = useNavClick();
  return (
  <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
    <div className="container flex h-20 items-center justify-between">
      <Link to="/moscow" onClick={navClick('/moscow')} className="flex items-center">
        <Logo scale={false} />
      </Link>
      <DesktopNav active={active} />
      <a
        href="tel:+79854198903"
        className="hidden items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary md:flex"
      >
        <Icon name="Phone" size={18} className="text-primary" /> +7 (985) 419-89-03
      </a>
      <div className="flex items-center gap-3">
        <CartButton />
        <MobileMenu active={active} />
      </div>
    </div>
  </header>
  );
};

export default SiteHeader;