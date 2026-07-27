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
  const outageNotice = fields.outageNotice?.trim();

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {!outageNotice && preferredLabel && (
        <span className="hidden text-xs text-muted-foreground lg:inline">{preferredLabel}</span>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Написать в мессенджер"
            title={outageNotice || undefined}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Icon name="MessageCircle" size={18} />
            {outageNotice && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-amber-500 ring-2 ring-background" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[220px]">
          {outageNotice && (
            <div className="flex items-start gap-1.5 px-2 py-1.5 text-xs font-medium text-amber-700">
              <Icon name="AlertTriangle" size={13} className="mt-0.5 shrink-0 text-amber-600" />
              {outageNotice}
            </div>
          )}
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