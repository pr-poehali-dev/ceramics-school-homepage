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

/** Иконка-кнопка с выпадающим списком мессенджеров (WhatsApp, Telegram, MAX). */
const MessengersMenu = ({ fields }: MessengersMenuProps) => {
  const city = useCity();
  const links = buildMessengerLinks(fields);
  const preferredLabel = fields.preferredLabel?.trim();

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {preferredLabel && (
        <span className="hidden text-xs text-muted-foreground lg:inline">{preferredLabel}</span>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Написать в мессенджер"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Icon name="MessageCircle" size={18} />
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
    </div>
  );
};

export default MessengersMenu;