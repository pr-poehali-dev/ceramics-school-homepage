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
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface PriceItem {
  id: string;
  label: string;
  unit: string;
  price: number;
}

const CATEGORIES: { title: string; icon: string; items: PriceItem[] }[] = [
  {
    title: 'Аренда рабочего места',
    icon: 'Armchair',
    items: [
      { id: 'wheel', label: 'Гончарный круг (1 участник)', unit: 'час', price: 700 },
      { id: 'modeling', label: 'Лепка — место за столом', unit: 'час', price: 500 },
      { id: 'painting', label: 'Роспись — место, ангобы', unit: 'час', price: 500 },
    ],
  },
  {
    title: 'Глина',
    icon: 'Layers',
    items: [
      { id: 'clay-porcelain', label: 'Глина полуфарфор', unit: 'кг', price: 400 },
      { id: 'clay-chamotte', label: 'Глина шамот', unit: 'кг', price: 400 },
    ],
  },
  {
    title: 'Печь и обжиг',
    icon: 'Flame',
    items: [
      { id: 'shelf-15', label: 'Полка в печи до 15 см', unit: 'обжиг', price: 1700 },
      { id: 'shelf-30', label: 'Полка в печи 15–30 см', unit: 'обжиг', price: 2300 },
      { id: 'kiln-75', label: 'Печь 75 литров', unit: 'цикл', price: 2500 },
      { id: 'kiln-160', label: 'Печь 160 литров', unit: 'цикл', price: 4500 },
      { id: 'fire-15', label: 'Обжиг изделия до 15 см', unit: 'обжиг', price: 150 },
      { id: 'fire-30', label: 'Обжиг изделия 15–30 см', unit: 'обжиг', price: 250 },
    ],
  },
  {
    title: 'Глазурь',
    icon: 'Sparkles',
    items: [
      { id: 'glaze-15', label: 'Бесцветная глазурь до 15 см', unit: 'обжиг', price: 150 },
      { id: 'glaze-30', label: 'Бесцветная глазурь 15–30 см', unit: 'обжиг', price: 250 },
    ],
  },
];

const ALL_ITEMS = CATEGORIES.flatMap((c) => c.items);

const CoworkingDialog = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const { addItem } = useCart();
  const { toast } = useToast();

  const change = (id: string, delta: number) =>
    setQtys((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: next };
    });

  const selectedItems = ALL_ITEMS.filter((i) => (qtys[i.id] || 0) > 0);
  const total = selectedItems.reduce((sum, i) => sum + i.price * qtys[i.id], 0);

  const handleBuy = () => {
    selectedItems.forEach((i) => {
      addItem({
        id: `coworking-${i.id}`,
        title: `Коворкинг: ${i.label}`,
        details: `${qtys[i.id]} × ${i.unit}`,
        price: i.price,
        qty: qtys[i.id],
      });
    });
    setOpen(false);
    setQtys({});
    toast({ title: 'Добавлено в корзину', description: 'Позиции коворкинга добавлены' });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setQtys({});
      }}
    >
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
                {cat.items.map((item) => {
                  const qty = qtys[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition-colors ${
                        qty > 0 ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-tight">{item.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.price.toLocaleString('ru-RU')} ₽ / {item.unit}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center rounded-full border border-border bg-background">
                        <button
                          onClick={() => change(item.id, -1)}
                          disabled={qty === 0}
                          className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-primary disabled:opacity-30"
                          aria-label="Уменьшить"
                        >
                          <Icon name="Minus" size={14} />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold">{qty}</span>
                        <button
                          onClick={() => change(item.id, 1)}
                          className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                          aria-label="Увеличить"
                        >
                          <Icon name="Plus" size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
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

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">
              Итого{selectedItems.length > 0 ? ` (${selectedItems.length} поз.)` : ''}
            </span>
            <span className="font-display text-2xl font-semibold text-primary">
              {total.toLocaleString('ru-RU')} ₽
            </span>
          </div>

          <Button
            onClick={handleBuy}
            size="lg"
            className="w-full rounded-full"
            disabled={selectedItems.length === 0}
          >
            <Icon name="ShoppingCart" size={18} className="mr-2" /> В корзину
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoworkingDialog;
