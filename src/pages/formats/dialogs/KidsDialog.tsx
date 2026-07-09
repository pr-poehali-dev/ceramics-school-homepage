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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import func2url from '../../../../backend/func2url.json';

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
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const selected = OPTIONS.find((o) => o.value === type)!;
  const total = selected.price * qty;

  const isGift = type === 'gift';
  const isSingleOne = type === 'single' && qty === 1;
  const isGroupRequest = type === 'single' && qty > 1;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const formValid = emailValid && phone.trim().length >= 6 && agree;

  const handleBuy = () => {
    if (isGroupRequest && !formValid) return;
    addItem({
      id: `kids-${type}${isGroupRequest ? '-group' : ''}`,
      title: 'Детская группа (сб/вс)',
      details: selected.label,
      price: selected.price,
      qty,
      ...(isGroupRequest && {
        booking: {
          email: email.trim(),
          phone: phone.trim(),
          service: 'Детская группа (сб/вс)',
          people: qty,
        },
      }),
    });
    setOpen(false);
    setEmail('');
    setPhone('');
    setAgree(false);
    navigate('/moscow/checkout');
  };

  const handleEnroll = () => {
    // В будущем: открытие стороннего приложения с выбором даты и оплатой.
    toast({
      title: 'Скоро откроется запись',
      description: 'Здесь появится выбор даты и оплата урока.',
    });
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

          {/* Форма заявки для группы (разовый, >1 участника) */}
          {isGroupRequest && (
            <div className="space-y-3 rounded-xl border border-border bg-secondary/30 p-4">
              <p className="text-sm text-muted-foreground">
                Оставьте контакты — после оплаты сотрудник школы свяжется и уточнит дату посещения.
              </p>
              <div>
                <Label htmlFor="kids-email">Email</Label>
                <Input
                  id="kids-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="kids-phone">Телефон</Label>
                <Input
                  id="kids-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  className="mt-1.5"
                />
              </div>
              <label className="flex cursor-pointer items-start gap-2.5">
                <Checkbox
                  checked={agree}
                  onCheckedChange={(v) => setAgree(Boolean(v))}
                  className="mt-0.5"
                />
                <span className="text-xs leading-relaxed text-muted-foreground">
                  Я даю согласие на обработку персональных данных на условиях и для целей,
                  определённых в Согласии на обработку персональных данных.
                </span>
              </label>
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
            <Button
              onClick={handleBuy}
              size="lg"
              className="w-full rounded-full"
              disabled={isGroupRequest && !formValid}
            >
              <Icon name="ShoppingCart" size={18} className="mr-2" /> Купить
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KidsDialog;