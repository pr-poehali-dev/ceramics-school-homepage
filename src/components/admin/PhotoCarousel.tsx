import { useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

interface Props {
  photos: string[];
  alt?: string;
  className?: string;
  onPhotoClick?: (url: string) => void;
  showThumbnails?: boolean;
}

const SWIPE_THRESHOLD = 40;

const PhotoCarousel = ({
  photos,
  alt = 'Фото изделия',
  className = '',
  onPhotoClick,
  showThumbnails = true,
}: Props) => {
  const [index, setIndex] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = useRef(false);

  if (photos.length === 0) return null;

  const safeIndex = Math.min(index, photos.length - 1);
  const current = photos[safeIndex];

  const go = (delta: number) => {
    setIndex((i) => (i + delta + photos.length) % photos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || photos.length < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      suppressClickRef.current = true;
      go(dx > 0 ? -1 : 1);
    }
  };

  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    onPhotoClick?.(current);
  };

  return (
    <div>
      <div
        className={`relative select-none overflow-hidden ${className}`}
        style={{ touchAction: 'pan-y' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button type="button" onClick={handleClick} className="block h-full w-full">
          <img src={current} alt={alt} className="h-full w-full object-cover" draggable={false} />
        </button>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow"
              aria-label="Предыдущее фото"
            >
              <Icon name="ChevronLeft" size={14} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow"
              aria-label="Следующее фото"
            >
              <Icon name="ChevronRight" size={14} />
            </button>
            <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1">
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(i);
                  }}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i === safeIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Фото ${i + 1}`}
                />
              ))}
            </div>
            <span className="absolute right-1 top-1 rounded-full bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
              {safeIndex + 1}/{photos.length}
            </span>
          </>
        )}
      </div>

      {showThumbnails && photos.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto px-2 pb-2 pt-1.5">
          {photos.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className={`h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === safeIndex ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              aria-label={`Фото ${i + 1}`}
            >
              <img src={p} alt="" className="h-full w-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoCarousel;
