import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import MobileMenu from '@/components/MobileMenu';
import Logo from '@/components/Logo';
import SocialLinks from '@/components/SocialLinks';
import ReviewLinks from '@/components/ReviewLinks';
import DesktopNav from '@/components/DesktopNav';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  const { items, removeItem, updateQty, clear, total, count } = useCart();

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/moscow" className="flex items-center">
            <Logo scale={false} />
          </Link>
          <DesktopNav />
          <a
            href="tel:+79854198903"
            className="hidden items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary md:flex"
          >
            <Icon name="Phone" size={18} className="text-primary" /> +7 (985) 419-89-03
          </a>
          <MobileMenu />
        </div>
      </header>

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

              <Button size="lg" className="mt-6 w-full rounded-full">
                <Icon name="CreditCard" size={18} className="mr-2" /> Оформить заказ
              </Button>
            </>
          )}
        </div>
      </div>

      <footer className="mt-16 border-t border-border bg-secondary/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
          <Logo className="h-9" />
          <span className="flex items-center gap-2">
            <Icon name="MapPin" size={16} className="text-primary" /> ВДНХ, Москва
          </span>
          <a href="tel:+79854198903" className="flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary">
            <Icon name="Phone" size={16} className="text-primary" /> +7 (985) 419-89-03
          </a>
          <ReviewLinks />
          <SocialLinks size={18} variant="solid" />
          <span>© 2026 Все права защищены</span>
        </div>
      </footer>
    </div>
  );
};

export default Cart;