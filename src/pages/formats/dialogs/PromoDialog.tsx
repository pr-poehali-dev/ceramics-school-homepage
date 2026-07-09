import { useState, useEffect, ReactNode } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

const SERVICES = [
  {
    value: 'lepka',
    label: 'Лепка из глины',
    note: 'изделие после обжига',
    prices: { small: 1600, big: 1400 },
  },
  {
    value: 'akril',
    label: 'Роспись акрилом',
    note: 'изделие забирается сразу через 15 минут',
    prices: { small: 1500, big: 1500 },
  },
  {
    value: 'angoby',
    label: 'Роспись ангобами',
    note: 'изделие забирается через 14–16 дней',
    prices: { small: 1100, big: 1000 },
  },
];

const RANGES = [
  { value: 'small', label: 'От 10 до 20 человек', min: 10, max: 20 },
  { value: 'big', label: 'От 21 до 30 человек', min: 21, max: 30 },
];

const PromoDialog = ({ children, autoOpen }: { children: ReactNode; autoOpen?: boolean }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);
  const [service, setService] = useState('lepka');
  const [range, setRange] = useState('small');
  const { addItem } = useCart();
  const { toast } = useToast();

  const selectedService = SERVICES.find((s) => s.value === service)!;
  const selectedRange = RANGES.find((r) => r.value === range)!;
  const [people, setPeople] = useState(selectedRange.min);

  const pricePerPerson = selectedService.prices[range as 'small' | 'big'];

  const setRangeAndPeople = (val: string) => {
    setRange(val);
    const r = RANGES.find((x) => x.value === val)!;
    setPeople((p) => Math.min(Math.max(p, r.min), r.max));
  };

  const clampedPeople = Math.min(Math.max(people, selectedRange.min), selectedRange.max);
  const total = pricePerPerson * clampedPeople;

  const handleBuy = () => {
    addItem({
      id: `promo-${service}-${range}-${clampedPeople}`,
      title: 'Промо-группа (пн–пт)',
      details: `${selectedService.label}, ${clampedPeople} чел. × ${pricePerPerson.toLocaleString('ru-RU')} ₽`,
      price: pricePerPerson,
      qty: clampedPeople,
    });
    setOpen(false);
    toast({ title: 'Добавлено в корзину', description: selectedService.label });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Промо-группа (пн–пт)</DialogTitle>
          <DialogDescription>Групповые занятия по тарифу промо</DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium">Услуга</p>
            <RadioGroup value={service} onValueChange={setService} className="space-y-2">
              {SERVICES.map((s) => (
                <label
                  key={s.value}
                  htmlFor={`promo-${s.value}`}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                    service === s.value ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <RadioGroupItem value={s.value} id={`promo-${s.value}`} className="mt-0.5" />
                  <span>
                    <span className="block text-sm font-medium">{s.label}</span>
                    <span className="block text-xs text-muted-foreground">{s.note}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Количество участников</p>
            <RadioGroup value={range} onValueChange={setRangeAndPeople} className="space-y-2">
              {RANGES.map((r) => (
                <label
                  key={r.value}
                  htmlFor={`range-${r.value}`}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors ${
                    range === r.value ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <RadioGroupItem value={r.value} id={`range-${r.value}`} />
                    <span className="text-sm font-medium">{r.label}</span>
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {selectedService.prices[r.value as 'small' | 'big'].toLocaleString('ru-RU')} ₽/чел
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">
              Точное число участников ({selectedRange.min}–{selectedRange.max})
            </p>
            <div className="flex w-fit items-center rounded-full border border-border">
              <button
                onClick={() => setPeople(Math.max(selectedRange.min, clampedPeople - 1))}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon name="Minus" size={16} />
              </button>
              <span className="w-10 text-center font-semibold">{clampedPeople}</span>
              <button
                onClick={() => setPeople(Math.min(selectedRange.max, clampedPeople + 1))}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon name="Plus" size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">
              Итого ({clampedPeople} × {pricePerPerson.toLocaleString('ru-RU')} ₽)
            </span>
            <span className="font-display text-2xl font-semibold text-primary">
              {total.toLocaleString('ru-RU')} ₽
            </span>
          </div>

          <Button onClick={handleBuy} size="lg" className="w-full rounded-full">
            <Icon name="ShoppingCart" size={18} className="mr-2" /> Купить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoDialog;