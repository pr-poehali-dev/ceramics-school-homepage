import { useState, useEffect, ReactNode } from 'react';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PriceItem {
  label: string;
  unit: string;
  price: number;
}

const CATEGORIES: { title: string; icon: string; items: PriceItem[] }[] = [
  {
    title: 'Аренда рабочего места',
    icon: 'Armchair',
    items: [
      { label: 'Гончарный круг (1 участник)', unit: 'час', price: 700 },
      { label: 'Лепка — место за столом', unit: 'час', price: 500 },
      { label: 'Роспись — место, ангобы', unit: 'час', price: 500 },
    ],
  },
  {
    title: 'Глина',
    icon: 'Layers',
    items: [
      { label: 'Глина полуфарфор', unit: 'кг', price: 400 },
      { label: 'Глина шамот', unit: 'кг', price: 400 },
    ],
  },
  {
    title: 'Печь и обжиг',
    icon: 'Flame',
    items: [
      { label: 'Полка в печи до 15 см', unit: 'обжиг', price: 1700 },
      { label: 'Полка в печи 15–30 см', unit: 'обжиг', price: 2300 },
      { label: 'Печь 75 литров', unit: 'цикл', price: 2500 },
      { label: 'Печь 160 литров', unit: 'цикл', price: 4500 },
      { label: 'Обжиг изделия до 15 см', unit: 'обжиг', price: 150 },
      { label: 'Обжиг изделия 15–30 см', unit: 'обжиг', price: 250 },
    ],
  },
  {
    title: 'Глазурь',
    icon: 'Sparkles',
    items: [
      { label: 'Бесцветная глазурь до 15 см', unit: 'обжиг', price: 150 },
      { label: 'Бесцветная глазурь 15–30 см', unit: 'обжиг', price: 250 },
    ],
  },
];

const CoworkingDialog = ({ children, autoOpen }: { children: ReactNode; autoOpen?: boolean }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Коворкинг на ВДНХ</DialogTitle>
          <DialogDescription>
            Аренда рабочего места и оборудования. Ежедневно с 11:00 до 20:00
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          {CATEGORIES.map((cat) => (
            <div key={cat.title}>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Icon name={cat.icon} size={16} className="text-primary" /> {cat.title}
              </p>
              <div className="space-y-2">
                {cat.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
                  >
                    <p className="min-w-0 flex-1 text-sm font-medium leading-tight">{item.label}</p>
                    <p className="shrink-0 text-sm font-semibold text-primary">
                      {item.price.toLocaleString('ru-RU')} ₽ / {item.unit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-2 rounded-xl bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
            <p className="flex gap-2">
              <Icon name="Info" size={14} className="mt-0.5 shrink-0 text-primary" />
              В коворкинг по росписи входит роспись ангобами. Роспись глазурями оплачивается как
              отдельный мастер-класс.
            </p>
            <p className="flex gap-2">
              <Icon name="TriangleAlert" size={14} className="mt-0.5 shrink-0 text-primary" />
              За результат обжига изделий, сделанных не на мастер-классе, компания ответственности не
              несёт.
            </p>
            <p className="flex gap-2">
              <Icon name="Phone" size={14} className="mt-0.5 shrink-0 text-primary" />
              Перед оплатой обязательно запишитесь и проконсультируйтесь: 8 (985) 419-89-03.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoworkingDialog;
