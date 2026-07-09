import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  const { items, removeItem, updateQty, clear, total, count } = useCart();

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader />

      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <Icon name="ShoppingCart" size={28} className="text-primary" />
            <h1 className="font-display text-4xl font-semibold md:text-5xl">Корзина</h1>
          </div>

          {items.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-border py-20 text-center">
              <Icon name="ShoppingBag" size={44} className="mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg font-medium">Корзина пуста</p>
              <p className="mt-1 text-sm text-muted-foreground">Выберите услугу или мастер-класс</p>
              <Button asChild className="mt-6 rounded-full px-7">
                <Link to="/formats">
                  <Icon name="LayoutGrid" size={16} className="mr-2" /> К форматам
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mt-8 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                      {item.details && (
                        <p className="mt-1 text-sm text-muted-foreground">{item.details}</p>
                      )}
                      <p className="mt-1 text-sm font-semibold text-primary">
                        {item.price.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                          aria-label="Уменьшить"
                        >
                          <Icon name="Minus" size={15} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
                          aria-label="Увеличить"
                        >
                          <Icon name="Plus" size={15} />
                        </button>
                      </div>

                      <span className="w-24 text-right font-semibold">
                        {(item.price * item.qty).toLocaleString('ru-RU')} ₽
                      </span>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label="Удалить"
                      >
                        <Icon name="Trash2" size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row">
                <button
                  onClick={clear}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Icon name="Trash2" size={15} /> Очистить корзину
                </button>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Итого ({count} шт.)</p>
                  <p className="font-display text-3xl font-semibold text-primary">
                    {total.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </div>

              <Button asChild size="lg" className="mt-6 w-full rounded-full">
                <Link to="/checkout">
                  <Icon name="CreditCard" size={18} className="mr-2" /> Оформить заказ
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default Cart;