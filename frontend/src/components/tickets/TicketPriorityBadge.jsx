const priorityClasses = {
  BAJA: 'bg-slate-100 text-slate-700 ring-slate-200',
  MEDIA: 'bg-blue-50 text-blue-700 ring-blue-200',
  ALTA: 'bg-orange-50 text-orange-700 ring-orange-200',
  URGENTE: 'bg-red-50 text-red-700 ring-red-200',
};

export default function TicketPriorityBadge({ priority }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${priorityClasses[priority] || priorityClasses.MEDIA}`}>
      {priority || 'MEDIA'}
    </span>
  );
}
