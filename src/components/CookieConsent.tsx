import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'cookie-consent';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (value: { necessary: boolean; analytics: boolean }) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...value, date: Date.now() }));
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const acceptAll = () => save({ necessary: true, analytics: true });
  const declineAll = () => save({ necessary: true, analytics: false });
  const saveSettings = () => save({ necessary: true, analytics });

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] px-4 pb-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-2xl md:p-6">
        <div className="flex items-start gap-3">
          <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:flex">
            <Icon name="Cookie" size={20} />
          </span>
          <div className="flex-1">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Сайт использует файлы cookie, обрабатываемые вашим браузером. Подробнее об этом вы
              можете узнать в{' '}
              <Link
                to="/moscow/cookies"
                className="font-semibold text-primary transition-colors hover:underline"
              >
                Политике cookie
              </Link>
              .
            </p>

            {settingsOpen && (
              <div className="mt-4 space-y-3 rounded-xl border border-border bg-secondary/30 p-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span className="text-sm">
                    <span className="font-medium text-foreground">Обязательные cookie</span>
                    <span className="block text-xs text-muted-foreground">
                      Необходимы для работы сайта, всегда включены.
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span className="text-sm">
                    <span className="font-medium text-foreground">Аналитические cookie</span>
                    <span className="block text-xs text-muted-foreground">
                      Помогают собирать статистику посещений (Яндекс.Метрика).
                    </span>
                  </span>
                </label>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {settingsOpen ? (
                <Button onClick={saveSettings} className="rounded-full sm:flex-1">
                  Сохранить выбор
                </Button>
              ) : (
                <>
                  <Button onClick={acceptAll} className="rounded-full sm:flex-1">
                    Принять
                  </Button>
                  <Button
                    onClick={() => setSettingsOpen(true)}
                    variant="outline"
                    className="rounded-full sm:flex-1"
                  >
                    Настроить
                  </Button>
                </>
              )}
              <Button
                onClick={declineAll}
                variant="ghost"
                className="rounded-full text-muted-foreground sm:flex-1"
              >
                Отклонить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
