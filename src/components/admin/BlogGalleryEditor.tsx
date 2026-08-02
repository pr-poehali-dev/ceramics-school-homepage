import { useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { fetchWithFriendlyErrors, describeError } from '@/lib/networkError';
import { compressImage } from '@/lib/imageCompress';
import func2url from '../../../backend/func2url.json';

interface Props {
  token: string;
  gallery: string[];
  onChange: (next: string[]) => void;
}

const BlogGalleryEditor = ({ token, gallery, onChange }: Props) => {
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleUploadGalleryImage = async (file: File | undefined) => {
    if (!file) return;
    setUploadingGallery(true);
    try {
      let fileData: string;
      let contentType: string;
      if (file.type !== 'image/svg+xml') {
        const { dataUrl } = await compressImage(file, 1600, 0.85);
        fileData = dataUrl;
        contentType = 'image/jpeg';
      } else {
        fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
          reader.readAsDataURL(file);
        });
        contentType = file.type;
      }
      const resp = await fetchWithFriendlyErrors(func2url['upload-image'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ fileData, contentType }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data.error || `Ошибка сервера (${resp.status})`);
      onChange([...gallery, data.url]);
      toast({ title: 'Фото добавлено в галерею' });
    } catch (err) {
      toast({ title: 'Не удалось загрузить фото', description: describeError(err) });
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    onChange(gallery.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Label>Дополнительные фото (галерея внизу статьи)</Label>
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleUploadGalleryImage(e.target.files?.[0])}
      />
      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {gallery.map((src, i) => (
          <div key={src} className="relative aspect-square overflow-hidden rounded-xl">
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeGalleryImage(i)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
              aria-label="Удалить фото"
            >
              <Icon name="X" size={13} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          disabled={uploadingGallery}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Icon name={uploadingGallery ? 'Loader2' : 'Plus'} size={18} className={uploadingGallery ? 'animate-spin' : ''} />
          <span className="text-xs font-medium">{uploadingGallery ? 'Загрузка…' : 'Добавить'}</span>
        </button>
      </div>
    </div>
  );
};

export default BlogGalleryEditor;
