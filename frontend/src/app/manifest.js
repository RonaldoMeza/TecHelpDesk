export default function manifest() {
  return {
    name: 'TecHelpDesk - Sistema de Mesa de Ayuda',
    short_name: 'TecHelpDesk',
    description: 'Sistema web Help Desk para registrar, gestionar y dar seguimiento a tickets e incidencias.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#1d4ed8',
    lang: 'es-PE',
    categories: ['business', 'productivity', 'utilities'],
    icons: [
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
