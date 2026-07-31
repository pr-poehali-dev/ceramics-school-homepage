import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { fmtDate } from './adminHelpers';
import func2url from '../../../backend/func2url.json';

interface GiftHint {
  id: number;
  senderName: string;
  recipientName: string;
  recipientEmail: string | null;
  recipientContact: string | null;
  giftType: string;
  giftSlug: string | null;
  giftLabel: string;
  message: string | null;
  emailSent: boolean;
  emailError: string | null;
  city: string;
  createdAt: string | null;
}

interface Props {
  token: string;
}

const AdminGiftHints = ({ token }: Props) => {
  const [hints, setHints] = useState<GiftHint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const resp = await fetch(`${func2url['gift-hint']}?all=1`, {
          headers: { 'X-Session-Token': token },
        });
        const data = await resp.json();
        if (resp.ok) setHints(data.hints || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) {
    return (
      <div className="mt-8 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      <p className="text-sm text-muted-foreground">
        Заявки формы «Намекнуть на подарок». Эта база пригодится для будущих триггерных рассылок.
      </p>

      {hints.length === 0 && (
        <p className="text-sm text-muted-foreground">Намёков пока не отправляли.</p>
      )}

      {hints.map((h) => (
        <div key={h.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Icon name="Gift" size={15} className="text-primary" />
              {h.giftLabel}
            </span>
            <span className="text-sm text-muted-foreground">
              {h.createdAt ? fmtDate(h.createdAt) : '—'}
            </span>
          </div>
          <div className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
            <p><span className="text-muted-foreground">Кому:</span> {h.recipientName}</p>
            <p><span className="text-muted-foreground">От кого:</span> {h.senderName}</p>
            {h.recipientEmail && (
              <p><span className="text-muted-foreground">Email получателя:</span> {h.recipientEmail}</p>
            )}
            {h.recipientContact && (
              <p><span className="text-muted-foreground">Контакт:</span> {h.recipientContact}</p>
            )}
          </div>
          {h.message && (
            <p className="mt-2 rounded-xl bg-secondary/40 p-3 text-sm text-muted-foreground">
              «{h.message}»
            </p>
          )}
          <div className="mt-2">
            {h.emailSent ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                <Icon name="CheckCircle2" size={12} /> Письмо отправлено
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                <Icon name="AlertCircle" size={12} /> Ошибка отправки{h.emailError ? `: ${h.emailError}` : ''}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminGiftHints;