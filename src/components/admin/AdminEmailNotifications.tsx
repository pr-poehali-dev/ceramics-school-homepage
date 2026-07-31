import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { EMAIL_NOTIFICATIONS, EmailTrigger } from '@/data/emailNotifications';
import func2url from '../../../backend/func2url.json';

const TRIGGER_BADGE: Record<EmailTrigger, { label: string; className: string; icon: string }> = {
  auto: { label: 'Автоматически', className: 'bg-violet-100 text-violet-700', icon: 'Clock' },
  manual: { label: 'Действие менеджера', className: 'bg-amber-100 text-amber-700', icon: 'MousePointerClick' },
  form: { label: 'Форма на сайте', className: 'bg-sky-100 text-sky-700', icon: 'FileText' },
};

interface Props {
  token: string;
}

interface SavedTemplate {
  subject: string;
  body: string;
  updatedAt: string | null;
}

const AdminEmailNotifications = ({ token }: Props) => {
  const [saved, setSaved] = useState<Record<string, SavedTemplate>>({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftSubject, setDraftSubject] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const resp = await fetch(func2url['email-templates'], {
        headers: { 'X-Session-Token': token },
      });
      const data = await resp.json();
      if (resp.ok) setSaved(data.templates || {});
    } catch {
      toast({ title: 'Не удалось загрузить сохранённые тексты писем' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEdit = (id: string) => {
    const n = EMAIL_NOTIFICATIONS.find((x) => x.id === id);
    if (!n) return;
    const current = saved[id];
    setEditingId(id);
    setDraftSubject(current?.subject ?? n.defaultSubject);
    setDraftBody(current?.body ?? n.defaultBody);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftSubject('');
    setDraftBody('');
  };

  const save = async (id: string) => {
    if (!draftSubject.trim() || !draftBody.trim()) {
      toast({ title: 'Тема и текст письма не могут быть пустыми' });
      return;
    }
    setSaving(true);
    try {
      const resp = await fetch(func2url['email-templates'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ key: id, subject: draftSubject.trim(), body: draftBody.trim() }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось сохранить текст письма' });
        return;
      }
      toast({ title: 'Текст письма сохранён' });
      setSaved((prev) => ({ ...prev, [id]: { subject: draftSubject.trim(), body: draftBody.trim(), updatedAt: new Date().toISOString() } }));
      cancelEdit();
    } catch {
      toast({ title: 'Ошибка', description: 'Попробуйте позже.' });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = async (id: string) => {
    setResetting(true);
    try {
      const resp = await fetch(func2url['email-templates'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ key: id, reset: true }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось сбросить текст письма' });
        return;
      }
      toast({ title: 'Текст письма сброшен к варианту по умолчанию' });
      setSaved((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      cancelEdit();
    } catch {
      toast({ title: 'Ошибка', description: 'Попробуйте позже.' });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <p className="text-sm text-muted-foreground">
        Справочник всех автоматических и триггерных email-рассылок на сайте. Нажмите
        «Редактировать текст», чтобы изменить тему и содержание письма — правки применятся
        сразу, без участия разработчика. Плейсхолдеры вида {'{tracking_number}'} подставляются
        автоматически при отправке — их нужно оставить в тексте как есть.
      </p>

      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3">
          {EMAIL_NOTIFICATIONS.map((n) => {
            const badge = TRIGGER_BADGE[n.triggerType];
            const custom = saved[n.id];
            const isEditing = editingId === n.id;
            return (
              <div key={n.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon name="Mail" size={16} className="shrink-0 text-primary" />
                    <span className="font-medium">«{custom?.subject || n.subject}»</span>
                    {custom && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Текст изменён
                      </span>
                    )}
                  </div>
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                    <Icon name={badge.icon} size={12} />
                    {badge.label}
                  </span>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Кому</p>
                    <p className="mt-0.5 text-sm">{n.recipient}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Когда отправляется</p>
                    <p className="mt-0.5 text-sm">{n.triggerLabel}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Содержание</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.content}</p>
                </div>

                {n.conditions && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-secondary/40 p-3">
                    <Icon name="Info" size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{n.conditions}</p>
                  </div>
                )}

                {!isEditing ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => startEdit(n.id)}>
                      <Icon name="Pencil" size={14} className="mr-1.5" /> Редактировать текст
                    </Button>
                    {custom && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full text-muted-foreground"
                        onClick={() => resetToDefault(n.id)}
                        disabled={resetting}
                      >
                        <Icon name="RotateCcw" size={14} className="mr-1.5" /> Сбросить к варианту по умолчанию
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Тема письма</p>
                      <Input
                        value={draftSubject}
                        onChange={(e) => setDraftSubject(e.target.value)}
                        className="mt-1"
                        placeholder="Тема письма"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Текст письма</p>
                      <Textarea
                        value={draftBody}
                        onChange={(e) => setDraftBody(e.target.value)}
                        className="mt-1 min-h-[180px] font-mono text-sm"
                        placeholder="Текст письма"
                      />
                    </div>
                    {n.variables.length > 0 && (
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-xs font-medium text-muted-foreground">Доступные плейсхолдеры:</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {n.variables.map((v) => (
                            <span
                              key={v.key}
                              title={v.label}
                              className="rounded-full bg-card px-2 py-0.5 font-mono text-xs text-foreground"
                            >
                              {'{' + v.key + '}'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" className="rounded-full" onClick={() => save(n.id)} disabled={saving}>
                        {saving ? 'Сохраняем…' : 'Сохранить'}
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-full" onClick={cancelEdit} disabled={saving}>
                        Отмена
                      </Button>
                    </div>
                  </div>
                )}

                <p className="mt-3 truncate text-xs text-muted-foreground/70">{n.sourceFile}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminEmailNotifications;
