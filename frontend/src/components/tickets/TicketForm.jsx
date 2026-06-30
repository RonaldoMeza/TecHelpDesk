'use client';

import { useState } from 'react';

const priorities = ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'];

export default function TicketForm({ initialValues, submitLabel = 'Guardar ticket', onSubmit }) {
  const [form, setForm] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    category: initialValues?.category || '',
    priority: initialValues?.priority || 'MEDIA',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.title || !form.description || !form.category || !form.priority) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (form.description.trim().length < 10) {
      setError('La descripción debe tener al menos 10 caracteres.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-5 rounded-[2rem] p-6">
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Título</span>
        <input name="title" value={form.title} onChange={handleChange} className="field-control mt-2" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Descripción</span>
        <textarea name="description" rows="5" value={form.description} onChange={handleChange} className="field-control mt-2" />
      </label>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Categoría</span>
          <input name="category" value={form.category} onChange={handleChange} className="field-control mt-2" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Prioridad</span>
          <select name="priority" value={form.priority} onChange={handleChange} className="field-control mt-2">
            {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
          </select>
        </label>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="rounded-xl px-5 py-3 font-bold primary-button transition disabled:opacity-60 cursor-pointer">
              {loading ? 'Guardando...' : submitLabel}
            </button> 
      </div>

    </form>
  );
}
