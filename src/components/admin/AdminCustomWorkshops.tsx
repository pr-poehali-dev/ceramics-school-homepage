import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { fetchWithFriendlyErrors, describeError } from '@/lib/networkError';
import func2url from '../../../backend/func2url.json';

interface CustomWorkshop {
  id: number;
  city: 'moscow' | 'suzdal';
  slug: string;
  label: string;
  badgeIcon: string;
  hidden: boolean;
  sortOrder: number;
  createdAt: string | null;
}

interface Props {
  token: string;
  onOpenEditor: (pageKey: string) => void;
}

const ICON_OPTIONS = [
  'Sparkles', 'Hand', 'Disc3', 'Palette', 'Brush', 'LayoutGrid', 'Gem', 'Flame', 'Star',
];

const AdminCustomWorkshops = ({ token, onOpenEditor }: Props) => {
  const [workshops, setWorkshops] = useState<CustomWorkshop[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [createCity, setCreateCity] = useState<'moscow' | 'suzdal'>('moscow');
  const [createLabel, setCreateLabel] = useState('');
  const [createIcon, setCreateIcon] = useState('Sparkles');
  const [creating, setCreating] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<CustomWorkshop | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${func2url['custom-workshops']}?all=1`, {
        headers: { 'X-Session-Token': token },
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось загрузить список' });
        return;
      }
      setWorkshops(data.workshops || []);
    } catch {
      toast({ title: 'Ошибка загрузки', description: 'Попробуйте позже.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setCreateLabel('');
    setCreateIcon('Sparkles');
    setCreateOpen(true);
  };

  const submitCreate = async () => {
    if (!createLabel.trim()) {
      toast({ title: 'Укажите название мастер-класса' });
      return;
    }
    setCreating(true);
    try {
      const resp = await fetchWithFriendlyErrors(func2url['custom-workshops'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ action: 'create', city: createCity, label: createLabel.trim(), badgeIcon: createIcon }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось создать мастер-класс' });
        return;
      }
      toast({ title: 'Мастер-класс создан', description: `Теперь заполните его контент и фото.` });
      setCreateOpen(false);
      await load();
      onOpenEditor(`${createCity}-workshops-${data.slug}`);
    } catch (err) {
      toast({ title: 'Ошибка', description: describeError(err) });
    } finally {
      setCreating(false);
    }
  };

  const toggleHidden = async (w: CustomWorkshop) => {
    try {
      const resp = await fetch(func2url['custom-workshops'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ action: 'toggle_hidden', id: w.id, hidden: !w.hidden }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось изменить видимость' });
        return;
      }
      setWorkshops((prev) => prev.map((x) => (x.id === w.id ? { ...x, hidden: !x.hidden } : x)));
      toast({ title: !w.hidden ? 'Мастер-класс скрыт с сайта' : 'Мастер-класс снова виден на сайте' });
    } catch {
      toast({ title: 'Ошибка', description: 'Попробуйте позже.' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const resp = await fetch(func2url['custom-workshops'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ action: 'delete', id: deleteTarget.id }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось удалить мастер-класс' });
        return;
      }
      toast({ title: 'Мастер-класс удалён' });
      setWorkshops((prev) => prev.filter((x) => x.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      toast({ title: 'Ошибка', description: 'Попробуйте позже.' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">Мастер-классы, добавленные вручную</h3>
        <Button size="sm" className="rounded-full" onClick={openCreate}>
          <Icon name="Plus" size={14} className="mr-1.5" /> Новый мастер-класс
        </Button>
      </div>

      {loading ? (
        <div className="mt-4 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : workshops.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Пока нет ни одного добавленного вручную мастер-класса.
        </p>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {workshops.map((w) => (
            <div
              key={w.id}
              className={`flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 ${w.hidden ? 'opacity-60' : ''}`}
            >
              <button
                type="button"
                onClick={() => onOpenEditor(`${w.city}-workshops-${w.slug}`)}
                className="min-w-0 flex-1 text-left"
              >
                <span className="flex items-center gap-1.5">
                  <Icon name={w.badgeIcon} fallback="Sparkles" size={15} className="shrink-0 text-primary" />
                  <span className="truncate font-medium">{w.label}</span>
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {w.city === 'moscow' ? '/moscow/workshops/' : '/suzdal/workshops/'}
                  {w.slug}
                  {w.hidden && ' · скрыт'}
                </span>
              </button>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleHidden(w)}
                  aria-label={w.hidden ? 'Показать на сайте' : 'Скрыть с сайта'}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Icon name={w.hidden ? 'Eye' : 'EyeOff'} size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(w)}
                  aria-label="Удалить"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* СОЗДАНИЕ */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новый мастер-класс</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Город</label>
              <div className="flex gap-2">
                {(['moscow', 'suzdal'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCreateCity(c)}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      createCity === c ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {c === 'moscow' ? 'Москва' : 'Суздаль'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Название</label>
              <Input
                value={createLabel}
                onChange={(e) => setCreateLabel(e.target.value)}
                placeholder="Например: Роспись изразцов"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Ссылка на страницу сформируется автоматически из названия.
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Значок</label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setCreateIcon(icon)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                      createIcon === icon
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <Icon name={icon} size={18} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Отмена</Button>
            <Button onClick={submitCreate} disabled={creating}>
              {creating ? 'Создаём…' : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* УДАЛЕНИЕ */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить мастер-класс?</AlertDialogTitle>
            <AlertDialogDescription>
              «{deleteTarget?.label}» будет полностью убран из меню, подвала и списка мастер-классов.
              Отменить это действие нельзя.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
              {deleting ? 'Удаляем…' : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCustomWorkshops;
