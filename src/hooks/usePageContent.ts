import { useEffect, useState } from 'react';
import func2url from '../../backend/func2url.json';
import { getPageSchema } from '@/data/pageContentSchemas';

/**
 * Подгружает редактируемый контент страницы (тексты, цены, картинки),
 * сохранённые через админ-панель. Пока правки не загрузились или их ещё
 * нет — отдаёт значения по умолчанию из pageContentSchemas.ts, так что
 * страница никогда не показывает пустоту.
 */
export function usePageContent(pageKey: string): Record<string, string> {
  const schema = getPageSchema(pageKey);
  const [fields, setFields] = useState<Record<string, string>>(schema?.defaults || {});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await fetch(`${func2url['page-content']}?key=${encodeURIComponent(pageKey)}`);
        if (!resp.ok) return;
        const data = await resp.json();
        if (!cancelled && data.fields && Object.keys(data.fields).length > 0) {
          setFields((prev) => ({ ...prev, ...data.fields }));
        }
      } catch {
        // тихо остаёмся на значениях по умолчанию
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  return fields;
}

export default usePageContent;
