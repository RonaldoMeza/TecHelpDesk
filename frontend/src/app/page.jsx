import Link from 'next/link';

const roles = ['Administrador', 'Soporte', 'Cliente'];

export const metadata = {
  title: 'Inicio',
  description: 'TecHelpDesk centraliza el registro y seguimiento de tickets de soporte para administradores, soporte y clientes.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TecHelpDesk | Mesa de Ayuda',
    description: 'Plataforma Help Desk para registrar y dar seguimiento a tickets e incidencias.',
    url: '/',
  },
};

export default function Home() {
  return (
    <main className="page-surface min-h-[calc(100vh-73px)]">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-24">
        <div>
          <p className="inline-flex rounded-full border border-blue-200/80 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm shadow-blue-950/5">
            Help Desk moderno para incidencias
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-6xl">
            Gestiona soporte con una experiencia clara, rápida y minimalista.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            TecHelpDesk centraliza tickets, responsables e historial con una interfaz limpia para administradores, soporte y clientes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className="rounded-full px-6 py-3 text-center font-bold primary-button transition">
              Iniciar sesión
            </Link>
            <Link href="/register" className="rounded-full border border-white bg-white/80 px-6 py-3 text-center font-bold text-slate-800 shadow-sm transition hover:border-blue-200 hover:bg-white hover:text-blue-700">
              Registrarse
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {roles.map((role) => (
              <span key={role} className="rounded-full border border-white/80 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm shadow-blue-950/5">
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-4">
          <div className="overflow-hidden rounded-[1.5rem] bg-slate-950 text-white">
            <div className="primary-gradient p-6">
              <p className="text-sm font-semibold text-blue-100">Panel operativo</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight">Seguimiento preciso para cada incidencia</h2>
            </div>
            <div className="space-y-3 p-6">
              {['Autenticación segura', 'Roles definidos', 'Historial trazable'].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-sm font-semibold">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-sm font-black text-blue-700">{index + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
