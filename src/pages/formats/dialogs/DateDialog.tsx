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

const PRICE = 7000;
const IMAGE =
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/0691624f-cc62-4d3b-8069-e5ab1d935b18.png';

const META = [
  { label: 'Участников', value: '2 за 1 кругом' },
  { label: 'Длительность', value: '1 ч 30 мин' },
  { label: 'Готово через', value: '3 недели' },
  { label: 'Код', value: 'ВДНХ-0008-Р' },
];

const DateDialog = ({ children, autoOpen }: { children: ReactNode; autoOpen?: boolean }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);
  const [ticket, setTicket] = useState<'single' | 'gift'>('single');
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const ticketLabel = ticket === 'gift' ? 'Подарочный сертификат' : 'Разовый билет';

  const isSingleOne = ticket === 'single' && qty === 1;
  const isSingleGroup = ticket === 'single' && qty > 1;

  const handleBuy = () => {
    addItem({
      id: `date-${ticket}${isSingleGroup ? '-group' : ''}`,
      title: 'Свидание в мастерской',
      details: ticketLabel,
      price: PRICE,
      qty,
      ...(isSingleGroup && {
        booking: {
          email: '',
          phone: '',
          service: 'Свидание в мастерской',
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
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Свидание в мастерской</DialogTitle>
          <DialogDescription>Романтический мастер-класс за гончарным кругом</DialogDescription>
        </DialogHeader>

        <div className="mt-2 overflow-hidden rounded-2xl">
          <img src={IMAGE} alt="Свидание в мастерской" className="h-56 w-full object-cover" />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {META.map((m) => (
            <span
              key={m.label}
              className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs"
            >
              <span className="text-muted-foreground">{m.label}:</span>{' '}
              <span className="font-medium">{m.value}</span>
            </span>
          ))}
        </div>

        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Свидание за гончарным кругом позволит вам создать изделие, наполненное только вашей
            любовью. Два участника за одним кругом создают своё уникальное изделие и сразу расписывают
            его.
          </p>
          <p>
            В нашей мастерской нет раздражающих факторов и суеты — всё полно романтики и вдохновения.
            Опытный мастер объяснит азы гончарного мастерства: как готовить глину, центровать и
            выкручивать на круге различные изделия.
          </p>
          <p>
            После изготовления изделия остаются в мастерской на просушку и обжиги. После первого
            обжига мастер самостоятельно покрывает работу глазурью. Забрать готовое изделие можно
            через 3 недели. Обращаем внимание, что все занятия в школе групповые.
          </p>
        </div>

        {/* PURCHASE */}
        <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-5">
          <p className="mb-2 text-sm font-medium">Билет</p>
          <RadioGroup
            value={ticket}
            onValueChange={(v) => setTicket(v as 'single' | 'gift')}
            className="space-y-2"
          >
            <label
              htmlFor="date-single"
              className={`flex cursor-pointer items-center justify-between rounded-xl border bg-background p-3 transition-colors ${
                ticket === 'single' ? 'border-primary' : 'border-border'
              }`}
            >
              <span className="flex items-center gap-3">
                <RadioGroupItem value="single" id="date-single" />
                <span className="text-sm font-medium">Разовый билет</span>
              </span>
              <span className="text-sm font-semibold text-primary">
                {PRICE.toLocaleString('ru-RU')} ₽
              </span>
            </label>
            <label
              htmlFor="date-gift"
              className={`flex cursor-pointer items-center justify-between rounded-xl border bg-background p-3 transition-colors ${
                ticket === 'gift' ? 'border-primary' : 'border-border'
              }`}
            >
              <span className="flex items-center gap-3">
                <RadioGroupItem value="gift" id="date-gift" />
                <span className="text-sm font-medium">Подарочный сертификат</span>
              </span>
              <span className="text-sm font-semibold text-primary">
                {PRICE.toLocaleString('ru-RU')} ₽
              </span>
            </label>
          </RadioGroup>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm font-medium">Количество</p>
              <div className="flex w-fit items-center rounded-full border border-border bg-background">
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
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Итого</p>
              <p className="font-display text-2xl font-semibold text-primary">
                {(PRICE * qty).toLocaleString('ru-RU')} ₽
              </p>
            </div>
          </div>

          {isSingleGroup && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
              <Icon name="Info" size={18} className="mt-0.5 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">
                После оплаты с Вами свяжется представитель Школы керамики и уточнит выбор даты и
                времени посещения.
              </p>
            </div>
          )}

          {isSingleOne ? (
            <Button onClick={handleEnroll} size="lg" className="mt-4 w-full rounded-full">
              <Icon name="CalendarCheck" size={18} className="mr-2" /> Записаться
            </Button>
          ) : (
            <Button onClick={handleBuy} size="lg" className="mt-4 w-full rounded-full">
              <Icon name="ShoppingCart" size={18} className="mr-2" /> Купить
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DateDialog;