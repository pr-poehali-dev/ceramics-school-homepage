import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loginLoading: boolean;
  onSubmit: () => void;
}

const AdminLogin = ({ email, setEmail, password, setPassword, loginLoading, onSubmit }: Props) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon name="Lock" size={26} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold">Панель управления</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Войдите, чтобы увидеть заказы и заявки
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="mt-6 space-y-3"
        >
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
          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={loginLoading || !email || !password}
          >
            {loginLoading ? 'Проверяем…' : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
