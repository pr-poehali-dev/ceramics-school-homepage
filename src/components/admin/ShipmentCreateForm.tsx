import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPhoneInput } from '@/lib/phoneMask';

interface Props {
  formTracking: string;
  setFormTracking: (v: string) => void;
  formName: string;
  setFormName: (v: string) => void;
  formPhone: string;
  setFormPhone: (v: string) => void;
  formEmail: string;
  setFormEmail: (v: string) => void;
  formDate: string;
  setFormDate: (v: string) => void;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
  excelInputRef: React.RefObject<HTMLInputElement>;
  importing: boolean;
  onImportExcel: (file: File | undefined) => void;
}

const ShipmentCreateForm = ({
  formTracking,
  setFormTracking,
  formName,
  setFormName,
  formPhone,
  setFormPhone,
  formEmail,
  setFormEmail,
  formDate,
  setFormDate,
  saving,
  onSubmit,
  excelInputRef,
  importing,
  onImportExcel,
}: Props) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="font-display text-lg font-semibold">Добавить посылку</h3>
      <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            onImportExcel(e.target.files?.[0]);
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
          Файл .xlsx с колонками: Номер посылки, ФИО клиента, Телефон клиента, Дата доставки в
          Москву, Email (необязательно) (те же поля, что и в форме выше)
        </p>
      </div>
    </div>
  );
};

export default ShipmentCreateForm;
