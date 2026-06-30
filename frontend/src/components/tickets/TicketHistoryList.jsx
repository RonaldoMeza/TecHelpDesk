const EMPTY_HISTORIES = [];

function formatDate(date) {
  return date ? new Date(date).toLocaleString('es-PE') : '-';
}

export default function TicketHistoryList({ histories = EMPTY_HISTORIES }) {
  if (!histories.length) {
    return <p className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">Este ticket aún no tiene historial.</p>;
  }

  return (
    <div className="space-y-3">
      {histories.map((history) => (
        <article key={history.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold text-slate-900">{history.user?.name || 'Usuario'}</p>
            <p className="text-xs text-slate-500">{formatDate(history.createdAt)}</p>
          </div>
          <p className="mt-2 text-sm text-slate-700">{history.comment}</p>
          {(history.oldStatus || history.newStatus) && (
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Estado: {history.oldStatus || 'N/A'} → {history.newStatus || 'N/A'}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
