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
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-sm shadow-blue-950/5">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-black tracking-tight text-slate-950 outline-none transition focus-visible:rounded focus-visible:ring-4 focus-visible:ring-blue-200">
          <span className="grid h-9 w-9 place-items-center rounded-2xl primary-gradient text-sm text-white">T</span>
          <span className="hidden sm:inline">TecHelpDesk</span>
        </Link>

        <div className="ml-auto flex min-w-0 flex-nowrap items-center gap-1 overflow-x-auto whitespace-nowrap text-sm font-semibold [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden">
          <Link href="/" className="shrink-0 rounded-full px-3 py-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
            Inicio
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="shrink-0 rounded-full px-3 py-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
                Dashboard
              </Link>
              <Link href="/tickets" className="shrink-0 rounded-full px-3 py-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
                Tickets
              </Link>
              <Link href="/tickets/new" className="shrink-0 rounded-full px-3 py-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
                Crear ticket
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="shrink-0 rounded-full bg-slate-950 px-4 py-2 text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="shrink-0 rounded-full px-5 py-2 primary-button transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
