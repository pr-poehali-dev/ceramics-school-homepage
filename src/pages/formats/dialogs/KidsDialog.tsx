import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { openBooking } from '@/lib/booking';

const OPTIONS = [
  { value: 'single', label: 'Разовый', price: 1900 },
  { value: 'gift', label: 'Подарочный сертификат', price: 1900 },
];

const KidsDialog = ({ children, autoOpen }: { children: ReactNode; autoOpen?: boolean }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);
  const [type, setType] = useState('single');
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const selected = OPTIONS.find((o) => o.value === type)!;
  const total = selected.price * qty;

  const isGift = type === 'gift';
  const isSingleOne = type === 'single' && qty === 1;
  const isGroupRequest = type === 'single' && qty > 1;

  const handleBuy = () => {
    addItem({
      id: `kids-${type}${isGroupRequest ? '-group' : ''}`,
      title: 'Детская группа (сб/вс)',
      details: selected.label,
      price: selected.price,
      qty,
      ...(isGroupRequest && {
        booking: {
          email: '',
          phone: '',
          service: 'Детская группа (сб/вс)',
          people: qty,
        },
      }),
    });
    setOpen(false);
    navigate('/moscow/checkout');
  };

  const handleEnroll = () => {
    setOpen(false);
    openBooking();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
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
            <p className="mb-2 text-sm font-medium">
              {isGift ? 'Количество' : 'Количество участников'}
            </p>
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

          {/* Сообщение для группы (разовый, >1 участника) */}
          {isGroupRequest && (
            <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
              <Icon name="Info" size={18} className="mt-0.5 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">
                После оплаты с Вами свяжется представитель Школы керамики и уточнит выбор даты и
                времени посещения.
              </p>
            </div>
          )}

          {/* Итого показываем для покупки (подарочный, разовый 1 или группа) */}
          {!isSingleOne && (
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Итого</span>
              <span className="font-display text-2xl font-semibold text-primary">
                {total.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          )}

          {/* Кнопка меняется в зависимости от выбора */}
          {isSingleOne ? (
            <Button onClick={handleEnroll} size="lg" className="w-full rounded-full">
              <Icon name="CalendarCheck" size={18} className="mr-2" /> Записаться
            </Button>
          ) : (
            <Button onClick={handleBuy} size="lg" className="w-full rounded-full">
              <Icon name="ShoppingCart" size={18} className="mr-2" /> Купить
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KidsDialog;