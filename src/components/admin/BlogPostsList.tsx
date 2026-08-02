import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

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
  posts: BlogPost[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (p: BlogPost) => void;
  onTogglePublished: (p: BlogPost) => void;
  onDeleteRequest: (p: BlogPost) => void;
}

const fmtDate = (s: string | null) => {
  if (!s) return '—';
  try {
    return new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '—';
  }
};

const BlogPostsList = ({ posts, loading, onCreate, onEdit, onTogglePublished, onDeleteRequest }: Props) => {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Статьи и новости блога — общий раздел для сайтов Москвы и Суздаля.
        </p>
        <Button size="sm" className="rounded-full" onClick={onCreate}>
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
              <button type="button" onClick={() => onEdit(p)} className="min-w-0 flex-1 text-left">
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
                  onClick={() => onTogglePublished(p)}
                  aria-label={p.published ? 'Снять с публикации' : 'Опубликовать'}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Icon name={p.published ? 'EyeOff' : 'Eye'} size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteRequest(p)}
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
    </>
  );
};

export default BlogPostsList;
export type { BlogPost };
