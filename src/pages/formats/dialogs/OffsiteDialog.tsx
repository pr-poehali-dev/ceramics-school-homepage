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

const WORKSHOPS = [
  'Лепка из глины',
  'Гончарный круг',
  'Роспись ангобами',
  'Роспись акрилом',
];

const OffsiteDialog = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    datetime: '',
    workshop: '',
    people: '',
    address: '',
    email: '',
    phone: '',
  });
  const [agree, setAgree] = useState(false);
  const { toast } = useToast();

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const valid =
    form.datetime && form.workshop && form.people && form.address && form.email && form.phone && agree;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setOpen(false);
    toast({
      title: 'Заявка отправлена!',
      description: 'Мы свяжемся с вами в ближайшее время.',
    });
    setForm({ datetime: '', workshop: '', people: '', address: '', email: '', phone: '' });
    setAgree(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Выездной мастер-класс</DialogTitle>
          <DialogDescription>Оставьте заявку — рассчитаем стоимость</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div>
            <Label htmlFor="off-datetime">Дата и время проведения</Label>
            <Input
              id="off-datetime"
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
            <Label htmlFor="off-people">Количество участников</Label>
            <Input
              id="off-people"
              type="number"
              min={1}
              value={form.people}
              onChange={(e) => set('people', e.target.value)}
              placeholder="Например, 15"
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="off-address">Адрес проведения</Label>
            <Input
              id="off-address"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="Город, улица, дом"
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="off-email">Email для связи</Label>
            <Input
              id="off-email"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="off-phone">Телефон для связи</Label>
            <Input
              id="off-phone"
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

export default OffsiteDialog;
