import { useEffect, useRef, useState } from 'react';
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
import { formatPhoneInput } from '@/lib/phoneMask';
import func2url from '../../../backend/func2url.json';

interface Shipment {
  id: number;
  trackingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveredAt: string | null;
  returnAt: string | null;
  status: string;
  issuedAt: string | null;
}

interface Props {
  token: string;
  role: 'vdnh' | 'suzdal';
}

const PER_PAGE = 20;

const fmtDate = (s: string | null) => {
  if (!s) return '—';
  try {
    return new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return s;
  }
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AdminShipments = ({ token, role }: Props) => {
  const [view, setView] = useState<'active' | 'closed'>('active');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [issueTarget, setIssueTarget] = useState<Shipment | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [formTracking, setFormTracking] = useState('');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDate, setFormDate] = useState(todayISO());
  const [saving, setSaving] = useState(false);

  const excelInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const load = async (status: 'active' | 'closed') => {
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
      if (view === 'active') load('active');
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
      if (view === 'active') load('active');
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
  const filtered = query
    ? shipments.filter(
        (s) =>
          s.trackingNumber.toLowerCase().includes(query) ||
          s.customerName.toLowerCase().includes(query) ||
          (s.customerEmail || '').toLowerCase().includes(query) ||
          s.customerPhone.replace(/\D/g, '').includes(query.replace(/\D/g, '')),
      )
    : shipments;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mt-6 space-y-6">
      {/* ФОРМА ДОБАВЛЕНИЯ — только для Суздаля */}
      {role === 'suzdal' && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold">Добавить посылку</h3>
          <form onSubmit={handleCreate} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="ship-tracking">Номер посылки</Label>
              <Input
                id="ship-tracking"
                value={formTracking}
                onChange={(e) => setFormTracking(e.target.value)}
                placeholder="Например: SZD-0231"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="ship-name">ФИО клиента</Label>
              <Input
                id="ship-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Иванова Мария"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="ship-phone">Телефон клиента</Label>
              <Input
                id="ship-phone"
                type="tel"
                value={formPhone}
                onChange={(e) => setFormPhone(formatPhoneInput(e.target.value))}
                placeholder="+7 (___) ___-__-__"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="ship-email">Email клиента</Label>
              <Input
                id="ship-email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="client@example.com"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="ship-date">Дата доставки в Москву</Label>
              <Input
                id="ship-date"
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <Button type="submit" className="rounded-full" disabled={saving}>
                {saving ? 'Сохраняем…' : 'Сохранить'}
              </Button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <input
              ref={excelInputRef}
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={(e) => {
                handleImportExcel(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => excelInputRef.current?.click()}
              disabled={importing}
            >
              <Icon name={importing ? 'Loader2' : 'FileSpreadsheet'} size={16} className={`mr-2 ${importing ? 'animate-spin' : ''}`} />
              {importing ? 'Загружаем…' : 'Загрузить из Excel'}
            </Button>
            <p className="text-xs text-muted-foreground">
              Файл .xlsx с колонками: Номер посылки, ФИО клиента, Телефон клиента, Email
              (необязательно), Дата доставки в Москву (те же поля, что и в форме выше)
            </p>
          </div>
        </div>
      )}

      {/* СПИСОК */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setView('active')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                view === 'active' ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'
              }`}
            >
              Активные
            </button>
            {role === 'vdnh' && (
              <button
                onClick={() => setView('closed')}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  view === 'closed' ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'
                }`}
              >
                Закрытые
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Поиск по номеру, ФИО, телефону, email"
              className="h-9 w-64 rounded-full"
            />
            {role === 'vdnh' && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={handleExport}
                disabled={exporting || filtered.length === 0}
              >
                <Icon name="Download" size={14} className="mr-1.5" />
                {exporting ? 'Экспорт…' : 'Экспорт CSV'}
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            <div className="hidden grid-cols-[1fr_1fr_140px_160px_110px_110px_130px_110px] gap-3 border-b border-border bg-secondary/40 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid">
              <span>Номер посылки</span>
              <span>ФИО клиента</span>
              <span>Телефон</span>
              <span>Email</span>
              <span>Доставлено</span>
              <span>Возврат</span>
              {view === 'closed' && <span>Выдано</span>}
              {view === 'active' && role === 'vdnh' && <span>Действие</span>}
            </div>

            {paginated.length === 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">Посылок не найдено.</p>
            )}

            {paginated.map((s) => (
              <div
                key={s.id}
                className={`grid grid-cols-1 gap-2 border-b border-border px-4 py-3 text-sm last:border-0 sm:grid-cols-[1fr_1fr_140px_160px_110px_110px_130px_110px] sm:items-center sm:gap-3 ${
                  view === 'closed' && role !== 'vdnh' ? '' : ''
                }`}
              >
                <span className="font-medium">№ {s.trackingNumber}</span>
                <span>{s.customerName}</span>
                <span className="text-muted-foreground">{s.customerPhone}</span>
                <span className="text-muted-foreground">{s.customerEmail || '—'}</span>
                <span>{fmtDate(s.deliveredAt)}</span>
                <span>{fmtDate(s.returnAt)}</span>
                {view === 'closed' && <span>{fmtDate(s.issuedAt)}</span>}
                {view === 'active' && role === 'vdnh' && (
                  <Button
                    size="sm"
                    className="w-fit rounded-full"
                    onClick={() => setIssueTarget(s)}
                  >
                    Выдать
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {filtered.length > PER_PAGE && (
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
      </div>

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
            <AlertDialogAction onClick={confirmIssue} disabled={issuing}>
              {issuing ? 'Выдаём…' : 'Подтвердить выдачу'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminShipments;