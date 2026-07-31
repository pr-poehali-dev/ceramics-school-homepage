import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { LightboxModal, useLightbox } from '@/components/ImageLightbox';
import { usePageMeta } from '@/hooks/usePageMeta';
import func2url from '../../backend/func2url.json';

interface BlogPostFull {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  gallery?: string[];
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
  const { current: lightboxIndex, setCurrent: setLightboxIndex } = useLightbox();

  // Обложка и фото галереи открываются в одном общем лайтбоксе — стрелками можно
  // пролистать все картинки статьи подряд, независимо от того, откуда начали просмотр.
  const allImages = [
    ...(post?.coverImage ? [post.coverImage] : []),
    ...(post?.gallery || []),
  ];

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
              <button
                type="button"
                onClick={() => setLightboxIndex(0)}
                className="group mt-7 block w-full overflow-hidden rounded-2xl"
                aria-label="Увеличить фото"
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            )}

            <div className="mt-8 space-y-4 leading-relaxed text-foreground/90">
              {post.content
                .split('\n')
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>

            {post.gallery && post.gallery.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {post.gallery.map((src, i) => {
                  const coverOffset = post.coverImage ? 1 : 0;
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setLightboxIndex(i + coverOffset)}
                      className="group aspect-square overflow-hidden rounded-xl"
                      aria-label="Увеличить фото"
                    >
                      <img
                        src={src}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </article>
        )}
      </div>

      <LightboxModal
        images={allImages}
        current={lightboxIndex}
        setCurrent={setLightboxIndex}
        altPrefix={post?.title}
      />

      <SiteFooter />
    </div>
  );
};

export default BlogPost;