import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import type { FormatItem } from './formatsData';

const KidsDialog = lazy(() => import('./dialogs/KidsDialog'));
const PromoDialog = lazy(() => import('./dialogs/PromoDialog'));
const OffsiteDialog = lazy(() => import('./dialogs/OffsiteDialog'));
const ThematicDialog = lazy(() => import('./dialogs/ThematicDialog'));
const EventsDialog = lazy(() => import('./dialogs/EventsDialog'));
const CoworkingDialog = lazy(() => import('./dialogs/CoworkingDialog'));
const DateDialog = lazy(() => import('./dialogs/DateDialog'));

const DIALOGS = {
  kids: KidsDialog,
  promo: PromoDialog,
  offsite: OffsiteDialog,
  thematic: ThematicDialog,
  events: EventsDialog,
  coworking: CoworkingDialog,
  date: DateDialog,
} as const;

const FormatCtaButton = ({ cta, autoOpen }: { cta: FormatItem['cta']; autoOpen?: boolean }) => {
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

  const Dialog = action ? DIALOGS[action as keyof typeof DIALOGS] : undefined;

  if (Dialog) {
    return (
      <Suspense fallback={button}>
        <Dialog autoOpen={autoOpen}>{button}</Dialog>
      </Suspense>
    );
  }

  return button;
};

export default FormatCtaButton;