/**
 * Оборачивает fetch с таймаутом и переводит типовые сетевые сбои в понятные клиенту
 * русскоязычные сообщения: нет интернета, сервер долго не отвечает, нет соединения с сервером.
 */
export async function fetchWithFriendlyErrors(
  url: string,
  options: RequestInit,
  timeoutMs = 25000,
): Promise<Response> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('Нет подключения к интернету. Проверьте связь и попробуйте снова.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    const isAbort = err instanceof DOMException && err.name === 'AbortError';
    if (isAbort) {
      throw new Error('Сервер долго не отвечает. Проверьте соединение и попробуйте ещё раз.');
    }
    throw new Error('Не удалось соединиться с сервером. Проверьте интернет-соединение и попробуйте снова.');
  } finally {
    clearTimeout(timer);
  }
}

/** Безопасно достаёт текстовое сообщение из любого пойманного значения (Error, DOMException, строка и т.п.) */
export function describeError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return 'Попробуйте позже.';
}
