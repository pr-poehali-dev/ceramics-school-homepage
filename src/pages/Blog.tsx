import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { usePageMeta } from '@/hooks/usePageMeta';
import func2url from '../../backend/func2url.json';

interface BlogPostPreview {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  coverVideo: string | null;
  publishedAt: string | null;
}

const fmtDate = (s: string | null) => {
  if (!s) return '';
  try {
    return new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
};

const Blog = () => {
  usePageMeta({
    title: 'Блог «Дымов Керамика» — статьи и новости',
    description: 'Новости студии, статьи о керамике, мастер-классах и жизни школы в Москве и Суздале.',
  });

  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(func2url['blog-posts']);
        const data = await resp.json();
        if (resp.ok) setPosts(data.posts || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader active="/blog" />

      <div className="container py-12 md:py-16">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Icon name="Newspaper" size={16} /> Блог
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
            Статьи и новости
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            О керамике, мастер-классах и жизни студии в Москве и Суздале.
          </p>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">
            Пока нет опубликованных статей — загляните позже.
          </p>
        ) : (
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
              >
                {p.coverVideo ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                    <video
                      src={`${p.coverVideo}#t=0.1`}
                      muted
                      preload="metadata"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg">
                        <Icon name="Play" size={20} className="ml-0.5" />
                      </span>
                    </span>
                  </div>
                ) : (
                  p.coverImage && (
                    <div className="aspect-[16/10] w-full overflow-hidden">
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )
                )}
                <div className="flex flex-1 flex-col p-5">
                  {p.publishedAt && (
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {fmtDate(p.publishedAt)}
                    </p>
                  )}
                  <h2 className="mt-2 font-display text-xl font-semibold leading-snug">{p.title}</h2>
                  {p.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
                  )}
                  <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary">
                    Читать далее <Icon name="ArrowRight" size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
};

export default Blog;