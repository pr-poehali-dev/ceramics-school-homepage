import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const CHUNK_ERROR_STORAGE_KEY = 'chunk-reload-attempted';

const isChunkLoadError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error);
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk|dynamically imported module/i.test(
    message,
  );
};

/**
 * Ловит ошибки рендера всего приложения — в первую очередь сбой подгрузки
 * lazy-страницы, когда открытая вкладка "просыпается" после того, как сайт
 * был обновлён и старые файлы страниц уже не существуют на сервере.
 * Без этой страховки React молча падает и показывает пустой белый экран.
 *
 * При ошибке загрузки чанка делаем одну автоматическую перезагрузку страницы
 * (подтягивает свежую версию файлов) — в большинстве случаев пользователь
 * этого даже не заметит. Если ошибка не связана с чанками (или перезагрузка
 * уже была) — показываем понятный экран вместо белого пустого.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (isChunkLoadError(error) && !sessionStorage.getItem(CHUNK_ERROR_STORAGE_KEY)) {
      sessionStorage.setItem(CHUNK_ERROR_STORAGE_KEY, '1');
      window.location.reload();
    }
  }

  handleReload = () => {
    sessionStorage.removeItem(CHUNK_ERROR_STORAGE_KEY);
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <p className="font-display text-2xl font-semibold text-foreground">
            Что-то пошло не так
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Возможно, сайт обновился, пока эта вкладка была открыта. Обновите страницу, чтобы
            загрузить актуальную версию.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Обновить страницу
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
