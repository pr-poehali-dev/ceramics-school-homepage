import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { fetchWithFriendlyErrors, describeError } from '@/lib/networkError';
import { compressImage } from '@/lib/imageCompress';
import func2url from '../../../backend/func2url.json';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content?: string;
  coverImage: string | null;
  coverVideo: string | null;
  gallery?: string[];
  published: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
}

interface Props {
  token: string;
}

const fmtDate = (s: string | null) => {
  if (!s) return '—';
  try {
    return new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '—';
  }
};

const AdminBlog = ({ token }: Props) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverType, setCoverType] = useState<'image' | 'video'>('image');
  const [coverImage, setCoverImage] = useState('');
  const [coverVideo, setCoverVideo] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${func2url['blog-posts']}?all=1`, {
        headers: { 'X-Session-Token': token },
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось загрузить статьи' });
        return;
      }
      setPosts(data.posts || []);
    } catch {
      toast({ title: 'Ошибка загрузки', description: 'Попробуйте позже.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditId(null);
    setTitle('');
    setExcerpt('');
    setContent('');
    setCoverType('image');
    setCoverImage('');
    setCoverVideo('');
    setGallery([]);
    setEditOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditId(p.id);
    setTitle(p.title);
    setExcerpt(p.excerpt || '');
    setCoverType(p.coverVideo ? 'video' : 'image');
    setCoverImage(p.coverImage || '');
    setCoverVideo(p.coverVideo || '');
    setContent(p.content || '');
    setGallery(p.gallery || []);
    setEditOpen(true);
  };

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
      setGallery((prev) => [...prev, data.url]);
      toast({ title: 'Фото добавлено в галерею' });
    } catch (err) {
      toast({ title: 'Не удалось загрузить фото', description: describeError(err) });
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const submitSave = async () => {
    if (!title.trim()) {
      toast({ title: 'Укажите заголовок статьи' });
      return;
    }
    setSaving(true);
    try {
      const resp = await fetchWithFriendlyErrors(func2url['blog-posts'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({
          action: editId ? 'update' : 'create',
          id: editId,
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          coverImage: coverType === 'image' ? coverImage : '',
          coverVideo: coverType === 'video' ? coverVideo : '',
          gallery,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось сохранить статью' });
        return;
      }
      toast({ title: editId ? 'Статья обновлена' : 'Статья создана', description: 'Не забудьте опубликовать её.' });
      setEditOpen(false);
      await load();
    } catch (err) {
      toast({ title: 'Ошибка', description: describeError(err) });
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (p: BlogPost) => {
    try {
      const resp = await fetch(func2url['blog-posts'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ action: 'toggle_published', id: p.id, published: !p.published }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось изменить статус' });
        return;
      }
      setPosts((prev) => prev.map((x) => (x.id === p.id ? { ...x, published: !x.published } : x)));
      toast({ title: !p.published ? 'Статья опубликована' : 'Статья снята с публикации' });
    } catch {
      toast({ title: 'Ошибка', description: 'Попробуйте позже.' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const resp = await fetch(func2url['blog-posts'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ action: 'delete', id: deleteTarget.id }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось удалить статью' });
        return;
      }
      toast({ title: 'Статья удалена' });
      setPosts((prev) => prev.filter((x) => x.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      toast({ title: 'Ошибка', description: 'Попробуйте позже.' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Статьи и новости блога — общий раздел для сайтов Москвы и Суздаля.
        </p>
        <Button size="sm" className="rounded-full" onClick={openCreate}>
          <Icon name="Plus" size={14} className="mr-1.5" /> Новая статья
        </Button>
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : posts.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Пока нет ни одной статьи.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {posts.map((p) => (
            <div
              key={p.id}
              className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 ${!p.published ? 'opacity-70' : ''}`}
            >
              <button type="button" onClick={() => openEdit(p)} className="min-w-0 flex-1 text-left">
                <span className="flex items-center gap-2">
                  <span className="truncate font-medium">{p.title}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.published ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {p.published ? 'Опубликована' : 'Черновик'}
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  /blog/{p.slug} · создана {fmtDate(p.createdAt)}
                  {p.publishedAt && ` · опубликована ${fmtDate(p.publishedAt)}`}
                </span>
              </button>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => togglePublished(p)}
                  aria-label={p.published ? 'Снять с публикации' : 'Опубликовать'}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Icon name={p.published ? 'EyeOff' : 'Eye'} size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(p)}
                  aria-label="Удалить"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* СОЗДАНИЕ / РЕДАКТИРОВАНИЕ */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? 'Редактировать статью' : 'Новая статья'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="blog-title">Заголовок</Label>
              <Input
                id="blog-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Как ухаживать за керамикой"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="blog-excerpt">Краткое описание (для карточки в списке)</Label>
              <Textarea
                id="blog-excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="mt-1.5"
              />
            </div>
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
            <div>
              <Label htmlFor="blog-content">Текст статьи (каждый абзац с новой строки)</Label>
              <Textarea
                id="blog-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="mt-1.5"
              />
            </div>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Отмена
            </Button>
            <Button onClick={submitSave} disabled={saving}>
              {saving ? 'Сохраняем…' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* УДАЛЕНИЕ */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить статью?</AlertDialogTitle>
            <AlertDialogDescription>
              Статья «{deleteTarget?.title}» будет удалена без возможности восстановления.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
              {deleting ? 'Удаляем…' : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBlog;