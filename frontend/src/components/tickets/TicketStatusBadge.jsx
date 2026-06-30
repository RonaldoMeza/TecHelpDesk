const statusClasses = {
  ABIERTO: 'bg-blue-50 text-blue-700 ring-blue-200',
  EN_PROCESO: 'bg-yellow-50 text-yellow-800 ring-yellow-200',
  RESUELTO: 'bg-green-50 text-green-700 ring-green-200',
  CERRADO: 'bg-slate-100 text-slate-700 ring-slate-200',
};

export default function TicketStatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses[status] || statusClasses.CERRADO}`}>
      {status?.replace('_', ' ') || 'SIN ESTADO'}
    </span>
  );
}
