# TecHelpDesk

TecHelpDesk es un Sistema de Mesa de Ayuda / Help Desk desarrollado como laboratorio final del curso Desarrollo de Aplicaciones Web Avanzado.

## Modulo elegido

Modulo 2 - Sistema de Mesa de Ayuda (Help Desk).

## Descripcion

La aplicacion permite registrar, gestionar y dar seguimiento a incidencias mediante tickets. Incluye autenticacion, roles, permisos, asignacion de responsables, cambio de estados, historial de atencion, frontend responsive y preparacion SEO/despliegue.

## Estado del proyecto

- Fase 1: Backend base y base de datos completada.
- Fase 2: Autenticacion, JWT y roles completada.
- Fase 3: Backend de tickets e historial completado.
- Fase 4: Frontend base completado.
- Fase 5: Frontend de tickets completado.
- Fase 6: SEO, responsive, accesibilidad y Lighthouse preparado.
- Fase 7: Preparacion de despliegue y documentacion completada.

## Tecnologias

Backend:

- Node.js
- Express
- Prisma ORM 6
- SQLite
- JWT con `jsonwebtoken`
- bcryptjs
- cors
- dotenv

Frontend:

- Next.js App Router
- React
- JavaScript
- Tailwind CSS
- Fetch API nativo
- localStorage para token JWT

## Roles del sistema

- `ADMIN`: puede administrar usuarios y tickets, asignar responsables, cambiar estados, agregar historial y eliminar tickets.
- `SOPORTE`: puede atender tickets, autoasignarse tickets sin responsable, cambiar estados y agregar historial.
- `CLIENTE`: puede crear tickets, consultar sus propios tickets, editarlos si estan abiertos y agregar comentarios.

## Funcionalidades principales

- Registro de usuarios cliente.
- Login con JWT.
- Passwords encriptados con bcryptjs.
- Proteccion de rutas backend y frontend.
- Permisos por rol.
- CRUD de tickets.
- Asignacion de soporte.
- Cambio de estado.
- Historial automatico y manual.
- Dashboard protegido.
- Frontend responsive.
- Metadata SEO.
- Sitemap.
- robots.txt.
- Manifest web.
- Preparacion para deploy en Render y Vercel.

## Estructura del proyecto

```text
TecHelpDesk/
  backend/
    prisma/
      migrations/
      schema.prisma
      seed.js
    src/
      config/
      controllers/
      middlewares/
      routes/
      utils/
    package.json
    .env.example
  frontend/
    src/
      app/
      components/
      lib/
    package.json
    .env.example
  docs/
  README.md
```

## Instalacion local

Clonar o abrir el proyecto en la carpeta `TecHelpDesk`.

Backend:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
node prisma/seed.js
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

URLs locales:

- Backend: `http://localhost:4000/api`
- Frontend: `http://localhost:3000`

## Variables de entorno

Backend `backend/.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="cambiar_este_secreto_en_produccion"
PORT=4000
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
```

Frontend `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Los archivos ejemplo estan disponibles en:

- `backend/.env.example`
- `frontend/.env.example`

## Credenciales demo

- Admin: `admin@techelpdesk.com` / `Admin123456`
- Soporte: `soporte@techelpdesk.com` / `Soporte123456`
- Cliente: `cliente@techelpdesk.com` / `Cliente123456`

## Comandos backend

```bash
npm run dev
npm run start
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:generate
npm run prisma:studio
npm run seed
```

## Comandos frontend

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Endpoints backend principales

Base URL local: `http://localhost:4000/api`

Sistema:

- `GET /health`
- `GET /db-check`

Autenticacion:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Usuarios:

- `GET /users`
- `GET /users/support`

Tickets:

- `GET /tickets`
- `POST /tickets`
- `GET /tickets/:id`
- `PUT /tickets/:id`
- `PATCH /tickets/:id/assign`
- `PATCH /tickets/:id/status`
- `POST /tickets/:id/histories`
- `GET /tickets/:id/histories`
- `DELETE /tickets/:id`

## Rutas frontend principales

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/tickets`
- `/tickets/new`
- `/tickets/[id]`
- `/tickets/[id]/edit`
- `/sitemap.xml`
- `/robots.txt`
- `/manifest.webmanifest`

## Pruebas locales recomendadas

Backend:

```bash
cd backend
npm run dev
```

Probar:

- `http://localhost:4000/api/health`
- `http://localhost:4000/api/db-check`
- Login admin con `POST /api/auth/login`

Frontend:

```bash
cd frontend
npm run dev
```

Probar:

- Landing: `http://localhost:3000`
- Login: `http://localhost:3000/login`
- Dashboard: `http://localhost:3000/dashboard`
- Tickets: `http://localhost:3000/tickets`
- Sitemap: `http://localhost:3000/sitemap.xml`
- Robots: `http://localhost:3000/robots.txt`

Validacion tecnica:

```bash
cd frontend
npm run lint
npm run build
```

## SEO y Lighthouse

Incluye:

- Metadata global.
- Metadata por rutas principales.
- Sitemap generado por Next.js.
- robots.txt generado por Next.js.
- Manifest web.
- HTML en idioma espanol.
- Diseno responsive.
- Accesibilidad basica.

Recomendacion para Lighthouse:

- Medir sobre `/`, no sobre rutas privadas como `/dashboard` o `/tickets`.
- Usar ventana incognito.
- Preferir build de produccion con `npm run build` y `npm run start`.

## Documentacion por fases

Los documentos estan en `docs/`:

- `fase-1-backend-base.md`
- `fase-2-auth-jwt-roles.md`
- `fase-3-tickets-historial.md`
- `fase-4-frontend-base.md`
- `fase-5-frontend-tickets.md`
- `fase-6-seo-optimizacion-lighthouse.md`
- `fase-7-despliegue-produccion.md`
- `guia-pruebas-frontend-completo.md`

## Deploy backend - Render

Configuracion recomendada:

- Service: New Web Service
- Root Directory: `backend`
- Runtime: Node
- Build Command: `npm install && npx prisma generate && npx prisma migrate deploy && node prisma/seed.js`
- Start Command: `npm start`
- Health Check Path: `/api/health`

Variables Render:

```env
DATABASE_URL=file:./dev.db
JWT_SECRET=colocar_un_secreto_largo_y_seguro
NODE_ENV=production
CORS_ORIGIN=https://URL_FRONTEND_VERCEL
```

Si necesitas mas de un origen CORS:

```env
CORS_ORIGIN=https://URL_FRONTEND_VERCEL,http://localhost:3000
```

## Deploy frontend - Vercel

Configuracion recomendada:

- Framework: Next.js
- Root Directory: `frontend`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output: default de Vercel para Next.js

Variables Vercel:

```env
NEXT_PUBLIC_API_URL=https://URL_BACKEND_RENDER/api
NEXT_PUBLIC_SITE_URL=https://URL_FRONTEND_VERCEL
```

## URLs finales

- Backend Render: pendiente
- Frontend Vercel: pendiente
- GitHub: pendiente

## Nota sobre SQLite

Este proyecto usa SQLite para fines academicos. En Render, los datos pueden reiniciarse al redeploy si se ejecuta el seed. Para produccion real se recomienda migrar a PostgreSQL.

## Checklist final de entrega

- [ ] Codigo fuente Backend en GitHub.
- [ ] Codigo fuente Frontend en GitHub.
- [ ] URL Backend desplegada.
- [ ] URL Frontend desplegada.
- [ ] Captura landing page.
- [ ] Captura login.
- [ ] Captura dashboard.
- [ ] Captura listado de tickets.
- [ ] Captura creacion de ticket.
- [ ] Captura detalle e historial.
- [ ] Captura asignacion de soporte.
- [ ] Captura cambio de estado.
- [ ] Captura Lighthouse.
- [ ] Credenciales usuario cliente.
- [ ] Credenciales administrador.
- [ ] Documento PDF final.
