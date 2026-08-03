import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { formatPhoneInput } from '@/lib/phoneMask';
import { compressImage } from '@/lib/imageCompress';
import { fetchWithFriendlyErrors, describeError } from '@/lib/networkError';
import func2url from '../../backend/func2url.json';

const MAX_SIZE = 20 * 1024 * 1024;
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_PHOTOS = 10;

interface PhotoItem {
  file: File;
  preview: string;
}

interface Props {
  photoHint?: string;
  city?: 'moscow' | 'suzdal';
}

const ShipmentRequestForm = ({
  photoHint = 'Подойдёт фото даже необожжённого полуфабриката.',
  city = 'moscow',
}: Props) => {
  const isSuzdal = city === 'suzdal';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [requiresPainting, setRequiresPainting] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    if (done) {
      successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [done]);

  const reset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setVisitDate('');
    setPhotos([]);
    setDone(null);
    setRequiresPainting(false);
  };

  const handlePhotoPick = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);

    if (photos.length + files.length > MAX_PHOTOS) {
      toast({
        title: 'Слишком много фото',
        description: `Можно приложить не более ${MAX_PHOTOS} фото.`,
      });
      return;
    }

    const accepted: PhotoItem[] = [];
    for (const file of files) {
      if (!ALLOWED.includes(file.type)) {
        toast({ title: 'Неверный формат фото', description: 'Загрузите JPG, PNG или WEBP.' });
        continue;
      }
      if (file.size > MAX_SIZE) {
        toast({ title: 'Фото слишком большое', description: 'Максимум 20 МБ.' });
        continue;
      }
      accepted.push({ file, preview: URL.createObjectURL(file) });
    }
    if (accepted.length) {
      setPhotos((prev) => [...prev, ...accepted]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const isValid =
    name.trim().length > 2 &&
    phone.replace(/\D/g, '').length === 11 &&
    /\S+@\S+\.\S+/.test(email) &&
    photos.length > 0 &&
    !!visitDate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || photos.length === 0) return;
    setSubmitting(true);
    setUploadProgress({ done: 0, total: photos.length });
    try {
      // Каждое фото сжимается и загружается ОТДЕЛЬНЫМ лёгким запросом — так форма с
      // несколькими фото не упирается в лимит размера тела HTTP-запроса на прокси (413),
      // с которым сталкивался один большой запрос со всеми фото в base64 сразу.
      const photoUrls: string[] = [];
      try {
        for (const p of photos) {
          const { dataUrl } = await compressImage(p.file);
          const uploadResp = await fetchWithFriendlyErrors(func2url['shipment-photo-upload'], {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photoData: dataUrl, contentType: 'image/jpeg' }),
          });
          const uploadData = await uploadResp.json().catch(() => ({}));
          if (!uploadResp.ok) {
            throw new Error(uploadData.error || `Ошибка сервера (${uploadResp.status})`);
          }
          photoUrls.push(uploadData.url);
          setUploadProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : prev));
        }
      } catch (err) {
        toast({ title: 'Не удалось загрузить фото', description: describeError(err) });
        return;
      }

      let resp: Response;
      try {
        resp = await fetchWithFriendlyErrors(func2url['shipment-request'], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: name.trim(),
            customerPhone: phone,
            customerEmail: email.trim(),
            visitDate,
            photoUrls,
            city,
            requiresPainting: !isSuzdal && requiresPainting,
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
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  if (done) {
    return (
      <div ref={successRef} className="flex flex-col items-center py-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Icon name="CheckCircle2" size={32} />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold">Заявка отправлена!</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {isSuzdal ? (
            <>
              Номер заявки — <span className="font-semibold text-foreground">№ {done}</span>.
              Мастерская Суздаля получила заявку и передаст изделие в Москву — статус можно
              отследить по номеру телефона.
            </>
          ) : (
            <>
              Ваш номер заявки — <span className="font-semibold text-foreground">№ {done}</span>.
              Заявка принята — теперь вы можете отслеживать её статус по номеру телефона.
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
      {!isSuzdal && (
        <div>
          <Label>Изделие</Label>
          <div className="mt-1.5 space-y-2">
            <button
              type="button"
              onClick={() => setRequiresPainting(false)}
              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                !requiresPainting
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-secondary/40'
              }`}
            >
              <p className="text-sm font-medium text-foreground">Изделие без росписи</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Изделие уже расписано, нужен только обжиг
              </p>
            </button>
            <button
              type="button"
              onClick={() => setRequiresPainting(true)}
              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                requiresPainting
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-secondary/40'
              }`}
            >
              <p className="text-sm font-medium text-foreground">Изделие с росписью</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Изделие ещё не расписано — после обжига пригласим записаться на роспись
              </p>
            </button>
          </div>
        </div>
      )}

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
      </div>
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

      <div>
        <Label htmlFor="req-visit-date">Дата посещения *</Label>
        <Input
          id="req-visit-date"
          type="date"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          className="mt-1.5"
          required
        />
      </div>

      <div>
        <Label>Фото изделия * (до {MAX_PHOTOS})</Label>
        <p className="mt-0.5 text-xs text-muted-foreground">{photoHint}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            handlePhotoPick(e.target.files);
            e.target.value = '';
          }}
        />

        <div className="mt-2 grid grid-cols-3 gap-2">
          {photos.map((p, i) => (
            <div key={p.preview} className="relative aspect-square">
              <img
                src={p.preview}
                alt={`Фото изделия ${i + 1}`}
                className="h-full w-full rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
                aria-label="Удалить фото"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Icon name="Camera" size={22} />
              <span className="px-2 text-center text-xs font-medium leading-snug">
                {photos.length === 0 ? 'Добавить фото' : 'Ещё фото'}
              </span>
            </button>
          )}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-xl"
        disabled={!isValid || submitting}
      >
        {submitting ? (
          <>
            <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
            {uploadProgress && uploadProgress.total > 1
              ? `Загружаем фото ${uploadProgress.done}/${uploadProgress.total}…`
              : 'Отправляем…'}
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