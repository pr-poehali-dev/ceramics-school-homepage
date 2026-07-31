import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { usePageMeta } from '@/hooks/usePageMeta';
import func2url from '../../backend/func2url.json';

interface BlogPostFull {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
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

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  usePageMeta({
    title: post ? `${post.title} — Блог «Дымов Керамика»` : 'Блог «Дымов Керамика»',
    description: post?.excerpt || 'Статья блога «Дымов Керамика».',
  });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const resp = await fetch(`${func2url['blog-posts']}?slug=${encodeURIComponent(slug)}`);
        if (resp.status === 404) {
          setNotFound(true);
          return;
        }
        const data = await resp.json();
        if (resp.ok) setPost(data.post);
        else setNotFound(true);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (notFound) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground clay-texture">
      <SiteHeader active="/blog" />

      <div className="container py-10 md:py-14">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <Icon name="ArrowLeft" size={16} /> Назад в блог
        </Link>

        {loading || !post ? (
          <div className="mt-16 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <article className="mx-auto mt-8 max-w-3xl">
            {post.publishedAt && (
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {fmtDate(post.publishedAt)}
              </p>
            )}
            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight md:text-4xl">
              {post.title}
            </h1>

            {post.coverImage && (
              <div className="mt-7 overflow-hidden rounded-2xl">
                <img src={post.coverImage} alt={post.title} className="w-full object-cover" />
              </div>
            )}

            <div className="mt-8 space-y-4 leading-relaxed text-foreground/90">
              {post.content
                .split('\n')
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
          </article>
        )}
      </div>

      <SiteFooter />
    </div>
  );
};

export default BlogPost;
