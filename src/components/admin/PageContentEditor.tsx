import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import func2url from '../../../backend/func2url.json';
import { PAGE_SCHEMAS, getPageSchema } from '@/data/pageContentSchemas';

interface Props {
  token: string;
}

const cityLabel = (city: string) =>
  city === 'moscow' ? 'Москва' : city === 'suzdal' ? 'Суздаль' : 'Общее';

const PageContentEditor = ({ token }: Props) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const schema = selectedKey ? getPageSchema(selectedKey) : null;

  useEffect(() => {
    if (!selectedKey || !schema) return;
    setLoading(true);
    (async () => {
      try {
        const resp = await fetch(`${func2url['page-content']}?key=${encodeURIComponent(selectedKey)}`);
        const data = await resp.json();
        setFields({ ...schema.defaults, ...(data.fields || {}) });
      } catch {
        setFields(schema.defaults);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey]);

  const save = async () => {
    if (!selectedKey || !schema) return;
    setSaving(true);
    try {
      const resp = await fetch(func2url['page-content'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ key: selectedKey, title: schema.title, fields }),
      });
      if (!resp.ok) throw new Error('fail');
      toast({ title: 'Изменения сохранены', description: 'Страница уже обновлена на сайте.' });
    } catch {
      toast({ title: 'Не удалось сохранить', description: 'Попробуйте позже.' });
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (fieldKey: string, file: File) => {
    setUploadingKey(fieldKey);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const resp = await fetch(func2url['upload-image'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ fileData: base64, contentType: file.type }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'fail');
      setFields((prev) => ({ ...prev, [fieldKey]: data.url }));
      toast({ title: 'Картинка загружена' });
    } catch {
      toast({ title: 'Не удалось загрузить картинку', description: 'Попробуйте другой файл.' });
    } finally {
      setUploadingKey(null);
    }
  };

  if (!selectedKey) {
    return (
      <div className="mt-6 space-y-6">
        {(['common', 'moscow', 'suzdal'] as const).map((city) => {
          const pages = PAGE_SCHEMAS.filter((p) => p.city === city);
          if (pages.length === 0) return null;
          return (
            <div key={city}>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">{cityLabel(city)}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pages.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => p.status === 'ready' && setSelectedKey(p.key)}
                    disabled={p.status !== 'ready'}
                    className={`flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all ${
                      p.status === 'ready'
                        ? 'hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md cursor-pointer'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <span className="font-medium">{p.title}</span>
                    {p.status === 'ready' ? (
                      <Icon name="ChevronRight" size={18} className="shrink-0 text-primary" />
                    ) : (
                      <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                        скоро
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        onClick={() => setSelectedKey(null)}
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <Icon name="ChevronLeft" size={16} /> Все страницы
      </button>

      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">{schema?.title}</h2>
        <Button size="sm" className="rounded-full" onClick={save} disabled={saving || loading}>
          {saving ? 'Сохраняем…' : 'Сохранить'}
        </Button>
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {schema?.fields.map((f) => (
            <div key={f.key}>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                {f.label}
              </label>
              {f.type === 'textarea' && (
                <Textarea
                  value={fields[f.key] || ''}
                  onChange={(e) => setFields((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  rows={3}
                  className="resize-y"
                />
              )}
              {(f.type === 'text' || f.type === 'price') && (
                <Input
                  value={fields[f.key] || ''}
                  onChange={(e) => setFields((prev) => ({ ...prev, [f.key]: e.target.value }))}
                />
              )}
              {f.type === 'image' && (
                <div className="flex items-center gap-3">
                  {fields[f.key] && (
                    <img
                      src={fields[f.key]}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-lg border border-border object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <Input
                      value={fields[f.key] || ''}
                      onChange={(e) => setFields((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder="Ссылка на картинку"
                    />
                    <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-xs text-primary hover:underline">
                      <Icon name="Upload" size={13} />
                      {uploadingKey === f.key ? 'Загружаем…' : 'Загрузить свою картинку'}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                        disabled={uploadingKey === f.key}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImage(f.key, file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageContentEditor;
