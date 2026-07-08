import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import type { FormatItem } from './formatsData';
import KidsDialog from './dialogs/KidsDialog';
import PromoDialog from './dialogs/PromoDialog';
import OffsiteDialog from './dialogs/OffsiteDialog';
import ThematicDialog from './dialogs/ThematicDialog';

const FormatCtaButton = ({ cta }: { cta: FormatItem['cta'] }) => {
  const button = (
    <Button variant={cta.variant} className="mt-5 w-fit shrink-0 rounded-full px-6">
      {cta.label}
      <Icon name={cta.icon} size={15} className="ml-2" />
    </Button>
  );

  const action = 'action' in cta ? cta.action : undefined;

  const to = 'to' in cta ? cta.to : undefined;

  if (action === 'link' && to) {
    return (
      <Button asChild variant={cta.variant} className="mt-5 w-fit shrink-0 rounded-full px-6">
        <Link to={to}>
          {cta.label}
          <Icon name={cta.icon} size={15} className="ml-2" />
        </Link>
      </Button>
    );
  }

  if (action === 'kids') return <KidsDialog>{button}</KidsDialog>;
  if (action === 'promo') return <PromoDialog>{button}</PromoDialog>;
  if (action === 'offsite') return <OffsiteDialog>{button}</OffsiteDialog>;
  if (action === 'thematic') return <ThematicDialog>{button}</ThematicDialog>;

  return button;
};

export default FormatCtaButton;