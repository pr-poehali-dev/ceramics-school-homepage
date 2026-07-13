import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CartItem } from '@/context/CartContext';
import { itemImage } from '@/lib/itemImage';

interface CheckoutItemsFormProps {
  items: CartItem[];
  total: number;
  count: number;
  removeItem: (id: string) => void;
  clear: () => void;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  comment: string;
  setComment: (v: string) => void;
  payment: string;
  setPayment: (v: string) => void;
}

const CheckoutItemsForm = ({
  items,
  total,
  count,
  removeItem,
  clear,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  comment,
  setComment,
  payment,
  setPayment,
}: CheckoutItemsFormProps) => {
  return (
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
            <div className="text-sm text-muted-foreground sm:text-center">{item.qty} шт.</div>
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
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ФИО"
              className="mt-1.5"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mt-1.5"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Телефон"
              className="mt-1.5"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="comment">Комментарий</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Комментарий"
              className="mt-1.5"
              rows={3}
            />
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
  );
};

export default CheckoutItemsForm;
