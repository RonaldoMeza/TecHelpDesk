'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import TicketForm from '../../../../components/tickets/TicketForm';
import { getUser, logout } from '../../../../lib/auth';
import { getTicket, updateTicket } from '../../../../lib/tickets';

export default function EditTicketPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTicket() {
      try {
        const result = await getTicket(params.id);
        const currentUser = getUser();
        const item = result.data;

        if (currentUser?.role === 'CLIENTE' && item.status !== 'ABIERTO') {
          setError('Solo puedes editar tickets abiertos.');
        }

        setTicket(item);
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

    loadTicket();
  }, [params.id, router]);

  async function handleSubmit(form) {
    try {
      await updateTicket(params.id, form);
      router.push(`/tickets/${params.id}`);
    } catch (err) {
      if (err.status === 401) {
        logout();
        router.replace('/login');
      }
      throw err;
    }
  }

  return (
    <ProtectedRoute>
      <main className="page-surface min-h-[calc(100vh-73px)] px-6 py-10">
        <div className="mx-auto max-w-3xl">
        <Link href={`/tickets/${params.id}`} className="text-sm font-bold text-blue-700 hover:text-blue-900">← Volver al detalle</Link>
        <header className="mt-5 mb-6">
          <p className="text-sm font-semibold text-blue-700">Editar ticket</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Actualizar información general</h1>
          <p className="mt-2 text-slate-600">Esta pantalla no cambia estado ni responsable.</p>
        </header>

        {loading && <p className="rounded-2xl bg-white p-5 text-slate-600 shadow-sm">Cargando ticket...</p>}
        {error && <p className="mb-5 rounded-2xl bg-red-50 p-5 font-medium text-red-700">{error}</p>}
        {ticket && !error && <TicketForm initialValues={ticket} submitLabel="Guardar cambios" onSubmit={handleSubmit} />}
        </div>
      </main>
    </ProtectedRoute>
  );
}
