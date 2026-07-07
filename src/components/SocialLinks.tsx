import Icon from '@/components/ui/icon';

export const SOCIALS = [
  { name: 'Telegram', icon: 'Send', href: 'https://t.me/dymovceramicschool' },
  { name: 'ВКонтакте', icon: 'Users', href: 'https://vk.com/dymovceramicschool' },
];

interface SocialLinksProps {
  className?: string;
  size?: number;
  variant?: 'outline' | 'solid';
}

const SocialLinks = ({ className = '', size = 20, variant = 'outline' }: SocialLinksProps) => (
  <div className={`flex items-center gap-3 ${className}`}>
    {SOCIALS.map((s) => (
      <a
        key={s.name}
        href={s.href}
        target="_blank"
        rel="noreferrer"
        aria-label={s.name}
        title={s.name}
        className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
          variant === 'solid'
            ? 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
            : 'border border-border hover:bg-primary hover:text-primary-foreground'
        }`}
      >
        <Icon name={s.icon} size={size} />
      </a>
    ))}
  </div>
);

export default SocialLinks;
