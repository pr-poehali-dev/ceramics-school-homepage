import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Shipment } from './shipmentTypes';

interface Props {
  issueTarget: Shipment | null;
  setIssueTarget: (s: Shipment | null) => void;
  issuing: boolean;
  onConfirm: () => void;
}

const ShipmentIssueDialog = ({ issueTarget, setIssueTarget, issuing, onConfirm }: Props) => {
  return (
    <AlertDialog open={!!issueTarget} onOpenChange={(v) => !v && setIssueTarget(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Выдать посылку?</AlertDialogTitle>
          <AlertDialogDescription>
            Посылка № {issueTarget?.trackingNumber} будет помечена как выданная клиенту{' '}
            {issueTarget?.customerName} и перемещена в раздел «Закрытые». Отменить это действие
            нельзя.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={issuing}>
            {issuing ? 'Выдаём…' : 'Подтвердить выдачу'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ShipmentIssueDialog;
