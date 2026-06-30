'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch } from '../../lib/api';
import { saveSession } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Email y contraseña son obligatorios.');
      return;
    }

    try {
      setLoading(true);
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      saveSession(data);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-surface grid min-h-[calc(100vh-73px)] place-items-center px-6 py-12">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center items-center">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-blue-950/15 ">
        <div className="primary-gradient p-8">
          <p className="text-sm font-bold text-blue-100">Credenciales de prueba</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Acceso rápido al laboratorio</h2>
        </div>
        <div className="space-y-4 p-8 text-sm text-black bg-white">
          <p><strong>Admin:</strong> admin@techelpdesk.com / Admin123456</p>
          <p><strong>Soporte:</strong> soporte@techelpdesk.com / Soporte123456</p>
          <p><strong>Cliente:</strong> cliente@techelpdesk.com / Cliente123456</p>
        </div>
      </section>

      <section className="glass-card rounded-[2rem] p-8 max-w-lg">
        <h1 className="text-3xl font-black tracking-tight text-slate-950 text-center">Iniciar sesión</h1>
        <p className="mt-2 text-slate-600 text-center">Accede al panel base de TecHelpDesk.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="field-control mt-2" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Contraseña</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="field-control mt-2" />
          </label>

          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

          <button type="submit" disabled={loading} className="w-full rounded-xl px-5 py-3 font-bold primary-button transition disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600 flex items-center justify-end gap-1">
          ¿No tienes cuenta? <Link href="/register" className="font-semibold text-blue-700">Regístrate</Link>
        </p>
      </section>
      </div>
    </main>
  );
}
