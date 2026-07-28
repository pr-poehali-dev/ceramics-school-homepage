import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { toast } from '@/hooks/use-toast';
import func2url from '../../../backend/func2url.json';

interface ShipmentRequest {
  id: number;
  trackingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  photoUrl: string;
  createdAt?: string;
  deliveredAt?: string | null;
  returnAt?: string | null;
  status?: string;
}

interface Props {
  token: string;
}

const PER_PAGE = 20;

const fmtDateTime = (s: string) => {
  try {
    return new Date(s).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return s;
  }
};

const fmtDate = (s: string | null | undefined) => {
  if (!s) return '—';
  try {
    return new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return s;
  }
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const AdminShipmentRequests = ({ token }: Props) => {
  const [view, setView] = useState<'requests' | 'confirmed'>('requests');
  const [requests, setRequests] = useState<ShipmentRequest[]>([]);
  const [confirmed, setConfirmed] = useState<ShipmentRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [approveTarget, setApproveTarget] = useState<ShipmentRequest | null>(null);
  const [approveDate, setApproveDate] = useState(todayISO());
  const [approving, setApproving] = useState(false);

  const [rejectTarget, setRejectTarget] = useState<ShipmentRequest | null>(null);
  const [rejecting, setRejecting] = useState(false);

  const load = async (v: 'requests' | 'confirmed') => {
    setLoading(true);
    try {
      const resp = await fetch(`${func2url['shipments-admin']}?status=${v}`, {
        headers: { 'X-Session-Token': token },
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось загрузить заявки' });
        if (v === 'requests') setRequests([]);
        else setConfirmed([]);
        return;
      }
      if (v === 'requests') setRequests(data.requests || []);
      else setConfirmed(data.requests || []);
      setPage(1);
    } catch {
      toast({ title: 'Ошибка загрузки', description: 'Попробуйте позже.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(view);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const openApprove = (r: ShipmentRequest) => {
    setApproveTarget(r);
    setApproveDate(todayISO());
  };

  const confirmApprove = async () => {
    if (!approveTarget) return;
    setApproving(true);
    try {
      const resp = await fetch(func2url['shipments-admin'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ action: 'approve_request', id: approveTarget.id, deliveredAt: approveDate }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось подтвердить заявку' });
        return;
      }
      toast({ title: 'Заявка подтверждена', description: `№ ${approveTarget.trackingNumber} теперь в очереди на обжиг` });
      setRequests((prev) => prev.filter((r) => r.id !== approveTarget.id));
      setApproveTarget(null);
    } catch {
      toast({ title: 'Ошибка', description: 'Попробуйте позже.' });
    } finally {
      setApproving(false);
    }
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    setRejecting(true);
    try {
      const resp = await fetch(func2url['shipments-admin'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ action: 'reject_request', id: rejectTarget.id }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось отклонить заявку' });
        return;
      }
      toast({ title: 'Заявка отклонена', description: `№ ${rejectTarget.trackingNumber}` });
      setRequests((prev) => prev.filter((r) => r.id !== rejectTarget.id));
      setRejectTarget(null);
    } catch {
      toast({ title: 'Ошибка', description: 'Попробуйте позже.' });
    } finally {
      setRejecting(false);
    }
  };

  const list = view === 'requests' ? requests : confirmed;
  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const paginated = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setView('requests')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              view === 'requests' ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'
            }`}
          >
            Требуется подтвердить {requests.length ? `(${requests.length})` : ''}
          </button>
          <button
            onClick={() => setView('confirmed')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              view === 'confirmed' ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'
            }`}
          >
            Подтверждённые
          </button>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 rounded-full" onClick={() => load(view)} disabled={loading}>
          <Icon name="RefreshCcw" size={14} className="mr-1.5" /> Обновить
        </Button>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {view === 'requests'
          ? 'Заявки, которые клиенты отправили самостоятельно со страницы отслеживания. Проверьте фото и подтвердите — изделие встанет в очередь на обжиг и станет видно клиенту.'
          : 'Заявки клиентов, которые уже подтверждены и встали в очередь на обжиг.'}
      </p>

      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : list.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {view === 'requests' ? 'Новых заявок нет.' : 'Подтверждённых заявок пока нет.'}
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((r) => (
            <div key={r.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <img src={r.photoUrl} alt="Фото изделия" className="h-48 w-full object-cover" />
              <div className="p-4">
                <p className="font-display text-base font-semibold">№ {r.trackingNumber}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p>{r.customerName}</p>
                  <p className="text-muted-foreground">{r.customerPhone}</p>
                  <p className="text-muted-foreground">{r.customerEmail}</p>
                </div>

                {view === 'requests' ? (
                  <>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Заявка от {r.createdAt ? fmtDateTime(r.createdAt) : '—'}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="flex-1 rounded-full" onClick={() => openApprove(r)}>
                        <Icon name="Check" size={14} className="mr-1.5" /> Подтвердить
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-full"
                        onClick={() => setRejectTarget(r)}
                      >
                        <Icon name="X" size={14} className="mr-1.5" /> Отклонить
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <p>Доставлено в Москву: {fmtDate(r.deliveredAt)}</p>
                    <p>Хранение до: {fmtDate(r.returnAt)}</p>
                    <p>Статус: {r.status === 'issued' ? 'Выдано' : 'В очереди на обжиг'}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {list.length > PER_PAGE && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <Icon name="ChevronLeft" size={15} />
          </Button>
          <span className="px-3 text-sm text-muted-foreground">
            Страница {page} из {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            <Icon name="ChevronRight" size={15} />
          </Button>
        </div>
      )}

      {/* ПОДТВЕРЖДЕНИЕ */}
      <AlertDialog open={!!approveTarget} onOpenChange={(v) => !v && setApproveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтвердить заявку?</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-2">
            <Label htmlFor="approve-date">Дата доставки в Москву</Label>
            <Input
              id="approve-date"
              type="date"
              value={approveDate}
              onChange={(e) => setApproveDate(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove} disabled={approving}>
              {approving ? 'Подтверждаем…' : 'Подтвердить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ОТКЛОНЕНИЕ */}
      <AlertDialog open={!!rejectTarget} onOpenChange={(v) => !v && setRejectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отклонить заявку?</AlertDialogTitle>
            <AlertDialogDescription>
              Заявка № {rejectTarget?.trackingNumber} клиента {rejectTarget?.customerName} будет
              отклонена и не появится в отслеживании. Отменить это действие нельзя.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReject} disabled={rejecting}>
              {rejecting ? 'Отклоняем…' : 'Отклонить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminShipmentRequests;
