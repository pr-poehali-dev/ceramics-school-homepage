import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useCart } from '@/context/CartContext';
import func2url from '../../backend/func2url.json';
import { itemImage } from '@/lib/itemImage';

interface CertificateResult {
  title: string;
  email: string;
  code: string;
  pdfUrl: string;
  validUntil: string;
}

const Checkout = () => {
  const { items, total, count, clear, removeItem } = useCart();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [payment, setPayment] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [certResults, setCertResults] = useState<CertificateResult[] | null>(null);

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
          }),
        });
      }

      clear();
      if (results.length > 0) {
        setCertResults(results);
      } else {
        toast({ title: 'Заказ оформлен!', description: 'Мы свяжемся с вами для подтверждения.' });
        navigate('/moscow');
      }
    } catch {
      toast({ title: 'Не удалось оформить заказ', description: 'Попробуйте ещё раз.' });
    } finally {
      setLoading(false);
    }
  };

  if (certResults) {
    return (
      <div className="min-h-screen bg-background text-foreground clay-texture">
        <SiteHeader />
        <div className="container py-16">
          <div className="mx-auto max-w-xl text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="CircleCheck" size={36} />
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold">Сертификат готов!</h1>
            <p className="mt-3 text-muted-foreground">
              Сертификат сформирован. Скачайте PDF или перешлите его получателю.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-xl space-y-4">
            {certResults.map((c) => (
              <div key={c.code} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Ticket" size={16} className="text-primary" /> Код: <span className="font-semibold text-foreground">{c.code}</span>
                </div>
                <p className="mt-2 font-display text-lg font-semibold">{c.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Отправим на {c.email} · действует до {c.validUntil}
                </p>
                <Button asChild className="mt-4 w-full rounded-full">
                  <a href={c.pdfUrl} target="_blank" rel="noreferrer">
                    <Icon name="Download" size={18} className="mr-2" /> Скачать PDF
                  </a>
                </Button>
              </div>
            ))}
            <Button asChild variant="outline" size="lg" className="w-full rounded-full">
              <Link to="/moscow">На главную</Link>
            </Button>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (items.length === 0) {
    return (
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
  }

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader />

      <div className="container py-10 md:py-14">
        <Link
          to="/moscow"
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
          <div className="space-y-8">
            {/* ITEMS TABLE */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="hidden grid-cols-[1fr_90px_120px_44px] gap-4 border-b border-border px-6 py-4 text-sm font-medium text-muted-foreground sm:grid">
                <span>Наименование</span>
                <span className="text-center">Количество</span>
                <span className="text-right">Цена</span>
                <span />
              </div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 border-b border-border px-6 py-5 last:border-0 sm:grid-cols-[1fr_90px_120px_44px] sm:items-center sm:gap-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={itemImage(item.id)}
                      alt={item.title}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                    <div>
                    <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                    {item.details && (
                      <p className="mt-1 text-sm text-muted-foreground">{item.details}</p>
                    )}
                    {item.certificate && (
                      <div className="mt-2 rounded-lg bg-accent/15 px-3 py-2 text-xs text-muted-foreground">
                        {item.certificate.message && (
                          <p className="italic">«{item.certificate.message}»</p>
                        )}
                        <p className="mt-1 flex items-center gap-1.5">
                          <Icon name="Mail" size={12} /> {item.certificate.recipientEmail}
                        </p>
                      </div>
                    )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground sm:text-center">
                    {item.qty} шт.
                  </div>
                  <div className="font-semibold sm:text-right">
                    {(item.price * item.qty).toLocaleString('ru-RU')} руб.
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive sm:justify-center"
                    aria-label="Удалить товар"
                  >
                    <Icon name="Trash2" size={18} />
                    <span className="sm:hidden">Удалить</span>
                  </button>
                </div>
              ))}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-secondary/40 px-6 py-4">
                <button
                  type="button"
                  onClick={clear}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Icon name="Trash2" size={15} /> Очистить корзину
                </button>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{count} шт.</span>
                  <span className="font-display text-xl font-semibold text-primary">
                    {total.toLocaleString('ru-RU')} руб.
                  </span>
                </div>
              </div>
            </div>

            {/* RECIPIENT */}
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <h2 className="font-display text-2xl font-semibold">Данные покупателя</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">ФИО *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="ФИО" className="mt-1.5" required />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mt-1.5" required />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" className="mt-1.5" required />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="comment">Комментарий</Label>
                  <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Комментарий" className="mt-1.5" rows={3} />
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold">Способы оплаты</h2>
              <RadioGroup value={payment} onValueChange={setPayment} className="mt-4 space-y-3">
                <label className="flex cursor-pointer items-start gap-3 text-sm">
                  <RadioGroupItem value="cash" id="pay-cash" className="mt-0.5" />
                  <span>Оплата наличными на кассе Школы керамики</span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 text-sm">
                  <RadioGroupItem value="online" id="pay-online" className="mt-0.5" />
                  <span>
                    Онлайн-оплата ЮKassa
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Банковские карты, СБП
                    </span>
                  </span>
                </label>
              </RadioGroup>
            </div>
          </div>

          {/* RIGHT: summary */}
          <div className="rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-6">
            <h2 className="font-display text-xl font-semibold">Ваш заказ</h2>
            <div className="mt-4 space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-2 text-muted-foreground">
                  <span className="line-clamp-1">{item.title} × {item.qty}</span>
                  <span className="whitespace-nowrap">{(item.price * item.qty).toLocaleString('ru-RU')} ₽</span>
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
        </form>
      </div>

      <SiteFooter />
    </div>
  );
};

export default Checkout;