'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import TicketCard from '../../components/tickets/TicketCard';
import { getTickets } from '../../lib/tickets';
import { getUser, logout } from '../../lib/auth';

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTickets() {
      try {
        setUser(getUser());
        const result = await getTickets();
        setTickets(result.data || []);
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

    loadTickets();
  }, [router]);

  return (
    <ProtectedRoute>
      <main className="page-surface min-h-[calc(100vh-73px)] px-6 py-10">
        <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 overflow-hidden rounded-[2rem] primary-gradient p-8 text-white shadow-lg shadow-blue-950/10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-blue-100">Tickets</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Gestión de incidencias</h1>
            <p className="mt-2 text-blue-100">
              {user?.role === 'CLIENTE' ? 'Consulta tus tickets registrados.' : 'Consulta y administra los tickets del sistema.'}
            </p>
          </div>
          <Link href="/tickets/new" className="rounded-full bg-white/95 px-5 py-3 text-center font-bold text-blue-950 shadow-lg shadow-blue-950/10 transition hover:bg-white">
            Crear ticket
          </Link>
        </header>

        {loading && <p className="mt-6 rounded-2xl bg-white p-5 text-slate-600 shadow-sm">Cargando tickets...</p>}
        {error && <p className="mt-6 rounded-2xl bg-red-50 p-5 font-medium text-red-700">{error}</p>}

        {!loading && !error && tickets.length === 0 && (
          <section className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-slate-950">No hay tickets registrados</h2>
            <p className="mt-2 text-slate-600">Crea el primer ticket para iniciar el seguimiento.</p>
          </section>
        )}

        <section className="mt-6 grid gap-4">
          {tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)}
        </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
