import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Props {
  bannerEnabled: boolean;
  setBannerEnabled: (v: boolean) => void;
  bannerText: string;
  setBannerText: (v: string) => void;
  savingBanner: boolean;
  onSave: () => void;
}

const AdminBanner = ({
  bannerEnabled,
  setBannerEnabled,
  bannerText,
  setBannerText,
  savingBanner,
  onSave,
}: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            bannerEnabled
              ? 'bg-primary/10 text-primary'
              : 'bg-secondary text-muted-foreground'
          }`}
        >
          <Icon name="Megaphone" size={15} />
          Плашка
          <span
            className={`h-1.5 w-1.5 rounded-full ${bannerEnabled ? 'bg-primary' : 'bg-muted-foreground/40'}`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon name="Megaphone" size={18} className="text-primary" />
            <h2 className="font-display text-base font-semibold">Информационная плашка</h2>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Switch checked={bannerEnabled} onCheckedChange={setBannerEnabled} />
            <span className={bannerEnabled ? 'font-medium text-primary' : 'text-muted-foreground'}>
              {bannerEnabled ? 'Показывается' : 'Скрыта'}
            </span>
          </label>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Текст выводится узкой полосой над шапкой на всех страницах сайта.
        </p>
        <Textarea
          value={bannerText}
          onChange={(e) => setBannerText(e.target.value)}
          placeholder="Например: Уважаемые покупатели! В период с 8.01 по 10.01 школа работает только на приём заказов через корзину…"
          rows={3}
          className="mt-3 resize-y"
        />
        <div className="mt-3 flex justify-end">
          <Button
            size="sm"
            className="rounded-full"
            onClick={onSave}
            disabled={savingBanner}
          >
            {savingBanner ? 'Сохраняем…' : 'Сохранить плашку'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminBanner;