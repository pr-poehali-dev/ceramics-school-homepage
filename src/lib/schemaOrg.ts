/**
 * Фабрики JSON-LD объектов schema.org, переиспользуемые на разных страницах
 * сайта. Используются вместе с хуком useJsonLd.
 */

const SITE_URL = 'https://dymovceramicschool.ru';

export interface WorkshopSchemaParams {
  name: string;
  description: string;
  image: string;
  price: number | string;
  url: string;
  areaServed: 'Москва' | 'Суздаль';
}

/** Мастер-класс как Service с предложением (Offer) — подходит для гончарных
 * школ лучше, чем Product, так как это разовая услуга, а не физический товар. */
export function workshopSchema({ name, description, image, price, url, areaServed }: WorkshopSchemaParams) {
  const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : price;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Мастер-класс по керамике',
    name,
    description,
    image,
    url: `${SITE_URL}${url}`,
    areaServed,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Дымов Керамика',
    },
    offers: {
      '@type': 'Offer',
      price: Number.isFinite(numericPrice) ? numericPrice : undefined,
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}${url}`,
    },
  };
}

export interface LocalBusinessSchemaParams {
  name: string;
  description: string;
  image: string;
  url: string;
  telephone: string;
  email?: string;
  streetAddress: string;
  addressLocality: string;
  workHours?: string;
  ratingValue?: string | number;
  reviewCount?: number;
}

/** Карточка организации (студия/школа керамики) для страниц контактов. */
export function localBusinessSchema({
  name,
  description,
  image,
  url,
  telephone,
  email,
  streetAddress,
  addressLocality,
  workHours,
  ratingValue,
  reviewCount,
}: LocalBusinessSchemaParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    image,
    url: `${SITE_URL}${url}`,
    telephone,
    email,
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality,
      addressCountry: 'RU',
    },
    ...(workHours ? { openingHours: workHours } : {}),
    ...(ratingValue && reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue,
            reviewCount,
          },
        }
      : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** Хлебные крошки для страниц вложенности 2+ уровня (например, мастер-класс). */
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export interface ReviewItem {
  name: string;
  rating: number;
  text: string;
}

/** Отзывы + агрегированный рейтинг для страниц отзывов. Поле «дата» у отзывов
 * хранится в свободном текстовом формате («25 июня»), поэтому в разметку
 * datePublished не выводится — некорректная дата хуже, чем её отсутствие. */
export function reviewsSchema(params: {
  itemName: string;
  ratingValue: string | number;
  reviewCount: number;
  reviews: ReviewItem[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: params.itemName,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: params.ratingValue,
      reviewCount: params.reviewCount,
    },
    review: params.reviews.slice(0, 20).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.text,
    })),
  };
}

export default {
  workshopSchema,
  localBusinessSchema,
  breadcrumbSchema,
  reviewsSchema,
};