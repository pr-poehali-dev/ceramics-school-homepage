import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import BlogCoverEditor from './BlogCoverEditor';
import BlogGalleryEditor from './BlogGalleryEditor';

interface Props {
  token: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isEdit: boolean;
  title: string;
  setTitle: (v: string) => void;
  excerpt: string;
  setExcerpt: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  coverType: 'image' | 'video';
  setCoverType: (t: 'image' | 'video') => void;
  coverImage: string;
  setCoverImage: (v: string) => void;
  coverVideo: string;
  setCoverVideo: (v: string) => void;
  gallery: string[];
  setGallery: (next: string[]) => void;
  saving: boolean;
  onSave: () => void;
}

const BlogPostEditDialog = ({
  token,
  open,
  onOpenChange,
  isEdit,
  title,
  setTitle,
  excerpt,
  setExcerpt,
  content,
  setContent,
  coverType,
  setCoverType,
  coverImage,
  setCoverImage,
  coverVideo,
  setCoverVideo,
  gallery,
  setGallery,
  saving,
  onSave,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Редактировать статью' : 'Новая статья'}</DialogTitle>
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
          <BlogCoverEditor
            token={token}
            coverType={coverType}
            setCoverType={setCoverType}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            coverVideo={coverVideo}
            setCoverVideo={setCoverVideo}
          />
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
          <BlogGalleryEditor token={token} gallery={gallery} onChange={setGallery} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? 'Сохраняем…' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostEditDialog;
