import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/hooks/useCity';

const CartButton = () => {
  const { count } = useCart();
  const city = useCity();

  return (
    <Link
      to={`/${city}/cart`}
      aria-label="Корзина"
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <Icon name="ShoppingCart" size={20} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
};

export default CartButton;
