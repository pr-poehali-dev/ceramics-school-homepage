import { useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { fetchWithFriendlyErrors, describeError } from '@/lib/networkError';
import { compressImage } from '@/lib/imageCompress';
import func2url from '../../../backend/func2url.json';

interface Props {
  token: string;
  coverType: 'image' | 'video';
  setCoverType: (t: 'image' | 'video') => void;
  coverImage: string;
  setCoverImage: (v: string) => void;
  coverVideo: string;
  setCoverVideo: (v: string) => void;
}

const BlogCoverEditor = ({
  token,
  coverType,
  setCoverType,
  coverImage,
  setCoverImage,
  coverVideo,
  setCoverVideo,
}: Props) => {
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleUploadCover = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
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
      setCoverImage(data.url);
      toast({ title: 'Обложка загружена' });
    } catch (err) {
      toast({ title: 'Не удалось загрузить обложку', description: describeError(err) });
    } finally {
      setUploading(false);
    }
  };

  const handleUploadCoverVideo = async (file: File | undefined) => {
    if (!file) return;
    setUploadingVideo(true);
    try {
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
        reader.readAsDataURL(file);
      });
      const resp = await fetchWithFriendlyErrors(func2url['upload-image'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ fileData, contentType: file.type || 'video/mp4' }),
      }, 60000);
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data.error || `Ошибка сервера (${resp.status})`);
      setCoverVideo(data.url);
      toast({ title: 'Видео загружено' });
    } catch (err) {
      toast({ title: 'Не удалось загрузить видео', description: describeError(err) });
    } finally {
      setUploadingVideo(false);
    }
  };

  return (
    <div>
      <Label>Обложка</Label>
      <div className="mt-1.5 grid w-fit grid-cols-2 gap-1 rounded-full border border-border bg-secondary/40 p-1">
        <button
          type="button"
          onClick={() => setCoverType('image')}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            coverType === 'image' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          <Icon name="Image" size={13} /> Фото
        </button>
        <button
          type="button"
          onClick={() => setCoverType('video')}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            coverType === 'video' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          <Icon name="Video" size={13} /> Видео
        </button>
      </div>

      {coverType === 'image' ? (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => handleUploadCover(e.target.files?.[0])}
          />
          {coverImage ? (
            <div className="relative mt-2">
              <img src={coverImage} alt="Обложка" className="h-40 w-full rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => setCoverImage('')}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
                aria-label="Удалить обложку"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-2 flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Icon name={uploading ? 'Loader2' : 'Image'} size={24} className={uploading ? 'animate-spin' : ''} />
              <span className="text-sm font-medium">{uploading ? 'Загрузка…' : 'Загрузить обложку'}</span>
            </button>
          )}
        </>
      ) : (
        <>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            onChange={(e) => handleUploadCoverVideo(e.target.files?.[0])}
          />
          {coverVideo ? (
            <div className="relative mt-2">
              <video src={coverVideo} controls preload="metadata" className="h-40 w-full rounded-xl bg-black object-cover" />
              <button
                type="button"
                onClick={() => setCoverVideo('')}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
                aria-label="Удалить видео"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploadingVideo}
              className="mt-2 flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Icon name={uploadingVideo ? 'Loader2' : 'Video'} size={24} className={uploadingVideo ? 'animate-spin' : ''} />
              <span className="text-sm font-medium">{uploadingVideo ? 'Загрузка…' : 'Загрузить видео (MP4/WebM, до 40МБ)'}</span>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default BlogCoverEditor;
