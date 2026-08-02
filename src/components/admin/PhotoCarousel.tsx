import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Props {
  photos: string[];
  alt?: string;
  className?: string;
  onPhotoClick?: (url: string) => void;
}

const PhotoCarousel = ({ photos, alt = 'Фото изделия', className = '', onPhotoClick }: Props) => {
  const [index, setIndex] = useState(0);

  if (photos.length === 0) return null;

  const safeIndex = Math.min(index, photos.length - 1);
  const current = photos[safeIndex];

  const go = (delta: number) => {
    setIndex((i) => (i + delta + photos.length) % photos.length);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => onPhotoClick?.(current)}
        className="block h-full w-full"
      >
        <img src={current} alt={alt} className="h-full w-full object-cover" />
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
  );
};

export default PhotoCarousel;
