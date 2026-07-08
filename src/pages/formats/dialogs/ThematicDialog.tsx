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
import { THEMATIC_WORKSHOPS, ThematicWorkshop } from '../thematicData';

const ThematicDialog = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ThematicWorkshop | null>(null);
  const [ticket, setTicket] = useState<'single' | 'gift'>('single');
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const openDetail = (w: ThematicWorkshop) => {
    setSelected(w);
    setTicket(w.defaultTicket);
    setQty(1);
  };

  const handleBuy = () => {
    if (!selected) return;
    const ticketLabel = ticket === 'gift' ? 'Подарочный сертификат' : 'Разовый билет';
    addItem({
      id: `thematic-${selected.id}-${ticket}`,
      title: `Тематический МК «${selected.title}»`,
      details: ticketLabel,
      price: selected.price,
      qty,
    });
    setOpen(false);
    toast({ title: 'Добавлено в корзину', description: `${selected.title} — ${qty} шт.` });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setSelected(null);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        {!selected ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Тематические мастер-классы</DialogTitle>
              <DialogDescription>Выберите мастер-класс — создайте конкретное изделие</DialogDescription>
            </DialogHeader>

            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              {THEMATIC_WORKSHOPS.map((w) => (
                <button
                  key={w.id}
                  onClick={() => openDetail(w)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left transition-all hover:border-primary/60 hover:shadow-lg"
                >
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={w.image}
                      alt={w.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-display text-lg font-semibold">{w.title}</h3>
                    <p className="mt-1 flex-1 text-sm text-muted-foreground">{w.tagline}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-semibold text-primary">
                        {w.price.toLocaleString('ru-RU')} ₽
                      </span>
                      <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Подробнее <Icon name="ArrowRight" size={15} />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <button
                onClick={() => setSelected(null)}
                className="mb-1 flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon name="ArrowLeft" size={16} /> Ко всем мастер-классам
              </button>
              <DialogTitle className="font-display text-2xl">{selected.title}</DialogTitle>
              <DialogDescription>{selected.tagline}</DialogDescription>
            </DialogHeader>

            <div className="mt-2 overflow-hidden rounded-2xl">
              <img src={selected.image} alt={selected.title} className="h-56 w-full object-cover" />
            </div>

            {selected.meta.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selected.meta.map((m) => (
                  <span
                    key={m.label}
                    className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs"
                  >
                    <span className="text-muted-foreground">{m.label}:</span>{' '}
                    <span className="font-medium">{m.value}</span>
                  </span>
                ))}
              </div>
            )}

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{selected.intro}</p>

            <div className="mt-4 space-y-4">
              {selected.sections.map((s, idx) => (
                <div key={idx}>
                  {s.heading && <p className="mb-1.5 text-sm font-semibold">{s.heading}</p>}
                  {s.text && (
                    <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                  )}
                  {s.list && (
                    <ul className="space-y-1.5">
                      {s.list.map((li, i) => (
                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                          <Icon name="Check" size={16} className="mt-0.5 shrink-0 text-primary" />
                          <span>{li}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
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
                  htmlFor="ticket-single"
                  className={`flex cursor-pointer items-center justify-between rounded-xl border bg-background p-3 transition-colors ${
                    ticket === 'single' ? 'border-primary' : 'border-border'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <RadioGroupItem value="single" id="ticket-single" />
                    <span className="text-sm font-medium">Разовый билет</span>
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {selected.price.toLocaleString('ru-RU')} ₽
                  </span>
                </label>
                {selected.giftAvailable && (
                  <label
                    htmlFor="ticket-gift"
                    className={`flex cursor-pointer items-center justify-between rounded-xl border bg-background p-3 transition-colors ${
                      ticket === 'gift' ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <RadioGroupItem value="gift" id="ticket-gift" />
                      <span className="text-sm font-medium">Подарочный сертификат</span>
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {selected.price.toLocaleString('ru-RU')} ₽
                    </span>
                  </label>
                )}
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
                    {(selected.price * qty).toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </div>

              <Button onClick={handleBuy} size="lg" className="mt-4 w-full rounded-full">
                <Icon name="ShoppingCart" size={18} className="mr-2" /> Купить
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ThematicDialog;
