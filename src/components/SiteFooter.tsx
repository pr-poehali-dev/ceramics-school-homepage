import Icon from '@/components/ui/icon';
import Logo from '@/components/Logo';
import SocialLinks from '@/components/SocialLinks';
import ReviewLinks from '@/components/ReviewLinks';
import FooterLegal from '@/components/FooterLegal';

const SiteFooter = () => (
  <footer className="mt-16 border-t border-border bg-secondary/40">
    <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
      <Logo className="h-9" />
      <span className="flex items-center gap-2">
        <Icon name="MapPin" size={16} className="text-primary" /> ВДНХ, Москва
      </span>
      <a
        href="tel:+79854198903"
        className="flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary"
      >
        <Icon name="Phone" size={16} className="text-primary" /> +7 (985) 419-89-03
      </a>
      <ReviewLinks />
      <SocialLinks size={18} variant="solid" />
      <FooterLegal />
    </div>
  </footer>
);

export default SiteFooter;
