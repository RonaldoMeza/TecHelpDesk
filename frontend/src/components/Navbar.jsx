'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { getAuthSnapshot, getUser, logout, subscribeAuth } from '../lib/auth';

export default function Navbar() {
  const router = useRouter();
  const authStatus = useSyncExternalStore(subscribeAuth, getAuthSnapshot, () => 'checking');
  const user = authStatus === 'authenticated' ? getUser() : null;

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 shadow-sm shadow-blue-950/5 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-950 outline-none transition focus-visible:rounded focus-visible:ring-4 focus-visible:ring-blue-200">
          <span className="grid h-9 w-9 place-items-center rounded-2xl primary-gradient text-sm text-white shadow-lg shadow-blue-700/20">T</span>
          <span>TecHelpDesk</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold sm:gap-3">
          <Link href="/" className="rounded-full px-3 py-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
            Inicio
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="rounded-full px-3 py-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
                Dashboard
              </Link>
              <Link href="/tickets" className="rounded-full px-3 py-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
                Tickets
              </Link>
              <Link href="/tickets/new" className="rounded-full px-3 py-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
                Crear ticket
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-slate-950 px-4 py-2 text-white shadow-lg shadow-slate-950/10 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full px-5 py-2 primary-button transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
