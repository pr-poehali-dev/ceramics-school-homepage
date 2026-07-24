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
        hasImages && hasVideo ? 'lg:grid-cols-[1fr_320px]' : ''
      }`}
    >
      {hasImages && (
        <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 md:p-10">
          <h2 className="flex items-center gap-3 font-display text-2xl font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="Images" size={20} />
            </span>
            Фото с занятий
          </h2>

          <div className="mt-6 flex flex-1 items-center">
            <Carousel opts={{ align: 'start', loop: true }} className="w-full">
              <CarouselContent>
                {images.map((src, i) => (
                  <CarouselItem key={src} className="basis-1/2 sm:basis-1/3 md:basis-1/4">
                    <div className="overflow-hidden rounded-xl border border-border">
                      <img
                        src={src}
                        alt={`Фото ${i + 1}`}
                        className="aspect-square w-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-1 md:-left-4" />
              <CarouselNext className="right-1 md:-right-4" />
            </Carousel>
          </div>
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
