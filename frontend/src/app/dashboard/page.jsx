'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import StatCard from '../../components/StatCard';
import { apiFetch } from '../../lib/api';
import { logout } from '../../lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiFetch('/auth/me');
        setUser(data.user);
      } catch (err) {
        setError(err.message);
        logout();
        router.replace('/login');
      }
    }

    loadProfile();
  }, [router]);

  return (
    <ProtectedRoute>
      <main className="page-surface min-h-[calc(100vh-73px)] px-6 py-10">
        <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-blue-950/15">
          <div className="primary-gradient p-8">
          <p className="text-sm font-bold text-blue-100">Dashboard</p>
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight">Bienvenido a TecHelpDesk</h1>
              <p className="mt-2 text-blue-100">Accede al módulo de tickets y continúa el seguimiento de incidencias.</p>
            </div>
          </div>
          </div>
        </section>

        {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <StatCard title="Usuario" value={user?.name || 'Cargando...'} description={user?.email || 'Validando perfil autenticado'} />
          <StatCard title="Rol" value={user?.role || '-'} description="Permisos aplicados desde el backend" />
          <StatCard title="Sesión" value="JWT" description="Token guardado en localStorage" />
        </section>

        <section className="soft-card mt-8 rounded-[2rem] p-6">
          <h2 className="text-xl font-bold text-slate-950">Accesos rápidos</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/tickets" className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-blue-950/10">
              <p className="font-bold text-slate-900">Ver tickets</p>
              <p className="mt-2 text-sm text-slate-600">Consulta incidencias según tu rol.</p>
            </Link>
            <Link href="/tickets/new" className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-lg hover:shadow-blue-950/10">
              <p className="font-bold text-slate-900">Crear ticket</p>
              <p className="mt-2 text-sm text-slate-600">Registra una nueva incidencia.</p>
            </Link>
            {user?.role === 'ADMIN' && (
              <Link href="/tickets" className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white hover:shadow-lg hover:shadow-blue-950/10">
                <p className="font-bold text-slate-900">Gestión general de tickets</p>
                <p className="mt-2 text-sm text-slate-600">Administra todos los casos.</p>
              </Link>
            )}
            {user?.role === 'SOPORTE' && (
              <Link href="/tickets" className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-5 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white hover:shadow-lg hover:shadow-blue-950/10">
                <p className="font-bold text-slate-900">Atender incidencias</p>
                <p className="mt-2 text-sm text-slate-600">Revisa tickets asignados o pendientes.</p>
              </Link>
            )}
            {user?.role === 'CLIENTE' && (
              <Link href="/tickets" className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-lg hover:shadow-blue-950/10">
                <p className="font-bold text-slate-900">Mis tickets</p>
                <p className="mt-2 text-sm text-slate-600">Consulta tus solicitudes creadas.</p>
              </Link>
            )}
          </div>
        </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
