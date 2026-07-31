import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

/** Хук состояния лайтбокса: current — индекс открытой картинки (null = закрыт). */
export const useLightbox = () => {
  const [current, setCurrent] = useState<number | null>(null);
  return { current, setCurrent };
};

interface LightboxModalProps {
  images: string[];
  current: number | null;
  setCurrent: (index: number | null) => void;
  altPrefix?: string;
}

/**
 * Лайтбокс для просмотра картинок на весь экран: увеличенное фото, стрелки/клавиши
 * влево-вправо и свайп для переключения между картинками, счётчик "N из M", закрытие
 * по клику на крестик, вне фото или клавише Esc.
 */
export const LightboxModal = ({ images, current, setCurrent, altPrefix = '' }: LightboxModalProps) => {
  const open = current !== null;
  const total = images.length;

  const goPrev = () => {
    if (current === null) return;
    setCurrent((current - 1 + total) % total);
  };
  const goNext = () => {
    if (current === null) return;
    setCurrent((current + 1) % total);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, current, total]);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (!open || current === null) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && setCurrent(null)}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[100dvh] max-h-none w-screen max-w-none items-center justify-center border-none bg-black/95 p-0 sm:rounded-none"
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX === null) return;
          const diff = e.changedTouches[0].clientX - touchStartX;
          if (diff > 50) goPrev();
          else if (diff < -50) goNext();
          setTouchStartX(null);
        }}
      >
        <button
          type="button"
          onClick={() => setCurrent(null)}
          aria-label="Закрыть"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <Icon name="X" size={20} />
        </button>

        {total > 1 && (
          <span className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white">
            {current + 1} / {total}
          </span>
        )}

        {total > 1 && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Предыдущее фото"
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
          >
            <Icon name="ChevronLeft" size={24} />
          </button>
        )}

        <img
          src={images[current]}
          alt={`${altPrefix} ${current + 1}`.trim()}
          className="max-h-[90dvh] max-w-[92vw] select-none rounded-lg object-contain"
        />

        {total > 1 && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Следующее фото"
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
          >
            <Icon name="ChevronRight" size={24} />
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
};
