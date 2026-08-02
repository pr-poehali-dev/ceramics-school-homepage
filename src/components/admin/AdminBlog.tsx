import { useEffect, useState } from 'react';
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
import func2url from '../../../backend/func2url.json';
import BlogPostsList, { type BlogPost } from './BlogPostsList';
import BlogPostEditDialog from './BlogPostEditDialog';

interface Props {
  token: string;
}

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
      <BlogPostsList
        posts={posts}
        loading={loading}
        onCreate={openCreate}
        onEdit={openEdit}
        onTogglePublished={togglePublished}
        onDeleteRequest={setDeleteTarget}
      />

      <BlogPostEditDialog
        token={token}
        open={editOpen}
        onOpenChange={setEditOpen}
        isEdit={!!editId}
        title={title}
        setTitle={setTitle}
        excerpt={excerpt}
        setExcerpt={setExcerpt}
        content={content}
        setContent={setContent}
        coverType={coverType}
        setCoverType={setCoverType}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        coverVideo={coverVideo}
        setCoverVideo={setCoverVideo}
        gallery={gallery}
        setGallery={setGallery}
        saving={saving}
        onSave={submitSave}
      />

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
