import Icon from '@/components/ui/icon';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

const UTIL_IMAGES = [
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/ac7d60a2-e0a5-421d-902d-973ddf73f97a.jpg',
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/0d62e64c-3ce1-420d-bed0-56880e87ab4a.jpg',
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/06cc620e-d189-43c5-a8c1-175d9054abdf.jpg',
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/f46c7c66-589c-45b6-a176-f091f6694248.jpg',
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/8cb05b26-4beb-4ca4-9b04-4666ac8e8a95.jpg',
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/155f8551-b2ae-4a94-9aed-5364ae4fd4f9.jpg',
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/836fbc9b-8ed5-4d46-b7f4-c5093ff00e46.jpg',
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/d6badcb0-2848-4a7c-88c6-8b46f50ea138.jpg',
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/0dfb3756-eca7-404c-b253-08827cefafb3.jpg',
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/a9c7d307-7d9d-4e65-b8fa-ed20bf2a5441.jpg',
  'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/d59cb606-2d6c-4183-97a5-279d662a61d0.jpg',
];

const UtilBlock = () => {
  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-7 md:p-10">
      <h2 className="flex items-center gap-3 font-display text-2xl font-semibold">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon name="Package" size={20} />
        </span>
        Утиль для росписи
      </h2>

      <p className="mt-5 leading-relaxed text-muted-foreground">
        Для росписи ангобами дополнительно можно приобрести «утиль» — уже готовые изделия из белой
        глины, которые остаётся только расписать. Это могут быть сахарницы, кувшины, чайники,
        тарелки, кружки, фигурки и другие формы.
      </p>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Цена зависит от изделия и начинается{' '}
        <span className="font-semibold text-primary">от 400 до 2 000 ₽</span>.
      </p>

      <div className="mt-7">
        <Carousel opts={{ align: 'start', loop: true }} className="w-full">
          <CarouselContent>
            {UTIL_IMAGES.map((src, i) => (
              <CarouselItem key={i} className="basis-1/2 sm:basis-1/3 md:basis-1/4">
                <div className="overflow-hidden rounded-xl border border-border">
                  <img
                    src={src}
                    alt={`Изделия для росписи — утиль ${i + 1}`}
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
  );
};

export default UtilBlock;
