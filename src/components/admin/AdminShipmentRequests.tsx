import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SortableTableHead from './SortableTableHead';
import { useSortableData } from '@/hooks/useSortableData';
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
  readyAt?: string | null;
  emailSent?: boolean;
  storageUntil?: string | null;
  archivedAt?: string | null;
  visitNumber?: number;
  parentId?: number | null;
  parentTrackingNumber?: string | null;
  requiresPainting?: boolean;
  paintingReminderSentAt?: string | null;
  visitDate?: string | null;
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
  const [view, setView] = useState<'requests' | 'confirmed' | 'archived'>('confirmed');
  const [requests, setRequests] = useState<ShipmentRequest[]>([]);
  const [confirmed, setConfirmed] = useState<ShipmentRequest[]>([]);
  const [archived, setArchived] = useState<ShipmentRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [approveTarget, setApproveTarget] = useState<ShipmentRequest | null>(null);
  const [approveDate, setApproveDate] = useState(todayISO());
  const [approving, setApproving] = useState(false);

  const [rejectTarget, setRejectTarget] = useState<ShipmentRequest | null>(null);
  const [rejecting, setRejecting] = useState(false);

  const [readyTarget, setReadyTarget] = useState<ShipmentRequest | null>(null);
  const [markingReady, setMarkingReady] = useState(false);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [galleryMode, setGalleryMode] = useState(false);

  const load = async (v: 'requests' | 'confirmed' | 'archived') => {
    setLoading(true);
    try {
      const resp = await fetch(`${func2url['shipments-admin']}?status=${v}`, {
        headers: { 'X-Session-Token': token },
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось загрузить заявки' });
        if (v === 'requests') setRequests([]);
        else if (v === 'confirmed') setConfirmed([]);
        else setArchived([]);
        return;
      }
      if (v === 'requests') setRequests(data.requests || []);
      else if (v === 'confirmed') setConfirmed(data.requests || []);
      else setArchived(data.requests || []);
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
        body: JSON.stringify({
          action: 'approve_request',
          id: approveTarget.id,
          deliveredAt: approveDate,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось подтвердить заявку' });
        return;
      }
      toast({
        title: 'Заявка подтверждена',
        description: approveTarget.requiresPainting
          ? `№ ${approveTarget.trackingNumber} — через 16 дней клиенту автоматически придёт письмо про запись на роспись`
          : `№ ${approveTarget.trackingNumber} добавлена в подтверждённые`,
      });
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

  const confirmReady = async () => {
    if (!readyTarget) return;
    setMarkingReady(true);
    try {
      const resp = await fetch(func2url['shipments-admin'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ action: 'ready_for_pickup', id: readyTarget.id }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось отметить готовность' });
        return;
      }
      if (data.emailError) {
        toast({
          title: 'Готовность отмечена, но письмо не отправлено',
          description: `№ ${readyTarget.trackingNumber} — ошибка почты: ${data.emailError}`,
        });
      } else {
        toast({
          title: 'Изделие готово к выдаче',
          description: `№ ${readyTarget.trackingNumber} — клиенту отправлено уведомление`,
        });
      }
      setConfirmed((prev) =>
        prev.map((r) =>
          r.id === readyTarget.id
            ? { ...r, readyAt: new Date().toISOString(), emailSent: !data.emailError }
            : r,
        ),
      );
      setReadyTarget(null);
    } catch {
      toast({ title: 'Ошибка', description: 'Попробуйте позже.' });
    } finally {
      setMarkingReady(false);
    }
  };

  const baseList = view === 'requests' ? requests : view === 'confirmed' ? confirmed : archived;
  const searchDigits = search.replace(/\D/g, '');
  const filteredList =
    view !== 'requests' && searchDigits
      ? baseList.filter((r) => r.customerPhone.replace(/\D/g, '').includes(searchDigits))
      : baseList;

  // Группируем повторные посещения под родительской заявкой (первое изделие -> роспись)
  const byId = new Map(baseList.map((r) => [r.id, r]));
  const childrenOf = (id: number) =>
    baseList
      .filter((r) => r.parentId === id)
      .sort((a, b) => (a.visitNumber || 1) - (b.visitNumber || 1));
  const parentsOnly = filteredList.filter((r) => !(r.parentId && byId.has(r.parentId)));

  type SortKey = 'trackingNumber' | 'customerName' | 'createdAt' | 'storageUntil' | 'archivedAt';
  const { sorted: list, sort, toggleSort } = useSortableData<ShipmentRequest, SortKey>(
    parentsOnly,
    (item, key) => {
      if (key === 'trackingNumber') return item.trackingNumber || '';
      if (key === 'customerName') return item.customerName || '';
      if (key === 'createdAt') return item.createdAt ? new Date(item.createdAt).getTime() : 0;
      if (key === 'storageUntil') return item.storageUntil ? new Date(item.storageUntil).getTime() : 0;
      if (key === 'archivedAt') return item.archivedAt ? new Date(item.archivedAt).getTime() : 0;
      return '';
    },
  );

  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const paginated = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          <button
            onClick={() => setView('confirmed')}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              view === 'confirmed' ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'
            }`}
          >
            Подтверждённые
          </button>
          <button
            onClick={() => setView('requests')}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              view === 'requests' ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'
            }`}
          >
            Требуется подтвердить {requests.length ? `(${requests.length})` : ''}
          </button>
          <button
            onClick={() => setView('archived')}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              view === 'archived' ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'
            }`}
          >
            Архив
          </button>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 rounded-full" onClick={() => load(view)} disabled={loading}>
          <Icon name="RefreshCcw" size={14} className="mr-1.5" /> Обновить
        </Button>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {view === 'requests'
          ? 'Заявки, которые клиенты отправили самостоятельно со страницы отслеживания. Проверьте фото и подтвердите.'
          : view === 'confirmed'
            ? 'Заявки клиентов, которые уже подтверждены. Когда изделие пройдёт обжиг, нажмите «Готово» — клиенту придёт письмо с адресом и часами работы для получения.'
            : 'Заявки, отмеченные готовыми к выдаче более 3 месяцев назад, переносятся сюда автоматически.'}
      </p>

      {view === 'confirmed' && (
        <Button
          onClick={() => setGalleryMode((v) => !v)}
          variant={galleryMode ? 'default' : 'outline'}
          className="mt-4 w-full rounded-xl sm:w-auto"
          size="lg"
        >
          <Icon
            name={galleryMode ? 'LayoutList' : 'GalleryHorizontal'}
            fallback={galleryMode ? 'List' : 'Images'}
            size={18}
            className="mr-2"
          />
          {galleryMode ? 'Показать таблицей' : 'Найти изделие по фото у стола'}
        </Button>
      )}

      {!(view === 'confirmed' && galleryMode) && view !== 'requests' && (
        <div className="mt-3 max-w-xs">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Поиск по номеру телефона"
            className="rounded-full"
          />
        </div>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : view === 'confirmed' && galleryMode ? (
        (() => {
          const galleryItems = confirmed.filter((r) => !r.readyAt && !r.requiresPainting);
          if (galleryItems.length === 0) {
            return (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                Изделий, ожидающих обжига, не найдено — все уже готовы или ждут росписи.
              </p>
            );
          }
          return (
            <div className="mt-4">
              <p className="mb-3 text-sm text-muted-foreground">
                Найдено изделий: {galleryItems.length}. Пролистайте фото и нажмите «Готово» под нужным.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(item.photoUrl)}
                      className="block w-full"
                    >
                      <img
                        src={item.photoUrl}
                        alt="Фото изделия"
                        className="aspect-square w-full object-cover"
                      />
                    </button>
                    <div className="p-3">
                      <p className="font-medium">
                        № {item.trackingNumber}
                        {(item.visitNumber || 1) > 1 && (
                          <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Посещение {item.visitNumber}
                          </span>
                        )}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">{item.customerName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Заявка создана: {item.createdAt ? fmtDateTime(item.createdAt) : '—'}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Дата посещения: {fmtDate(item.visitDate)}
                      </p>
                      <Button
                        size="lg"
                        className="mt-3 w-full rounded-xl"
                        onClick={() => setReadyTarget(item)}
                      >
                        <Icon name="Check" size={18} className="mr-2" /> Готово
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()
      ) : list.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {view === 'requests'
            ? 'Новых заявок нет.'
            : view === 'confirmed'
              ? 'Подтверждённых заявок пока нет.'
              : 'Архив пуст.'}
        </p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Фото</TableHead>
                <SortableTableHead label="№ заявки" sortKey="trackingNumber" sort={sort} onSort={toggleSort} />
                <SortableTableHead label="Клиент" sortKey="customerName" sort={sort} onSort={toggleSort} />
                <TableHead>Контакты</TableHead>
                {view === 'requests' ? (
                  <>
                    <SortableTableHead label="Заявка от" sortKey="createdAt" sort={sort} onSort={toggleSort} />
                    <TableHead>Дата посещения</TableHead>
                  </>
                ) : view === 'confirmed' ? (
                  <>
                    <SortableTableHead label="Заявка создана" sortKey="createdAt" sort={sort} onSort={toggleSort} />
                    <TableHead>Дата посещения</TableHead>
                    <SortableTableHead label="Хранение до" sortKey="storageUntil" sort={sort} onSort={toggleSort} />
                    <TableHead>Статус</TableHead>
                  </>
                ) : (
                  <>
                    <SortableTableHead label="Заявка создана" sortKey="createdAt" sort={sort} onSort={toggleSort} />
                    <SortableTableHead label="В архиве с" sortKey="archivedAt" sort={sort} onSort={toggleSort} />
                  </>
                )}
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((r) => {
                const children = childrenOf(r.id);
                const rows = [r, ...children];
                return rows.map((row, idx) => {
                  const isChild = idx > 0;
                  return (
                    <TableRow key={row.id} className={isChild ? 'bg-secondary/20' : ''}>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => setPhotoPreview(row.photoUrl)}
                          className={`block overflow-hidden rounded-lg border border-border ${isChild ? 'ml-4' : ''}`}
                        >
                          <img
                            src={row.photoUrl}
                            alt="Фото изделия"
                            className="h-14 w-14 object-cover transition-transform hover:scale-105"
                          />
                        </button>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className={isChild ? 'ml-4 flex items-center gap-1.5 flex-wrap' : 'flex items-center gap-1.5 flex-wrap'}>
                          {isChild && <Icon name="CornerDownRight" size={14} className="text-muted-foreground" />}
                          № {row.trackingNumber}
                          {(row.visitNumber || 1) > 1 && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              Посещение {row.visitNumber}
                            </span>
                          )}
                          {view === 'requests' && row.requiresPainting && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                              С росписью
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <p>{row.customerPhone}</p>
                        <p>{row.customerEmail}</p>
                      </TableCell>
                      {view === 'requests' ? (
                        <>
                          <TableCell className="text-sm text-muted-foreground">
                            {row.createdAt ? fmtDateTime(row.createdAt) : '—'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{fmtDate(row.visitDate)}</TableCell>
                        </>
                      ) : view === 'confirmed' ? (
                        <>
                          <TableCell className="text-sm text-muted-foreground">
                            {row.createdAt ? fmtDateTime(row.createdAt) : '—'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{fmtDate(row.visitDate)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{fmtDate(row.storageUntil)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {row.readyAt
                              ? 'Готово к выдаче'
                              : row.requiresPainting
                                ? 'Ожидает росписи'
                                : 'Идёт обжиг'}
                            {row.readyAt && row.emailSent && (
                              <p className="mt-0.5 text-xs text-green-600">Письмо отправлено</p>
                            )}
                            {row.requiresPainting && !row.readyAt && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {row.paintingReminderSentAt
                                  ? 'Письмо про роспись отправлено'
                                  : 'Письмо про роспись придёт через 16 дней'}
                              </p>
                            )}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="text-sm text-muted-foreground">
                            {row.createdAt ? fmtDateTime(row.createdAt) : '—'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {row.archivedAt ? fmtDateTime(row.archivedAt) : '—'}
                          </TableCell>
                        </>
                      )}
                      <TableCell className="text-right">
                        {view === 'requests' ? (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" className="rounded-full" onClick={() => openApprove(row)}>
                              <Icon name="Check" size={14} className="mr-1.5" /> Подтвердить
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full"
                              onClick={() => setRejectTarget(row)}
                            >
                              <Icon name="X" size={14} className="mr-1.5" /> Отклонить
                            </Button>
                          </div>
                        ) : view === 'confirmed' ? (
                          !row.readyAt && !row.requiresPainting ? (
                            <Button size="sm" className="rounded-full" onClick={() => setReadyTarget(row)}>
                              <Icon name="Check" size={14} className="mr-1.5" /> Готово
                            </Button>
                          ) : null
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                });
              })}
            </TableBody>
          </Table>
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
            <AlertDialogDescription>
              Заявка № {approveTarget?.trackingNumber} клиента {approveTarget?.customerName}.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div
            className={`rounded-xl border p-3 ${
              approveTarget?.requiresPainting ? 'border-primary bg-primary/5' : 'border-border bg-secondary/30'
            }`}
          >
            <p className="text-sm font-medium text-foreground">
              {approveTarget?.requiresPainting ? 'Изделие с росписью' : 'Изделие без росписи'}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {approveTarget?.requiresPainting
                ? 'Клиент выбрал это в заявке. Изделие ещё не расписано — кнопки «Готово» не будет, через 16 дней клиенту автоматически придёт письмо с приглашением записаться на роспись.'
                : 'Клиент выбрал это в заявке. Изделие полностью готово — появится кнопка «Готово», которую нажмёте после обжига.'}
            </p>
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

      {/* ГОТОВНОСТЬ К ВЫДАЧЕ */}
      <AlertDialog open={!!readyTarget} onOpenChange={(v) => !v && setReadyTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Изделие готово к выдаче?</AlertDialogTitle>
            <AlertDialogDescription>
              Заявка № {readyTarget?.trackingNumber} клиента {readyTarget?.customerName}. Клиенту
              автоматически придёт письмо с адресом и часами работы для получения изделия.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReady} disabled={markingReady}>
              {markingReady ? 'Отправляем…' : 'Готово'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ПРОСМОТР ФОТО */}
      <Dialog open={!!photoPreview} onOpenChange={(v) => !v && setPhotoPreview(null)}>
        <DialogContent className="max-w-2xl">
          {photoPreview && (
            <img src={photoPreview} alt="Фото изделия" className="max-h-[80vh] w-full rounded-lg object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminShipmentRequests;