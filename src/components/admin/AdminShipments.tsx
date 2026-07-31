import { useEffect, useRef, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import func2url from '../../../backend/func2url.json';
import { Shipment } from './shipmentTypes';
import ShipmentCreateForm from './ShipmentCreateForm';
import ShipmentsTable from './ShipmentsTable';
import ShipmentIssueDialog from './ShipmentIssueDialog';
import { useSortableData } from '@/hooks/useSortableData';
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

interface Props {
  token: string;
  role: 'vdnh' | 'suzdal';
}

const PER_PAGE = 20;

const todayISO = () => new Date().toISOString().slice(0, 10);

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AdminShipments = ({ token, role }: Props) => {
  const [view, setView] = useState<'active' | 'closed' | 'all'>(role === 'suzdal' ? 'all' : 'active');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [issueTarget, setIssueTarget] = useState<Shipment | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [sendToVdnhTarget, setSendToVdnhTarget] = useState<Shipment | null>(null);
  const [sendingToVdnh, setSendingToVdnh] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const [formTracking, setFormTracking] = useState('');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDate, setFormDate] = useState(todayISO());
  const [saving, setSaving] = useState(false);

  const excelInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const load = async (status: 'active' | 'closed' | 'all') => {
    setLoading(true);
    try {
      const resp = await fetch(`${func2url['shipments-admin']}?status=${status}`, {
        headers: { 'X-Session-Token': token },
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось загрузить посылки' });
        setShipments([]);
        return;
      }
      setShipments(data.shipments || []);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTracking.trim() || !formName.trim() || formPhone.replace(/\D/g, '').length < 11) {
      toast({ title: 'Заполните номер посылки, ФИО и телефон' });
      return;
    }
    setSaving(true);
    try {
      const resp = await fetch(func2url['shipments-admin'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({
          action: 'create',
          trackingNumber: formTracking.trim(),
          customerName: formName.trim(),
          customerPhone: formPhone,
          customerEmail: formEmail.trim(),
          deliveredAt: formDate,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось сохранить посылку' });
        return;
      }
      toast({ title: 'Посылка добавлена', description: `№ ${formTracking.trim()}` });
      setFormTracking('');
      setFormName('');
      setFormPhone('');
      setFormEmail('');
      setFormDate(todayISO());
      if (view === 'active' || view === 'all') load(view);
    } catch {
      toast({ title: 'Ошибка сохранения', description: 'Попробуйте позже.' });
    } finally {
      setSaving(false);
    }
  };

  const handleImportExcel = async (file: File | undefined) => {
    if (!file) return;
    const isXlsx =
      file.name.toLowerCase().endsWith('.xlsx') ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isXlsx) {
      toast({ title: 'Неверный формат файла', description: 'Загрузите файл .xlsx' });
      return;
    }
    setImporting(true);
    try {
      const base64 = await fileToBase64(file);
      const resp = await fetch(func2url['shipments-admin'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ action: 'import_excel', fileData: base64 }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось загрузить файл' });
        return;
      }
      const skippedCount = (data.skipped || []).length;
      toast({
        title: `Добавлено посылок: ${data.created}`,
        description: skippedCount
          ? `Пропущено (дубликаты или ошибки): ${skippedCount} — ${(data.skipped as string[]).slice(0, 5).join(', ')}${skippedCount > 5 ? '…' : ''}`
          : undefined,
      });
      if (view === 'active' || view === 'all') load(view);
    } catch {
      toast({ title: 'Ошибка загрузки файла', description: 'Попробуйте позже.' });
    } finally {
      setImporting(false);
    }
  };

  const confirmIssue = async () => {
    if (!issueTarget) return;
    setIssuing(true);
    try {
      const resp = await fetch(func2url['shipments-admin'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ action: 'issue', id: issueTarget.id }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось выдать посылку' });
        return;
      }
      toast({ title: 'Посылка выдана', description: `№ ${issueTarget.trackingNumber}` });
      setShipments((prev) => prev.filter((s) => s.id !== issueTarget.id));
      setIssueTarget(null);
    } catch {
      toast({ title: 'Ошибка', description: 'Попробуйте позже.' });
    } finally {
      setIssuing(false);
    }
  };

  const confirmSendToVdnh = async () => {
    if (!sendToVdnhTarget) return;
    setSendingToVdnh(true);
    try {
      const resp = await fetch(func2url['shipments-admin'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ action: 'send_to_vdnh', id: sendToVdnhTarget.id }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось отправить изделие в Москву' });
        return;
      }
      if (data.emailError) {
        toast({
          title: 'Отправлено, но письмо не ушло',
          description: `№ ${sendToVdnhTarget.trackingNumber} — ошибка почты: ${data.emailError}`,
        });
      } else {
        toast({
          title: 'Изделие отправлено в Москву',
          description: `№ ${sendToVdnhTarget.trackingNumber} — клиенту отправлено уведомление`,
        });
      }
      setShipments((prev) =>
        prev.map((s) => (s.id === sendToVdnhTarget.id ? { ...s, status: 'shipped' } : s)),
      );
      setSendToVdnhTarget(null);
    } catch {
      toast({ title: 'Ошибка', description: 'Попробуйте позже.' });
    } finally {
      setSendingToVdnh(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const resp = await fetch(`${func2url['shipments-admin']}?export=csv&status=${view}`, {
        headers: { 'X-Session-Token': token },
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        toast({ title: data.error || 'Не удалось выгрузить файл' });
        return;
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shipments-${view}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: 'Ошибка экспорта', description: 'Попробуйте позже.' });
    } finally {
      setExporting(false);
    }
  };

  const query = search.trim().toLowerCase();
  const filteredByStatus =
    role === 'suzdal' && statusFilter !== 'all'
      ? shipments.filter((s) => s.status === statusFilter)
      : shipments;
  const filtered = query
    ? filteredByStatus.filter(
        (s) =>
          s.trackingNumber.toLowerCase().includes(query) ||
          s.customerName.toLowerCase().includes(query) ||
          (s.customerEmail || '').toLowerCase().includes(query) ||
          s.customerPhone.replace(/\D/g, '').includes(query.replace(/\D/g, '')),
      )
    : filteredByStatus;

  type SortKey = 'trackingNumber' | 'customerName' | 'deliveredAt';
  const { sorted, sort, toggleSort } = useSortableData<Shipment, SortKey>(filtered, (item, key) => {
    if (key === 'trackingNumber') return item.trackingNumber || '';
    if (key === 'customerName') return item.customerName || '';
    if (key === 'deliveredAt') return item.deliveredAt ? new Date(item.deliveredAt).getTime() : 0;
    return '';
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mt-6 space-y-6">
      {/* ФОРМА ДОБАВЛЕНИЯ — только для Суздаля */}
      {role === 'suzdal' && (
        <ShipmentCreateForm
          formTracking={formTracking}
          setFormTracking={setFormTracking}
          formName={formName}
          setFormName={setFormName}
          formPhone={formPhone}
          setFormPhone={setFormPhone}
          formEmail={formEmail}
          setFormEmail={setFormEmail}
          formDate={formDate}
          setFormDate={setFormDate}
          saving={saving}
          onSubmit={handleCreate}
          excelInputRef={excelInputRef}
          importing={importing}
          onImportExcel={handleImportExcel}
        />
      )}

      {/* СПИСОК */}
      <ShipmentsTable
        view={view}
        setView={setView}
        role={role}
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        exporting={exporting}
        onExport={handleExport}
        filtered={filtered}
        loading={loading}
        paginated={paginated}
        page={page}
        totalPages={totalPages}
        onIssueTarget={setIssueTarget}
        onSendToVdnhTarget={setSendToVdnhTarget}
        onPhotoPreview={setPhotoPreview}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        PER_PAGE={PER_PAGE}
        sort={sort}
        onSort={toggleSort}
      />

      <ShipmentIssueDialog
        issueTarget={issueTarget}
        setIssueTarget={setIssueTarget}
        issuing={issuing}
        onConfirm={confirmIssue}
      />

      {/* ОТПРАВКА НА ВДНХ */}
      <AlertDialog open={!!sendToVdnhTarget} onOpenChange={(v) => !v && setSendToVdnhTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отправить изделие в Москву?</AlertDialogTitle>
            <AlertDialogDescription>
              Заявка № {sendToVdnhTarget?.trackingNumber} клиента {sendToVdnhTarget?.customerName}{' '}
              перейдёт в статус «Отправлено в Москву», клиенту придёт письмо с адресом и контактами.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSendToVdnh} disabled={sendingToVdnh}>
              {sendingToVdnh ? 'Отправляем…' : 'Отправить'}
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

export default AdminShipments;