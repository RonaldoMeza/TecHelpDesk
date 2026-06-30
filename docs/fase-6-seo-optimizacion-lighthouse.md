# Fase 6 - SEO, optimizacion y preparacion Lighthouse

## Objetivo

Mejorar el frontend de TecHelpDesk para cumplir requerimientos de SEO, accesibilidad basica, responsive design, optimizacion y preparacion para Lighthouse, sin modificar backend ni Prisma.

## Requerimientos del laboratorio que cumple

- Metadata global configurada.
- Metadata especifica en rutas principales mediante layouts por segmento cuando la pagina es cliente.
- Sitemap generado por App Router.
- Robots generado por App Router.
- Variable `NEXT_PUBLIC_SITE_URL` preparada para despliegue posterior.
- Navegacion responsive y accesible.
- Limpieza de `console.log` e imagenes no optimizadas.
- Verificacion con `npm run lint` y `npm run build`.

## Archivos creados

- `frontend/src/app/sitemap.js`
- `frontend/src/app/robots.js`
- `frontend/src/app/login/layout.js`
- `frontend/src/app/register/layout.js`
- `frontend/src/app/dashboard/layout.js`
- `frontend/src/app/tickets/layout.js`
- `frontend/src/app/tickets/new/layout.js`
- `docs/fase-6-seo-optimizacion-lighthouse.md`
- `docs/guia-pruebas-frontend-completo.md`

## Archivos modificados

- `frontend/.env.local`
- `frontend/src/app/layout.tsx`
- `frontend/src/app/page.jsx`
- `frontend/src/components/Navbar.jsx`

## Metadata agregada

Metadata global en `frontend/src/app/layout.tsx`:

- Title base: `TecHelpDesk | Mesa de Ayuda`
- Description: `Sistema web Help Desk para registrar, gestionar y dar seguimiento a tickets e incidencias.`
- Keywords: `help desk`, `mesa de ayuda`, `tickets`, `soporte técnico`, `incidencias`, `TecHelpDesk`
- Author: `Diego Meza`
- Open Graph con `title`, `description`, `type`, `locale` y `siteName`
- Robots globales con `index: true` y `follow: true`
- HTML con `lang="es"`
- Viewport y `themeColor`

Metadata por rutas:

- `/`: metadata especifica en `page.jsx`.
- `/login`: metadata en `login/layout.js`.
- `/register`: metadata en `register/layout.js`.
- `/dashboard`: metadata privada en `dashboard/layout.js` con `index: false`.
- `/tickets`: metadata privada en `tickets/layout.js` con `index: false`.
- `/tickets/new`: metadata privada en `tickets/new/layout.js` con `index: false`.

## Sitemap implementado

Archivo: `frontend/src/app/sitemap.js`

Rutas incluidas:

- `/`
- `/login`
- `/register`

Usa `NEXT_PUBLIC_SITE_URL` y por defecto `http://localhost:3000`. Se dejaron solo rutas publicas indexables para evitar conflicto entre sitemap y robots.

## Manifest implementado

Archivo: `frontend/src/app/manifest.js`

Define nombre de aplicacion, descripcion, idioma, colores de tema, modo standalone e icono base para mejorar Best Practices y preparacion PWA ligera sin agregar dependencias.

## Robots implementado

Archivo: `frontend/src/app/robots.js`

Configuracion:

- `Allow: /`
- `Disallow: /dashboard`
- `Disallow: /tickets`
- `Disallow: /tickets/`
- `Disallow: /api`
- Sitemap apuntando a `${NEXT_PUBLIC_SITE_URL}/sitemap.xml`

## Mejoras responsive

- Navbar ajustado para envolver enlaces en pantallas pequenas.
- Espaciado movil mejorado en navegacion.
- Se mantuvieron cards responsive para dashboard y tickets.
- Formularios siguen usando layout mobile first.
- No hay tablas que requieran `overflow-x-auto`.

## Mejoras de accesibilidad

- `html lang="es"` configurado.
- Link de salto al contenido principal.
- Enlaces y botones del navbar con estados `focus-visible`.
- Botones con texto claro y `type` explicito.
- Formularios con labels visibles.
- Mensajes de error visibles en formularios.

## Optimizacion de imagenes

No hay etiquetas `<img>` en el frontend actual. No se agregaron imagenes externas ni recursos pesados. La landing usa CSS/Tailwind para el elemento visual, evitando impacto innecesario en performance.

## Limpieza para rendimiento

- No se encontraron `console.log` en `frontend/src`.
- No se agregaron dependencias nuevas.
- No se modifico backend ni Prisma.
- Se mantuvieron componentes simples y reutilizables.

## Comandos ejecutados

```bash
npm run lint
npm run build
```

## Pruebas realizadas

- `npm run lint`: OK.
- `npm run build`: OK.
- Build genera `/sitemap.xml`: OK.
- Build genera `/robots.txt`: OK.
- Verificacion con `next start` en puerto temporal `3002`: `/`, `/sitemap.xml`, `/robots.txt`, `/login`, `/register`, `/dashboard` y `/tickets` respondieron status `200`.
- Revision de `console.log`: OK, no hay coincidencias.
- Revision de `<img>`: OK, no hay etiquetas sin optimizar.

## Resultados esperados

- Landing responsive y con metadata SEO.
- `/sitemap.xml` disponible al levantar el frontend.
- `/robots.txt` disponible al levantar el frontend.
- Formularios usables en escritorio y movil.
- Dashboard y tickets conservan funcionalidad.
- Lighthouse en landing preparado para apuntar a puntajes ideales mayores o iguales a 85.

## Recomendaciones para medir Lighthouse

1. Levantar backend con `npm run dev` desde `backend`.
2. Desde `frontend`, ejecutar `npm run build`.
3. Desde `frontend`, ejecutar `npm run start`.
4. Abrir `http://localhost:3000` en Chrome.
5. Usar ventana incognito para evitar datos almacenados en IndexedDB, cache o extensiones.
6. Abrir DevTools, pestaña Lighthouse.
7. Ejecutar auditoria en modo Desktop y Mobile.
8. Validar Performance, Accessibility, Best Practices y SEO.

Si Lighthouse muestra "Minify JavaScript", normalmente se esta auditando modo desarrollo, cache antigua o extensiones. Repetir con `npm run build` + `npm run start`, ventana incognito y datos del sitio limpios.

Importante: medir SEO sobre la landing `/`. Las rutas `/dashboard` y `/tickets` son privadas y estan bloqueadas por robots/noindex, por lo que Lighthouse puede marcar SEO bajo si se auditan directamente.

## Problemas encontrados y solucion aplicada

- El enunciado indicaba que el proyecto usaba `app/` en raiz, pero el frontend fue reorganizado previamente y ya funciona bajo `src/app`. Se mantuvo `src/app` para no romper la estructura actual validada.
- Varias paginas funcionales son Client Components por usar `localStorage` y rutas protegidas. Para no romper funcionalidad, se agrego metadata por segmento usando `layout.js` en rutas como `/login`, `/register`, `/dashboard` y `/tickets`.
- No se agregaron imagenes externas para evitar afectar Lighthouse.
- El puerto `3000` estaba ocupado durante una prueba rapida con `next start`; se verifico el frontend en el puerto temporal `3002`.
- Se ajusto el sitemap para incluir solo rutas publicas indexables y se agrego manifest para mejorar compatibilidad con Lighthouse.
