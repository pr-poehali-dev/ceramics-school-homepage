import { useState, ReactNode } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { fetchWithFriendlyErrors, describeError } from '@/lib/networkError';
import func2url from '../../backend/func2url.json';

interface GiftOption {
  value: string;
  label: string;
  type?: 'workshop' | 'certificate';
}

interface Props {
  children: ReactNode;
  giftOptions: GiftOption[];
  defaultGiftValue?: string;
}

const GiftHintDialog = ({ children, giftOptions, defaultGiftValue }: Props) => {
  const [open, setOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [giftValue, setGiftValue] = useState(defaultGiftValue || '');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setSenderName('');
    setAnonymous(false);
    setRecipientName('');
    setRecipientEmail('');
    setGiftValue(defaultGiftValue || '');
    setMessage('');
    setConsent(false);
  };

  const selectedGift = giftOptions.find((g) => g.value === giftValue);

  const isValid =
    (anonymous || senderName.trim().length > 1) &&
    recipientName.trim().length > 1 &&
    !!giftValue &&
    /\S+@\S+\.\S+/.test(recipientEmail.trim()) &&
    consent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !selectedGift) return;
    setLoading(true);
    try {
      const resp = await fetchWithFriendlyErrors(func2url['gift-hint'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: anonymous ? '' : senderName.trim(),
          anonymous,
          recipientName: recipientName.trim(),
          recipientEmail: recipientEmail.trim(),
          giftType: selectedGift.type || 'workshop',
          giftSlug: selectedGift.value,
          giftLabel: selectedGift.label,
          message: message.trim(),
          consent,
          city: 'moscow',
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось отправить намёк' });
        return;
      }
      toast({
        title: 'Намёк отправлен!',
        description: data.emailSent
          ? `Письмо с секретом уже летит к ${recipientName.trim()}.`
          : 'Заявка сохранена, но письмо отправить не удалось — мы разберёмся.',
      });
      reset();
      setOpen(false);
    } catch (err) {
      toast({ title: 'Не удалось отправить', description: describeError(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Намекнуть на подарок</DialogTitle>
          <DialogDescription>
            Отправим близкому человеку красивое письмо-намёк — без сюрприза, но с интригой.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="gift-recipient-name">Кому</Label>
              <Input
                id="gift-recipient-name"
                placeholder="Имя получателя"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gift-sender-name">От кого</Label>
              <Input
                id="gift-sender-name"
                placeholder={anonymous ? 'Аноним' : 'Ваше имя'}
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                disabled={anonymous}
                required={!anonymous}
              />
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-3.5">
            <Checkbox
              checked={anonymous}
              onCheckedChange={(v) => {
                const isAnon = v === true;
                setAnonymous(isAnon);
                if (isAnon) setSenderName('');
              }}
              className="mt-0.5"
            />
            <span className="text-sm leading-snug text-muted-foreground">
              <span className="font-medium text-foreground">Отправить анонимно</span>
              <br />
              Ваше имя не будет сохранено — получатель и так не увидит, кто прислал письмо
            </span>
          </label>

          <div className="space-y-1.5">
            <Label htmlFor="gift-recipient-email">Email получателя *</Label>
            <Input
              id="gift-recipient-email"
              type="email"
              placeholder="you@mail.ru"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Что намекнуть</Label>
            <Select value={giftValue} onValueChange={setGiftValue}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите мастер-класс или сертификат" />
              </SelectTrigger>
              <SelectContent>
                {giftOptions.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gift-message">Сообщение (необязательно)</Label>
            <Textarea
              id="gift-message"
              placeholder="Что-нибудь тёплое от себя — попадёт в конец письма"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-3.5">
            <Checkbox
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
              className="mt-0.5"
            />
            <span className="text-sm leading-snug text-muted-foreground">
              Согласен(на) на обработку персональных данных
            </span>
          </label>

          <Button type="submit" size="lg" className="w-full rounded-full" disabled={!isValid || loading}>
            <Icon name="Sparkles" size={18} className="mr-2" /> {loading ? 'Отправляем…' : 'Отправить намёк'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GiftHintDialog;