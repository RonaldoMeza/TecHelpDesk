'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import TicketForm from '../../../components/tickets/TicketForm';
import { createTicket } from '../../../lib/tickets';
import { logout } from '../../../lib/auth';

export default function NewTicketPage() {
  const router = useRouter();

  async function handleSubmit(form) {
    try {
      await createTicket(form);
      router.push('/tickets?created=1');
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
        <Link href="/tickets" className="text-sm font-bold text-blue-700 hover:text-blue-900">← Volver a tickets</Link>
        <header className="mt-5 mb-6">
          <p className="text-sm font-semibold text-blue-700">Nuevo ticket</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Registrar incidencia</h1>
          <p className="mt-2 text-slate-600">Describe el problema para que el equipo pueda darle seguimiento.</p>
        </header>
        <TicketForm submitLabel="Crear ticket" onSubmit={handleSubmit} />
        </div>
      </main>
    </ProtectedRoute>
  );
}
