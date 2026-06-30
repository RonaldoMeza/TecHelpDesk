'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { assignTicket, deleteTicket, getSupportUsers, updateTicketStatus } from '../../lib/tickets';

const statuses = ['ABIERTO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];

export default function TicketActions({ ticket, user, onChanged, onDeleted }) {
  const [supportUsers, setSupportUsers] = useState([]);
  const [assigneeId, setAssigneeId] = useState('');
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'ADMIN';
  const isSupport = user?.role === 'SOPORTE';
  const isClient = user?.role === 'CLIENTE';
  const canEdit = isAdmin || isSupport || (isClient && ticket.status === 'ABIERTO');
  const canChangeStatus = isAdmin || isSupport;
  const canAssign = isAdmin || (isSupport && !ticket.assigneeId);

  useEffect(() => {
    async function loadSupportUsers() {
      if (!isAdmin) return;

      try {
        const result = await getSupportUsers();
        setSupportUsers(result.data || []);
      } catch (err) {
        setError(err.message);
      }
    }

    loadSupportUsers();
  }, [isAdmin]);

  async function handleAssign() {
    setError('');
    setMessage('');

    try {
      const targetAssigneeId = isSupport ? user.id : Number(assigneeId);
      if (!targetAssigneeId) throw new Error('Selecciona un usuario de soporte.');
      await assignTicket(ticket.id, targetAssigneeId);
      setMessage('Ticket asignado correctamente.');
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleStatusChange(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      await updateTicketStatus(ticket.id, { status: status || ticket.status, comment });
      setComment('');
      setMessage('Estado actualizado correctamente.');
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm('¿Seguro que deseas eliminar este ticket?')) return;

    try {
      await deleteTicket(ticket.id);
      onDeleted();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="soft-card rounded-[2rem] p-6">
      <h2 className="text-xl font-bold text-slate-950">Acciones</h2>

      <div className="mt-5 flex flex-wrap gap-3">
        {canEdit && (
          <Link href={`/tickets/${ticket.id}/edit`} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:bg-blue-700">
            Editar ticket
          </Link>
        )}
        {isAdmin && (
          <button type="button" onClick={handleDelete} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-700/15 transition hover:bg-red-700">
            Eliminar ticket
          </button>
        )}
      </div>

      {canAssign && (
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
          <h3 className="font-bold text-slate-900">Asignación</h3>
          {isAdmin ? (
            <div className="mt-3 flex flex-col gap-3">
              <select value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)} className="field-control">
                <option value="">Selecciona soporte</option>
                {supportUsers.map((support) => <option key={support.id} value={support.id}>{support.name} · {support.email}</option>)}
              </select>
              <button type="button" onClick={handleAssign} className="w-full rounded-xl px-4 py-3 font-bold primary-button transition">Asignar</button>
            </div>
          ) : (
            <button type="button" onClick={handleAssign} className="mt-3 w-full rounded-xl px-4 py-3 font-bold primary-button transition">Asignarme</button>
          )}
        </div>
      )}

      {canChangeStatus && (
        <form onSubmit={handleStatusChange} className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
          <h3 className="font-bold text-slate-900">Cambiar estado</h3>
          <div className="mt-3 flex flex-col gap-3">
            <select aria-label="Nuevo estado del ticket" value={status || ticket.status} onChange={(event) => setStatus(event.target.value)} className="field-control">
              {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <textarea aria-label="Comentario para cambio de estado" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Comentario opcional para registrar en el historial" rows="3" className="field-control resize-none" />
            <button type="submit" className="w-full rounded-xl px-4 py-3 font-bold primary-button transition">Guardar cambio de estado</button>
          </div>
        </form>
      )}

      {message && <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{message}</p>}
      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
    </section>
  );
}
