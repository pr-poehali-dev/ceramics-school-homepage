import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import { useCity } from '@/hooks/useCity';
import { reachGoal, GOALS } from '@/lib/metrika';
import { buildMessengerLinks } from '@/lib/messengers';

interface MessengersMenuProps {
  fields: Record<string, string>;
}

/** Кнопка «Написать» с выпадающим списком мессенджеров (WhatsApp, Telegram, MAX). */
const MessengersMenu = ({ fields }: MessengersMenuProps) => {
  const city = useCity();
  const links = buildMessengerLinks(fields);

  if (links.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Icon name="MessageCircle" size={16} />
          Написать
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {links.map((m) => (
          <DropdownMenuItem key={m.key} asChild>
            <a
              href={m.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => m.key === 'whatsapp' && reachGoal(GOALS.WHATSAPP_CLICK, city)}
              className="flex cursor-pointer items-center gap-2"
            >
              <Icon name={m.icon} size={16} className="text-primary" />
              {m.name}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessengersMenu;
