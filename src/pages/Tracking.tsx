import { useState } from 'react';
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
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ShipmentRequestForm from '@/components/ShipmentRequestForm';
import { useCity } from '@/hooks/useCity';
import { usePageMeta } from '@/hooks/usePageMeta';
import { formatPhoneInput } from '@/lib/phoneMask';
import func2url from '../../backend/func2url.json';

const COURIER_PHONE = '+79854198903';

interface Shipment {
  trackingNumber: string;
  status: string;
  deliveredAt: string | null;
  returnAt: string | null;
}

const fmtDate = (s: string | null) => {
  if (!s) return '—';
  try {
    return new Date(s).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return s;
  }
};

const Tracking = () => {
  const city = useCity();
  usePageMeta({
    title: 'Отследить готовое изделие — «Дымов Керамика»',
    description: 'Узнайте статус вашего готового керамического изделия по номеру телефона.',
  });

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [error, setError] = useState('');
  const [courierConfirmOpen, setCourierConfirmOpen] = useState(false);
  const [mode, setMode] = useState<'find' | 'add'>('find');

  const isValid = phone.replace(/\D/g, '').length === 11;

  const handleSearch = async () => {
    if (!isValid) return;
    setLoading(true);
    setError('');
    try {
      const resp = await fetch(`${func2url['shipments-tracking']}?phone=${encodeURIComponent(phone)}`);
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || 'Не удалось выполнить поиск');
        setShipments([]);
      } else {
        setShipments(data.shipments || []);
      }
    } catch {
      setError('Не удалось выполнить поиск. Попробуйте позже.');
      setShipments([]);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader />

      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Icon name="PackageSearch" size={16} /> Отслеживание готовых работ
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
              {mode === 'find' ? (
                <>Где моё <span className="text-primary italic">изделие?</span></>
              ) : (
                <>Добавить <span className="text-primary italic">заявку</span></>
              )}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {mode === 'find' && 'Введите номер телефона, для уточнения статуса.'}
            </p>
          </div>

          {mode === 'add' && (
            <div className="mx-auto mt-6 flex max-w-md items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <Icon name="Info" size={18} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">
                Сюда добавляются только изделия, сделанные на мастер-классе в Москве. Изделия,
                сделанные в Суздале, уже учтены — их не нужно добавлять повторно.
              </p>
            </div>
          )}

          {/* MODE SWITCH */}
          <div className="mx-auto mt-8 grid w-full max-w-md grid-cols-2 gap-2 rounded-full border border-border bg-secondary/40 p-1.5">
            <button
              type="button"
              onClick={() => setMode('find')}
              className={`flex items-center justify-center gap-1 whitespace-nowrap rounded-full px-2 py-2.5 text-xs font-semibold transition-colors sm:gap-1.5 sm:px-4 sm:text-sm ${
                mode === 'find' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Search" size={14} className="shrink-0 sm:hidden" />
              <Icon name="Search" size={15} className="hidden shrink-0 sm:block" />
              Найти
            </button>
            <button
              type="button"
              onClick={() => setMode('add')}
              className={`flex items-center justify-center gap-1 whitespace-nowrap rounded-full px-2 py-2.5 text-xs font-semibold transition-colors sm:gap-1.5 sm:px-4 sm:text-sm ${
                mode === 'add' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="Camera" size={14} className="shrink-0 sm:hidden" />
              <Icon name="Camera" size={15} className="hidden shrink-0 sm:block" />
              Добавить заявку
            </button>
          </div>

          {mode === 'find' ? (
            <div className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                  placeholder="Введите номер телефона"
                  className="h-12 flex-1 rounded-xl text-base"
                  required
                />
                <Button type="submit" size="lg" className="h-12 rounded-xl px-8" disabled={!isValid || loading}>
                  {loading ? (
                    <Icon name="Loader2" size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Icon name="Search" size={18} className="mr-2" /> Найти
                    </>
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8">
              <ShipmentRequestForm />
            </div>
          )}

          {/* RESULTS */}
          {mode === 'find' && searched && !loading && (
            <div className="mt-8">
              {error && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
                  <Icon name="PackageX" size={32} className="mx-auto mb-3 text-destructive" />
                  <p className="font-medium text-destructive">{error}</p>
                </div>
              )}

              {!error && shipments.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                  <Icon name="PackageX" size={36} className="mx-auto mb-3 text-muted-foreground/50" />
                  <p className="font-medium">
                    По вашему номеру ничего не найдено. Проверьте данные или свяжитесь с нами:
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Суздаль: 8-915-157-64-85
                    <br />
                    Москва: +7 (985) 419-89-03
                  </p>
                </div>
              )}

              {!error && shipments.length > 0 && (
                <div className="space-y-5">
                  {shipments.map((s) => (
                    <div key={s.trackingNumber} className="overflow-hidden rounded-2xl border border-border bg-card">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/30 px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <Icon name="Package" size={18} className="text-primary" />
                          <span className="font-display text-lg font-semibold">№ {s.trackingNumber}</span>
                        </div>
                        <span className="rounded-full bg-primary/10 px-3.5 py-1 text-sm font-medium text-primary">
                          {s.status === 'issued' ? 'Выдано' : 'Отправлено в Москву'}
                        </span>
                      </div>

                      <div className="p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                              Дата доставки в Москву
                            </p>
                            <p className="mt-1 font-medium">{fmtDate(s.deliveredAt)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                              Срок хранения
                            </p>
                            <p className="mt-1 font-medium">30 календарных дней</p>
                          </div>
                        </div>

                        {s.status !== 'issued' && (
                          <>
                            <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                              <Icon name="AlertTriangle" size={18} className="mt-0.5 shrink-0 text-amber-600" />
                              <div>
                                <p className="text-sm text-amber-800">
                                  По истечении 30 календарных дней посылка автоматически возвращается на хранение в Суздаль
                                </p>
                                <p className="mt-1.5 text-sm font-semibold text-amber-900">
                                  Дата возврата в Суздаль: {fmtDate(s.returnAt)}
                                </p>
                              </div>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                              <div>
                                <Button
                                  variant="outline"
                                  className="w-full rounded-xl"
                                  onClick={() => setCourierConfirmOpen(true)}
                                >
                                  <Icon name="Truck" size={16} className="mr-2" /> Заказать курьера
                                </Button>
                                <p className="mt-1.5 text-center text-xs text-muted-foreground">
                                  Курьерская доставка доступна только в пределах МКАД
                                </p>
                              </div>
                              <a href={`/${city}/contacts`} target="_blank" rel="noreferrer">
                                <Button variant="outline" className="w-full rounded-xl">
                                  <Icon name="MapPin" size={16} className="mr-2" /> Заберу сам
                                </Button>
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* COURIER CONFIRM DIALOG */}
      <AlertDialog open={courierConfirmOpen} onOpenChange={setCourierConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Позвонить для заказа курьера?</AlertDialogTitle>
            <AlertDialogDescription>
              Мы соединим Вас с администратором школы керамики по номеру {COURIER_PHONE}. Курьерская доставка доступна только в пределах МКАД.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction asChild>
              <a href={`tel:${COURIER_PHONE}`}>
                <Icon name="Phone" size={16} className="mr-2" /> Позвонить
              </a>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SiteFooter />
    </div>
  );
};

export default Tracking;