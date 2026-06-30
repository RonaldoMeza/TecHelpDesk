'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch } from '../../lib/api';
import { saveSession } from '../../lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password) {
      setError('Nombre, email y contraseña son obligatorios.');
      return;
    }

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      setLoading(true);
      const data = await apiFetch('/auth/register', {
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
    <main className="page-surface flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
      <section className="glass-card w-full max-w-lg rounded-[2rem] p-8">
        <a href="/login" className="text-blue-700 font-semibold hover:text-blue-900">
          ← Volver al login
        </a>
        <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950 text-center">Crear cuenta cliente</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Nombre</span>
            <input name="name" value={form.name} onChange={handleChange} className="field-control mt-2" />
          </label>
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
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>
      </section>
    </main>
  );
}
