import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const EmptyCart = () => (
  <div className="min-h-screen bg-background text-foreground clay-texture">
    <SiteHeader />
    <div className="container py-20">
      <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border py-20 text-center">
        <Icon name="ShoppingBag" size={44} className="mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-lg font-medium">Корзина пуста</p>
        <p className="mt-1 text-sm text-muted-foreground">Добавьте услугу, чтобы оформить заказ</p>
        <Button asChild className="mt-6 rounded-full px-7">
          <Link to="/moscow/formats">
            <Icon name="LayoutGrid" size={16} className="mr-2" /> К форматам
          </Link>
        </Button>
      </div>
    </div>
    <SiteFooter />
  </div>
);

export default EmptyCart;
