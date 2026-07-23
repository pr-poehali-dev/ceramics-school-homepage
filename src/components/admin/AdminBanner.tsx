import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

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
    <div className="mt-6 rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon name="Megaphone" size={18} className="text-primary" />
          <h2 className="font-display text-lg font-semibold">Информационная плашка</h2>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Switch checked={bannerEnabled} onCheckedChange={setBannerEnabled} />
          <span className={bannerEnabled ? 'font-medium text-primary' : 'text-muted-foreground'}>
            {bannerEnabled ? 'Показывается на сайте' : 'Скрыта'}
          </span>
        </label>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
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
    </div>
  );
};

export default AdminBanner;
