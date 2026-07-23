/**
 * Рендерит юридический документ (оферта, политика конфиденциальности, cookie)
 * из простого текстового формата, редактируемого в CMS:
 * - строка вида "## Заголовок" — заголовок раздела (h2)
 * - строка вида "- пункт" — элемент маркированного списка
 * - обычная строка — абзац
 * Разделы/абзацы разделяются переводом строки в самом тексте.
 */
import Icon from '@/components/ui/icon';

interface LegalDocumentProps {
  text: string;
}

const LegalDocument = ({ text }: LegalDocumentProps) => {
  const lines = (text || '').split('\n').filter((l) => l.trim().length > 0);

  const blocks: { type: 'heading' | 'list' | 'paragraph'; content: string | string[] }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'heading', content: trimmed.slice(3) });
    } else if (trimmed.startsWith('- ')) {
      const last = blocks[blocks.length - 1];
      if (last && last.type === 'list') {
        (last.content as string[]).push(trimmed.slice(2));
      } else {
        blocks.push({ type: 'list', content: [trimmed.slice(2)] });
      }
    } else {
      blocks.push({ type: 'paragraph', content: trimmed });
    }
  }

  return (
    <div className="space-y-3">
      {blocks.map((b, i) => {
        if (b.type === 'heading') {
          return (
            <h2 key={i} className="mb-3 mt-8 font-display text-xl font-semibold first:mt-0">
              {b.content as string}
            </h2>
          );
        }
        if (b.type === 'list') {
          return (
            <ul key={i} className="space-y-2">
              {(b.content as string[]).map((li) => (
                <li key={li} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                  <Icon name="Check" size={16} className="mt-0.5 shrink-0 text-primary" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-sm leading-relaxed text-muted-foreground">
            {b.content as string}
          </p>
        );
      })}
    </div>
  );
};

export default LegalDocument;
