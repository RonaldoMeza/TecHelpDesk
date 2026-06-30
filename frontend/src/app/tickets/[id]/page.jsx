'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import TicketActions from '../../../components/tickets/TicketActions';
import TicketHistoryList from '../../../components/tickets/TicketHistoryList';
import TicketPriorityBadge from '../../../components/tickets/TicketPriorityBadge';
import TicketStatusBadge from '../../../components/tickets/TicketStatusBadge';
import { getUser, logout } from '../../../lib/auth';
import { addTicketHistory, getTicket } from '../../../lib/tickets';

function formatDate(date) {
  return date ? new Date(date).toLocaleString('es-PE') : '-';
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingComment, setSavingComment] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function refreshTicket() {
    try {
      setError('');
      setUser(getUser());
      const result = await getTicket(params.id);
      setTicket(result.data);
    } catch (err) {
      setError(err.message);
      if (err.status === 401) {
        logout();
        router.replace('/login');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialTicket() {
      try {
        setUser(getUser());
        const result = await getTicket(params.id);
        setTicket(result.data);
      } catch (err) {
        setError(err.message);
        if (err.status === 401) {
          logout();
          router.replace('/login');
        }
      } finally {
        setLoading(false);
      }
    }

    loadInitialTicket();
  }, [params.id, router]);

  async function handleAddComment(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!comment || comment.trim().length < 3) {
      setError('El comentario debe tener al menos 3 caracteres.');
      return;
    }

    try {
      setSavingComment(true);
      await addTicketHistory(params.id, comment);
      setComment('');
      setMessage('Comentario agregado correctamente.');
      await refreshTicket();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingComment(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="page-surface min-h-[calc(100vh-73px)] px-6 py-10">
        <div className="mx-auto max-w-6xl">
        <Link href="/tickets" className="text-sm font-bold text-blue-700 hover:text-blue-900">← Volver a tickets</Link>

        {loading && <p className="mt-6 rounded-2xl bg-white p-5 text-slate-600 shadow-sm">Cargando ticket...</p>}
        {error && <p className="mt-6 rounded-2xl bg-red-50 p-5 font-medium text-red-700">{error}</p>}

        {ticket && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="space-y-6">
              <article className="soft-card rounded-[2rem] p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">Ticket #{ticket.id}</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{ticket.title}</h1>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <TicketStatusBadge status={ticket.status} />
                    <TicketPriorityBadge priority={ticket.priority} />
                  </div>
                </div>

                <p className="mt-5 whitespace-pre-wrap text-slate-700">{ticket.description}</p>

                <dl className="mt-6 grid gap-4 text-sm md:grid-cols-2">
                  <div><dt className="font-bold text-slate-900">Categoría</dt><dd className="text-slate-600">{ticket.category}</dd></div>
                  <div><dt className="font-bold text-slate-900">Creador</dt><dd className="text-slate-600">{ticket.creator?.name} · {ticket.creator?.email}</dd></div>
                  <div><dt className="font-bold text-slate-900">Responsable</dt><dd className="text-slate-600">{ticket.assignee ? `${ticket.assignee.name} · ${ticket.assignee.email}` : 'Sin asignar'}</dd></div>
                  <div><dt className="font-bold text-slate-900">Creación</dt><dd className="text-slate-600">{formatDate(ticket.createdAt)}</dd></div>
                  <div><dt className="font-bold text-slate-900">Actualización</dt><dd className="text-slate-600">{formatDate(ticket.updatedAt)}</dd></div>
                </dl>
              </article>

              <section className="soft-card rounded-[2rem] p-6">
                <h2 className="text-xl font-bold text-slate-950">Historial</h2>
                <div className="mt-5"><TicketHistoryList histories={ticket.histories || []} /></div>
              </section>
            </section>

            <aside className="space-y-6">
              <TicketActions ticket={ticket} user={user} onChanged={refreshTicket} onDeleted={() => router.push('/tickets?deleted=1')} />

              <form onSubmit={handleAddComment} className="soft-card rounded-[2rem] p-6">
                <h2 className="text-xl font-bold text-slate-950">Agregar comentario</h2>
                <textarea aria-label="Comentario para historial" value={comment} onChange={(event) => setComment(event.target.value)} rows="4" placeholder="Escribe una actualización del caso" className="field-control mt-4" />
                <button type="submit" disabled={savingComment} className="mt-3 rounded-xl px-4 py-3 font-bold primary-button transition disabled:opacity-60">
                  {savingComment ? 'Guardando...' : 'Agregar comentario'}
                </button>
                {message && <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{message}</p>}
              </form>
            </aside>
          </div>
        )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
