import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/context/CartContext';

interface CheckoutSummaryProps {
  items: CartItem[];
  total: number;
  loading: boolean;
}

const CheckoutSummary = ({ items, total, loading }: CheckoutSummaryProps) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-6">
      <h2 className="font-display text-xl font-semibold">Ваш заказ</h2>
      <div className="mt-4 space-y-2 text-sm">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between gap-2 text-muted-foreground">
            <span className="line-clamp-1">
              {item.title} × {item.qty}
            </span>
            <span className="whitespace-nowrap">
              {(item.price * item.qty).toLocaleString('ru-RU')} ₽
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
        <span className="font-semibold">Итого:</span>
        <span className="font-display text-2xl font-semibold text-primary">
          {total.toLocaleString('ru-RU')} руб.
        </span>
      </div>
      <Button type="submit" size="lg" disabled={loading} className="mt-6 w-full rounded-full">
        {loading ? (
          <>
            <Icon name="Loader2" size={18} className="mr-2 animate-spin" /> Оформляем…
          </>
        ) : (
          <>
            <Icon name="CreditCard" size={18} className="mr-2" /> Оформить заказ
          </>
        )}
      </Button>
    </div>
  );
};

export default CheckoutSummary;
