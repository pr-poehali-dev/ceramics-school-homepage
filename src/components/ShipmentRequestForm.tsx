import { useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { formatPhoneInput } from '@/lib/phoneMask';
import { compressImage } from '@/lib/imageCompress';
import { fetchWithFriendlyErrors, describeError } from '@/lib/networkError';
import func2url from '../../backend/func2url.json';

const MAX_SIZE = 20 * 1024 * 1024;
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp'];

interface Props {
  photoHint?: string;
}

const ShipmentRequestForm = ({ photoHint = 'Подойдёт фото даже необожжённого полуфабриката.' }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRepeatVisit, setIsRepeatVisit] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [doneRepeat, setDoneRepeat] = useState(false);

  const reset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setPhoto(null);
    setPhotoPreview(null);
    setDone(null);
    setDoneRepeat(false);
  };

  const handlePhotoPick = (file: File | undefined) => {
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      toast({ title: 'Неверный формат фото', description: 'Загрузите JPG, PNG или WEBP.' });
      return;
    }
    if (file.size > MAX_SIZE) {
      toast({ title: 'Фото слишком большое', description: 'Максимум 20 МБ.' });
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const isValid = isRepeatVisit
    ? phone.replace(/\D/g, '').length === 11 && !!photo
    : name.trim().length > 2 &&
      phone.replace(/\D/g, '').length === 11 &&
      /\S+@\S+\.\S+/.test(email) &&
      !!photo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !photo) return;
    setSubmitting(true);
    try {
      let dataUrl: string;
      try {
        ({ dataUrl } = await compressImage(photo));
      } catch (err) {
        toast({ title: 'Не удалось обработать фото', description: describeError(err) });
        return;
      }

      let resp: Response;
      try {
        resp = await fetchWithFriendlyErrors(func2url['shipment-request'], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isRepeatVisit,
            customerName: name.trim(),
            customerPhone: phone,
            customerEmail: email.trim(),
            photoData: dataUrl,
            contentType: 'image/jpeg',
          }),
        });
      } catch (err) {
        toast({ title: 'Не удалось отправить заявку', description: describeError(err) });
        return;
      }

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        toast({
          title: data.error || 'Не удалось отправить заявку',
          description: data.error ? undefined : `Ошибка сервера (${resp.status}). Попробуйте ещё раз через пару минут.`,
        });
        return;
      }
      setDone(data.trackingNumber);
      setDoneRepeat(isRepeatVisit);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Icon name="CheckCircle2" size={32} />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold">Заявка отправлена!</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {doneRepeat ? (
            <>
              Номер заявки — <span className="font-semibold text-foreground">№ {done}</span>.
              Изделие связано с вашим предыдущим посещением и отправлено на обжиг — статус
              можно отследить по номеру телефона.
            </>
          ) : (
            <>
              Ваш временный номер заявки — <span className="font-semibold text-foreground">№ {done}</span>.
              Менеджер проверит фото и подтвердит, после чего вы сможете отслеживать статус заявки
              по номеру телефона.
            </>
          )}
        </p>
        <Button className="mt-6 rounded-full" onClick={reset}>
          Добавить ещё одну
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-3.5">
        <Checkbox
          checked={isRepeatVisit}
          onCheckedChange={(v) => setIsRepeatVisit(v === true)}
          className="mt-0.5"
        />
        <span className="text-sm leading-snug">
          <span className="font-medium text-foreground">Это моё повторное посещение</span>
          <br />
          <span className="text-muted-foreground">
            Я уже сдавал(а) изделие и расписал(а) его — теперь сдаю на обжиг снова
          </span>
        </span>
      </label>

      {!isRepeatVisit && (
        <div>
          <Label htmlFor="req-name">ФИО *</Label>
          <Input
            id="req-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Иванова Мария Сергеевна"
            className="mt-1.5"
            required
          />
        </div>
      )}
      <div>
        <Label htmlFor="req-phone">Телефон *</Label>
        <Input
          id="req-phone"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
          placeholder="+7 (___) ___-__-__"
          className="mt-1.5"
          required
        />
        {isRepeatVisit && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Укажите номер телефона, который вы указывали в первый раз — по нему мы найдём вашу
            заявку.
          </p>
        )}
      </div>
      {!isRepeatVisit && (
        <div>
          <Label htmlFor="req-email">Email *</Label>
          <Input
            id="req-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5"
            required
          />
        </div>
      )}

      <div>
        <Label>Фото изделия *</Label>
        <p className="mt-0.5 text-xs text-muted-foreground">{photoHint}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handlePhotoPick(e.target.files?.[0])}
        />

        {photoPreview ? (
          <div className="relative mt-2">
            <img
              src={photoPreview}
              alt="Фото изделия"
              className="h-48 w-full rounded-xl object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setPhoto(null);
                setPhotoPreview(null);
              }}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
              aria-label="Удалить фото"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-3 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Icon name="Camera" size={26} />
            <span className="text-center text-sm font-medium leading-snug">
              Сделать фото или выбрать из галереи
            </span>
          </button>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-xl"
        disabled={!isValid || submitting}
      >
        {submitting ? (
          <>
            <Icon name="Loader2" size={18} className="mr-2 animate-spin" /> Отправляем…
          </>
        ) : (
          <>
            <Icon name="Send" size={18} className="mr-2" /> Отправить заявку
          </>
        )}
      </Button>
    </form>
  );
};

export default ShipmentRequestForm;