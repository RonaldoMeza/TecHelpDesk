'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthSnapshot, subscribeAuth } from '../lib/auth';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const authStatus = useSyncExternalStore(subscribeAuth, getAuthSnapshot, () => 'checking');

  useEffect(() => {
    if (authStatus === 'guest') {
      router.replace('/login');
    }
  }, [authStatus, router]);

  if (authStatus !== 'authenticated') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">
        <div className="rounded-2xl bg-white px-6 py-5 text-sm font-medium text-slate-600 shadow-sm">
          Validando sesión...
        </div>
      </div>
    );
  }

  return children;
}
