import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/ui/icon';
import { GALLERY } from './reviewsData';

const ReviewsGallery = () => {
  const [current, setCurrent] = useState<number | null>(null);

  const close = useCallback(() => setCurrent(null), []);
  const prev = useCallback(
    () => setCurrent((c) => (c === null ? c : (c - 1 + GALLERY.length) % GALLERY.length)),
    [],
  );
  const next = useCallback(
    () => setCurrent((c) => (c === null ? c : (c + 1) % GALLERY.length)),
    [],
  );

  useEffect(() => {
    if (current === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, close, prev, next]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {GALLERY.map((src, i) => (
          <button
            key={src}
            onClick={() => setCurrent(i)}
            className="group relative aspect-square overflow-hidden rounded-2xl"
          >
            <img
              src={src}
              alt={`Работа участников ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
              <Icon name="Expand" size={26} className="text-white" />
            </span>
          </button>
        ))}
      </div>

      {current !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 animate-fade-in"
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Закрыть"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <Icon name="X" size={22} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Назад"
              className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-8"
            >
              <Icon name="ChevronLeft" size={26} />
            </button>

            <img
              src={GALLERY[current]}
              alt={`Работа ${current + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain"
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Вперёд"
              className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-8"
            >
              <Icon name="ChevronRight" size={26} />
            </button>

            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">
              {current + 1} / {GALLERY.length}
            </span>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ReviewsGallery;
