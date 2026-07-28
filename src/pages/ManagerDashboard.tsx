import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { usePageMeta } from '@/hooks/usePageMeta';
import AdminShipments from '@/components/admin/AdminShipments';
import func2url from '../../backend/func2url.json';
import { MANAGER_SESSION_KEY } from './ManagerLogin';

const ManagerDashboard = () => {
  usePageMeta({
    title: 'Посылки — панель менеджера «Дымов Керамика»',
    description: 'Учёт посылок с готовыми изделиями — Суздаль.',
    noindex: true,
  });
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [managerName, setManagerName] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(MANAGER_SESSION_KEY);
    if (!saved) {
      navigate('/manager/login', { replace: true });
      return;
    }
    (async () => {
      try {
        const resp = await fetch(func2url['manager-auth'], {
          headers: { 'X-Session-Token': saved },
        });
        if (!resp.ok) {
          localStorage.removeItem(MANAGER_SESSION_KEY);
          navigate('/manager/login', { replace: true });
          return;
        }
        const data = await resp.json();
        if (data.role !== 'suzdal') {
          localStorage.removeItem(MANAGER_SESSION_KEY);
          navigate('/manager/login', { replace: true });
          return;
        }
        setToken(saved);
        setManagerName(data.name || data.email);
      } catch {
        localStorage.removeItem(MANAGER_SESSION_KEY);
        navigate('/manager/login', { replace: true });
      } finally {
        setChecking(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    localStorage.removeItem(MANAGER_SESSION_KEY);
    navigate('/manager/login', { replace: true });
  };

  if (checking || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">Посылки — Суздаль</h1>
            {managerName && (
              <p className="mt-1 text-sm text-muted-foreground">Вы вошли как {managerName}</p>
            )}
          </div>
          <Button variant="ghost" size="sm" className="rounded-full" onClick={logout}>
            <Icon name="LogOut" size={15} className="mr-2" /> Выйти
          </Button>
        </div>

        <AdminShipments token={token} role="suzdal" />
      </div>
    </div>
  );
};

export default ManagerDashboard;
