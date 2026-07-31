import Icon from '@/components/ui/icon';
import { EMAIL_NOTIFICATIONS, EmailTrigger } from '@/data/emailNotifications';

const TRIGGER_BADGE: Record<EmailTrigger, { label: string; className: string; icon: string }> = {
  auto: { label: 'Автоматически', className: 'bg-violet-100 text-violet-700', icon: 'Clock' },
  manual: { label: 'Действие менеджера', className: 'bg-amber-100 text-amber-700', icon: 'MousePointerClick' },
  form: { label: 'Форма на сайте', className: 'bg-sky-100 text-sky-700', icon: 'FileText' },
};

const AdminEmailNotifications = () => {
  return (
    <div className="mt-6 space-y-4">
      <p className="text-sm text-muted-foreground">
        Справочник всех автоматических и триггерных email-рассылок на сайте — для понимания,
        кому, когда и что уходит. Обновляется вручную при каждом изменении логики писем в коде.
      </p>

      <div className="space-y-3">
        {EMAIL_NOTIFICATIONS.map((n) => {
          const badge = TRIGGER_BADGE[n.triggerType];
          return (
            <div key={n.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={16} className="shrink-0 text-primary" />
                  <span className="font-medium">«{n.subject}»</span>
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

              <p className="mt-3 truncate text-xs text-muted-foreground/70">{n.sourceFile}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminEmailNotifications;
