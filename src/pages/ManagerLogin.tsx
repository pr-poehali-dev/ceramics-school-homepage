import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { usePageMeta } from '@/hooks/usePageMeta';
import func2url from '../../backend/func2url.json';

export const MANAGER_SESSION_KEY = 'suzdal-manager-session-token';

const ManagerLogin = () => {
  usePageMeta({
    title: 'Вход для менеджера — «Дымов Керамика»',
    description: 'Панель менеджера Суздаля для учёта посылок с готовыми изделиями.',
    noindex: true,
  });
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(MANAGER_SESSION_KEY);
    if (!saved) {
      setChecking(false);
      return;
    }
    (async () => {
      try {
        const resp = await fetch(func2url['manager-auth'], {
          headers: { 'X-Session-Token': saved },
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.role === 'suzdal') {
            navigate('/manager/dashboard', { replace: true });
            return;
          }
          localStorage.removeItem(MANAGER_SESSION_KEY);
        } else {
          localStorage.removeItem(MANAGER_SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(MANAGER_SESSION_KEY);
      } finally {
        setChecking(false);
      }
    })();
  }, [navigate]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch(func2url['manager-auth'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, portal: 'manager' }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: data.error || 'Не удалось войти' });
        return;
      }
      localStorage.setItem(MANAGER_SESSION_KEY, data.token);
      navigate('/manager/dashboard', { replace: true });
    } catch {
      toast({ title: 'Ошибка входа', description: 'Попробуйте позже.' });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon name="PackageSearch" size={26} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold">Панель менеджера</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Учёт посылок с готовыми изделиями — Суздаль
          </p>
        </div>
        <form onSubmit={login} className="mt-6 space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoFocus
            autoComplete="username"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            autoComplete="current-password"
          />
          <Button type="submit" className="w-full rounded-full" disabled={loading || !email || !password}>
            {loading ? 'Проверяем…' : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ManagerLogin;
