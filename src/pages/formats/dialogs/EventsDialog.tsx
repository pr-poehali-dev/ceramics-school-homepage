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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const EVENT_TYPES = [
  { value: 'birthday', label: 'День рождения', icon: 'Cake' },
  { value: 'corporate', label: 'Корпоратив', icon: 'Building2' },
  { value: 'hen-party', label: 'Девичник', icon: 'Sparkles' },
  { value: 'hall-rent', label: 'Аренда зала', icon: 'DoorOpen' },
  { value: 'ceramics-2h', label: '2 часа керамики', icon: 'Clock' },
];

const WORKSHOPS = [
  'Лепка из глины',
  'Гончарный круг',
  'Роспись ангобами',
  'Роспись акрилом',
  'Тематический',
];

const EventsDialog = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    eventType: '',
    people: '',
    datetime: '',
    workshop: '',
    email: '',
    phone: '',
  });
  const [agree, setAgree] = useState(false);
  const { toast } = useToast();

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const valid =
    form.eventType &&
    form.people &&
    form.datetime &&
    form.workshop &&
    form.email &&
    form.phone &&
    agree;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setOpen(false);
    toast({
      title: 'Заявка отправлена!',
      description: 'Мы свяжемся с вами в ближайшее время.',
    });
    setForm({ eventType: '', people: '', datetime: '', workshop: '', email: '', phone: '' });
    setAgree(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Мероприятия</DialogTitle>
          <DialogDescription>Оставьте заявку — организуем праздник под ключ</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div>
            <Label className="mb-2 block">Тип мероприятия</Label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => set('eventType', t.value)}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all ${
                    form.eventType === t.value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  <Icon name={t.icon} size={15} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="ev-people">Количество человек (от 10 до 40)</Label>
            <Input
              id="ev-people"
              type="number"
              min={10}
              max={40}
              value={form.people}
              onChange={(e) => set('people', e.target.value)}
              placeholder="Например, 20"
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="ev-datetime">Дата и время проведения</Label>
            <Input
              id="ev-datetime"
              type="datetime-local"
              value={form.datetime}
              onChange={(e) => set('datetime', e.target.value)}
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label>Мастер-класс</Label>
            <Select value={form.workshop} onValueChange={(v) => set('workshop', v)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Выберите мастер-класс" />
              </SelectTrigger>
              <SelectContent>
                {WORKSHOPS.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="ev-email">Email для связи</Label>
            <Input
              id="ev-email"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="ev-phone">Телефон для связи</Label>
            <Input
              id="ev-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="+7 (___) ___-__-__"
              className="mt-1.5"
              required
            />
          </div>

          <label className="flex cursor-pointer items-start gap-2.5">
            <Checkbox
              checked={agree}
              onCheckedChange={(v) => setAgree(Boolean(v))}
              className="mt-0.5"
            />
            <span className="text-xs leading-relaxed text-muted-foreground">
              Я даю своё согласие на обработку моих персональных данных, на условиях и для целей,
              определённых в Согласии на обработку персональных данных
            </span>
          </label>

          <Button type="submit" size="lg" className="w-full rounded-full" disabled={!valid}>
            <Icon name="Send" size={18} className="mr-2" /> Отправить заявку
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventsDialog;
