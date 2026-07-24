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
  if (enabled === 'false') return null;

  const images = (gallery || '').split('\n').filter(Boolean);
  const hasImages = images.length > 0;
  const hasVideo = Boolean(video);

  if (!hasImages && !hasVideo) return null;

  return (
    <div
      className={`mt-8 grid gap-6 ${
        hasImages && hasVideo ? 'lg:grid-cols-[1fr_320px] lg:items-start' : ''
      }`}
    >
      {hasImages && (
        <div className="rounded-2xl border border-border bg-card p-7 md:p-10">
          <h2 className="flex items-center gap-3 font-display text-2xl font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="Images" size={20} />
            </span>
            Фото с занятий
          </h2>

          <div className="mt-6">
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
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b border-border/60 px-5 py-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="Video" size={16} />
            </span>
            <p className="font-display text-base font-semibold">Видео с занятия</p>
          </div>
          <video controls preload="none" className="aspect-video w-full bg-black object-cover">
            <source src={video} type="video/mp4" />
          </video>
        </div>
      )}
    </div>
  );
};

export default WorkshopMediaBlock;
