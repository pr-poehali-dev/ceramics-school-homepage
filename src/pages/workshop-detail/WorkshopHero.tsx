import type { ReactNode } from 'react';
import Icon from '@/components/ui/icon';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

interface Stat {
  icon: string;
  text: string;
}

interface Props {
  images: string[];
  badgeIcon: string;
  badgeText?: string;
  title: string;
  subtitle: string;
  stats: Stat[];
  video?: string;
  children?: ReactNode;
}

const WorkshopHero = ({
  images,
  badgeIcon,
  badgeText = 'Мастер-класс',
  title,
  subtitle,
  stats,
  video,
  children,
}: Props) => {
  const hasMultiple = images.length > 1;

  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px] lg:items-stretch">
      {/* SLIDER */}
      <div className="relative min-h-[26rem] animate-scale-in overflow-hidden rounded-[2rem] shadow-xl md:min-h-[32rem]">
        <Carousel opts={{ loop: hasMultiple }} className="h-full">
          <CarouselContent className="-ml-0 h-full">
            {images.map((src, i) => (
              <CarouselItem key={src + i} className="h-full pl-0">
                <div className="relative min-h-[26rem] md:min-h-[32rem]">
                  <img
                    src={src}
                    alt={`${title} ${i + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {hasMultiple && (
            <>
              <CarouselPrevious className="left-3 border-white/40 bg-white/10 text-white hover:bg-white/20 md:left-4" />
              <CarouselNext className="right-3 border-white/40 bg-white/10 text-white hover:bg-white/20 md:right-4" />
            </>
          )}
        </Carousel>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/10" />

        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-7 text-white md:p-12">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
            <Icon name={badgeIcon} size={16} /> {badgeText}
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-tight md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85 md:text-xl">{subtitle}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            {stats.map((s) => (
              <span
                key={s.text}
                className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur"
              >
                <Icon name={s.icon} size={16} className="text-white" />
                {s.text}
              </span>
            ))}
          </div>

          {children && <div className="pointer-events-auto mt-7 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>

      {/* VIDEO */}
      {video && (
        <div className="min-h-[16rem] overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl lg:min-h-[32rem]">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b border-border/60 px-5 py-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name="Video" size={16} />
              </span>
              <p className="font-display text-base font-semibold">Видео с занятия</p>
            </div>
            <video controls preload="none" className="aspect-video w-full flex-1 bg-black object-cover">
              <source src={video} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopHero;
