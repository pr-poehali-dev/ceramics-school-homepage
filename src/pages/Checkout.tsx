import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/hooks/useCity';
import { CITIES } from '@/lib/cities';
import func2url from '../../backend/func2url.json';
import OrderSuccess, {
  CertificateResult,
  OrderResult,
} from '@/pages/checkout/OrderSuccess';
import EmptyCart from '@/pages/checkout/EmptyCart';
import CheckoutItemsForm from '@/pages/checkout/CheckoutItemsForm';
import CheckoutSummary from '@/pages/checkout/CheckoutSummary';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const { items, total, count, clear, removeItem } = useCart();
  const navigate = useNavigate();
  const city = useCity();
  const cityConfig = CITIES[city];

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [payment, setPayment] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !phone) {
      toast({ title: 'Заполните обязательные поля', description: 'ФИО, email и телефон обязательны.' });
      return;
    }

    setLoading(true);
    try {
      const certItems = items.filter((i) => i.certificate);
      const results: CertificateResult[] = [];
      for (const item of certItems) {
        const resp = await fetch(func2url.certificate, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: item.price,
            message: item.certificate?.message,
            recipientName: item.certificate?.recipientName,
            senderName: item.certificate?.senderName,
            recipientEmail: item.certificate?.recipientEmail,
          }),
        });
        const data = await resp.json();
        if (data.pdfUrl) {
          results.push({
            title: item.title,
            email: item.certificate?.recipientEmail || '',
            code: data.code,
            pdfUrl: data.pdfUrl,
            validUntil: data.validUntil,
          });
        }
      }

      const bookingItems = items.filter((i) => i.booking);
      for (const item of bookingItems) {
        await fetch(func2url['booking-request'], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service: item.booking?.service,
            people: item.booking?.people,
            email: item.booking?.email || email,
            phone: item.booking?.phone || phone,
            city,
          }),
        });
      }

      const snapshot: OrderResult = {
        number: String(Math.floor(100000 + Math.random() * 900000)),
        name,
        email,
        phone,
        payment,
        total,
        lines: items.map((i) => ({
          id: i.id,
          title: i.title,
          details: i.details,
          qty: i.qty,
          price: i.price,
        })),
        certificates: results,
      };

      try {
        await fetch(func2url.orders, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            number: snapshot.number,
            name,
            email,
            phone,
            comment,
            payment,
            total,
            items: snapshot.lines,
            city,
          }),
        });
      } catch {
        // Сохранение заказа не должно срывать оформление.
      }

      clear();
      setOrderResult(snapshot);
      window.scrollTo({ top: 0 });
    } catch {
      toast({ title: 'Не удалось оформить заказ', description: 'Попробуйте ещё раз.' });
    } finally {
      setLoading(false);
    }
  };

  if (orderResult) {
    return <OrderSuccess orderResult={orderResult} />;
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader />

      <div className="container py-10 md:py-14">
        <Link
          to={cityConfig.path}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <Icon name="ArrowLeft" size={16} /> Вернуться на главную
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <Icon name="ShoppingCart" size={28} className="text-primary" />
          <h1 className="font-display text-4xl font-semibold md:text-5xl">Ваша корзина</h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          {/* LEFT: items + fields */}
          <CheckoutItemsForm
            items={items}
            total={total}
            count={count}
            removeItem={removeItem}
            clear={clear}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            comment={comment}
            setComment={setComment}
            payment={payment}
            setPayment={setPayment}
          />

          {/* RIGHT: summary */}
          <CheckoutSummary items={items} total={total} loading={loading} />
        </form>
      </div>

      <SiteFooter />
    </div>
  );
};

export default Checkout;