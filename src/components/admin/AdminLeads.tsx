import { Lead, fmtDate } from './adminHelpers';

interface Props {
  leads: Lead[];
}

const AdminLeads = ({ leads }: Props) => {
  return (
    <div className="mt-6 space-y-3">
      {leads.length === 0 && (
        <p className="text-sm text-muted-foreground">Заявок пока нет.</p>
      )}
      {leads.map((l) => (
        <div key={l.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium">{l.service || 'Заявка'}</span>
            <span className="text-sm text-muted-foreground">{fmtDate(l.created_at)}</span>
          </div>
          <div className="mt-2 grid gap-1 text-sm sm:grid-cols-3">
            {l.people != null && (
              <p><span className="text-muted-foreground">Участников:</span> {l.people}</p>
            )}
            <p><span className="text-muted-foreground">Телефон:</span> {l.phone}</p>
            <p><span className="text-muted-foreground">Email:</span> {l.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminLeads;
