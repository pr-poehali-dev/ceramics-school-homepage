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
  galleryEnabled?: string;
  videoEnabled?: string;
  video?: string;
  gallery?: string;
}

const WorkshopMediaBlock = ({ galleryEnabled, videoEnabled, video, gallery }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const images = (gallery || '').split('\n').filter(Boolean);
  const hasImages = galleryEnabled !== 'false' && images.length > 0;
  const hasVideo = videoEnabled !== 'false' && Boolean(video);

  if (!hasImages && !hasVideo) return null;

  const photoOnly = hasImages && !hasVideo;
  const videoOnly = hasVideo && !hasImages;

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  if (photoOnly) {
    return (
      <div className="mt-8">
        <Carousel opts={{ loop: images.length > 3, align: 'start' }} className="w-full">
          <CarouselContent className="-ml-4">
            {images.map((src, i) => (
              <CarouselItem key={src} className="basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/3">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-black shadow-sm">
                  <img
                    src={src}
                    alt={`Фото ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
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
    );
  }

  if (videoOnly) {
    return (
      <div className="mt-8 mx-auto max-w-md">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-sm">
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
      </div>
    );
  }

  return (
    <div
      className={`mt-8 grid gap-6 ${
        hasImages && hasVideo ? 'lg:grid-cols-[1fr_320px] lg:items-stretch' : ''
      }`}
    >
      {hasImages && (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-sm lg:aspect-auto lg:h-[340px]">
          <Carousel opts={{ loop: images.length > 2, align: 'start' }} className="h-full w-full">
            <CarouselContent className="-ml-2 h-full">
              {images.map((src, i) => (
                <CarouselItem key={src} className="h-full basis-full pl-2 sm:basis-1/2">
                  <img
                    src={src}
                    alt={`Фото ${i + 1}`}
                    className="h-full w-full rounded-xl object-cover"
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
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-sm lg:aspect-auto lg:h-[340px]">
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