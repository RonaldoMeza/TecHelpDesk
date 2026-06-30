import Link from 'next/link';
import TicketPriorityBadge from './TicketPriorityBadge';
import TicketStatusBadge from './TicketStatusBadge';

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString('es-PE') : '-';
}

export default function TicketCard({ ticket }) {
  return (
    <article className="soft-card rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-950/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">#{ticket.id} · {ticket.category}</p>
          <h2 className="mt-2 text-lg font-black text-slate-950">{ticket.title}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <TicketStatusBadge status={ticket.status} />
          <TicketPriorityBadge priority={ticket.priority} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
        <p><span className="font-semibold text-slate-900">Creador:</span> {ticket.creator?.name || '-'}</p>
        <p><span className="font-semibold text-slate-900">Responsable:</span> {ticket.assignee?.name || 'Sin asignar'}</p>
        <p><span className="font-semibold text-slate-900">Fecha:</span> {formatDate(ticket.createdAt)}</p>
      </div>

      <div className="mt-5 flex justify-end">
        <Link href={`/tickets/${ticket.id}`} className="rounded-full px-4 py-2 text-sm font-bold primary-button transition">
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
