import { useState, ReactNode } from 'react';
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

const OPTIONS = [
  { value: 'single', label: 'Разовый', price: 1900 },
  { value: 'gift', label: 'Подарочный сертификат', price: 1900 },
];

const KidsDialog = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('single');
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const selected = OPTIONS.find((o) => o.value === type)!;
  const total = selected.price * qty;

  const handleBuy = () => {
    addItem({
      id: `kids-${type}`,
      title: 'Детская группа (сб/вс)',
      details: selected.label,
      price: selected.price,
      qty,
    });
    setOpen(false);
    toast({ title: 'Добавлено в корзину', description: `${selected.label} — ${qty} шт.` });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Детская группа (сб/вс)</DialogTitle>
          <DialogDescription>Выберите вариант услуги и количество</DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium">Тип услуги</p>
            <RadioGroup value={type} onValueChange={setType} className="space-y-2">
              {OPTIONS.map((o) => (
                <label
                  key={o.value}
                  htmlFor={`kids-${o.value}`}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors ${
                    type === o.value ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <RadioGroupItem value={o.value} id={`kids-${o.value}`} />
                    <span className="text-sm font-medium">{o.label}</span>
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {o.price.toLocaleString('ru-RU')} ₽
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Количество</p>
            <div className="flex w-fit items-center rounded-full border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon name="Minus" size={16} />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon name="Plus" size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">Итого</span>
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

export default KidsDialog;