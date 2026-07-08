import { useState } from 'react';
import Icon from '@/components/ui/icon';
import type { Review } from './reviewsData';

const COLORS = [
  'bg-primary/15 text-primary',
  'bg-accent/25 text-accent-foreground',
  'bg-secondary text-secondary-foreground',
];

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

const ReviewCard = ({ review, index }: { review: Review; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 200;
  const color = COLORS[index % COLORS.length];

  return (
    <div className="mb-5 break-inside-avoid rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${color}`}>
          {initials(review.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium leading-tight">{review.name}</p>
          {review.meta && (
            <p className="truncate text-xs text-muted-foreground">{review.meta}</p>
          )}
        </div>
        <Icon name="Quote" size={22} className="shrink-0 text-primary/20" />
      </div>

      <div className="mt-3 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon
            key={i}
            name="Star"
            size={15}
            className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}
          />
        ))}
        <span className="ml-auto text-xs text-muted-foreground">{review.date}</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {isLong && !expanded ? `${review.text.slice(0, 200).trim()}…` : review.text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {expanded ? 'Свернуть' : 'Читать полностью'}
        </button>
      )}
    </div>
  );
};

export default ReviewCard;
