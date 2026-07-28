import { useEffect } from 'react';

/**
 * Внедряет JSON-LD разметку schema.org в <head> страницы (тег
 * <script type="application/ld+json">). Тег автоматически обновляется при
 * изменении данных и удаляется при размонтировании компонента или когда
 * data равно null/undefined (например, пока контент ещё не загрузился).
 */
export function useJsonLd(data: object | object[] | null | undefined, id: string) {
  const json = data ? JSON.stringify(data) : '';

  useEffect(() => {
    if (!json) return;
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = json;
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [json, id]);
}

export default useJsonLd;
