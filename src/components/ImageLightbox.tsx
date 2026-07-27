import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/ui/icon';

interface ImageLightboxProps {
  images: string[];
  altPrefix?: string;
}

/** Хук для управления состоянием лайтбокса (какое фото открыто). */
export const useLightbox = () => {
  const [current, setCurrent] = useState<number | null>(null);
  return { current, setCurrent };
};

interface LightboxModalProps {
  images: string[];
  current: number | null;
  setCurrent: (i: number | null) => void;
  altPrefix?: string;
}

/** Полноэкранная модалка просмотра фото с листанием — вставляется в любой блок с галереей. */
export const LightboxModal = ({ images, current, setCurrent, altPrefix = 'Фото' }: LightboxModalProps) => {
  const close = useCallback(() => setCurrent(null), [setCurrent]);
  const prev = useCallback(
    () => setCurrent(current === null ? current : (current - 1 + images.length) % images.length),
    [current, images.length, setCurrent],
  );
  const next = useCallback(
    () => setCurrent(current === null ? current : (current + 1) % images.length),
    [current, images.length, setCurrent],
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

  if (current === null) return null;

  return createPortal(
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
        src={images[current]}
        alt={`${altPrefix} ${current + 1}`}
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
        {current + 1} / {images.length}
      </span>
    </div>,
    document.body,
  );
};

/** Готовая сетка миниатюр + лайтбокс (для случаев без карусели). */
const ImageLightbox = ({ images, altPrefix = 'Фото' }: ImageLightboxProps) => {
  const { current, setCurrent } = useLightbox();

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setCurrent(i)}
            className="group relative aspect-square overflow-hidden rounded-2xl"
          >
            <img
              src={src}
              alt={`${altPrefix} ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
              <Icon name="Expand" size={26} className="text-white" />
            </span>
          </button>
        ))}
      </div>

      <LightboxModal images={images} current={current} setCurrent={setCurrent} altPrefix={altPrefix} />
    </>
  );
};

export default ImageLightbox;
