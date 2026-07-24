import { useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

interface Props {
  enabled?: string;
  video?: string;
  gallery?: string;
}

const WorkshopMediaBlock = ({ enabled, video, gallery }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (enabled === 'false') return null;

  const images = (gallery || '').split('\n').filter(Boolean);
  const hasImages = images.length > 0;
  const hasVideo = Boolean(video);

  if (!hasImages && !hasVideo) return null;

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  return (
    <div
      className={`mt-8 grid gap-6 ${
        hasImages && hasVideo ? 'lg:grid-cols-2' : ''
      }`}
    >
      {hasImages && (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-sm lg:aspect-auto lg:h-full lg:min-h-[280px]">
          <Carousel opts={{ loop: images.length > 1 }} className="h-full w-full">
            <CarouselContent className="ml-0 h-full">
              {images.map((src, i) => (
                <CarouselItem key={src} className="h-full pl-0">
                  <img
                    src={src}
                    alt={`Фото ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-3 h-10 w-10 border-none bg-white/90 text-primary shadow-lg hover:bg-white" />
                <CarouselNext className="right-3 h-10 w-10 border-none bg-white/90 text-primary shadow-lg hover:bg-white" />
              </>
            )}
          </Carousel>
        </div>
      )}

      {hasVideo && (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-sm lg:aspect-auto lg:h-full lg:min-h-[280px]">
          <video
            ref={videoRef}
            controls
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={`${video}#t=0.1`} type="video/mp4" />
          </video>
          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Воспроизвести видео"
              className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors hover:bg-black/20"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg transition-transform hover:scale-105">
                <Icon name="Play" size={28} className="ml-1" />
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkshopMediaBlock;