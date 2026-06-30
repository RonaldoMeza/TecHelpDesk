# Fase 7 - Preparacion de despliegue y produccion

## Objetivo

Preparar TecHelpDesk para despliegue academico en Render y Vercel, configurar variables de entorno, validar comandos finales y documentar el proceso completo de entrega.

## Requerimientos del laboratorio que cumple

- Preparacion de backend para deploy.
- Preparacion de frontend para deploy.
- Variables de entorno documentadas.
- README raiz del proyecto.
- `.gitignore` raiz.
- `.env.example` para backend y frontend.
- Scripts de produccion para Prisma 6.
- Documentacion de Render y Vercel.
- Checklist final de entrega.

## Archivos creados

- `.gitignore`
- `README.md`
- `backend/.env.example`
- `frontend/.env.example`
- `docs/fase-7-despliegue-produccion.md`

## Archivos modificados

- `backend/src/app.js`
- `backend/package.json`
- `backend/package-lock.json`

## Preparacion GitHub

Desde la raiz `TecHelpDesk`:

```bash
git init
git add .
git commit -m "Proyecto final TecHelpDesk"
git branch -M main
git remote add origin URL_DEL_REPOSITORIO_GITHUB
git push -u origin main
```

No ejecutar `git remote add origin` ni `git push` hasta tener la URL real del repositorio GitHub.

## .gitignore raiz

Se excluyen:

- `node_modules`
- `.env`
- `.env.local`
- `.env.production`
- `.DS_Store`
- `.next`
- `dist`
- `build`
- `coverage`
- `*.log`
- `backend/prisma/dev.db`
- `backend/prisma/dev.db-journal`

No se excluyen:

- `backend/prisma/schema.prisma`
- `backend/prisma/migrations`
- `docs`
- `README.md`

## Configuracion backend Render

Servicio:

- New Web Service

Root Directory:

```text
backend
```

Runtime:

```text
Node
```

Build Command:

```bash
npm install && npx prisma generate && npx prisma migrate deploy && node prisma/seed.js
```

Start Command:

```bash
npm start
```

Health Check Path:

```text
/api/health
```

Variables de entorno en Render:

```env
DATABASE_URL=file:./dev.db
JWT_SECRET=colocar_un_secreto_largo_y_seguro
NODE_ENV=production
CORS_ORIGIN=https://URL_FRONTEND_VERCEL
```

Si necesitas permitir varias URLs en CORS:

```env
CORS_ORIGIN=https://URL_FRONTEND_VERCEL,http://localhost:3000
```

## Nota SQLite academico

Este proyecto usa SQLite para simplificar el laboratorio. En Render, los datos pueden reiniciarse al redeploy si se ejecuta `node prisma/seed.js` en el build.

Esto es aceptable para demo academica porque deja usuarios, tickets e historiales iniciales listos. Para produccion real se recomienda migrar a PostgreSQL.

## Seed de produccion

El seed puede ejecutarse varias veces porque elimina datos de demo, reinicia secuencias SQLite y vuelve a crear:

- Admin: `admin@techelpdesk.com` / `Admin123456`
- Soporte: `soporte@techelpdesk.com` / `Soporte123456`
- Cliente: `cliente@techelpdesk.com` / `Cliente123456`

Tambien crea tickets e historiales iniciales.

## Configuracion frontend Vercel

Framework:

```text
Next.js
```

Root Directory:

```text
frontend
```

Install Command:

```bash
npm install
```

Build Command:

```bash
npm run build
```

Output:

```text
Default de Vercel para Next.js
```

Variables de entorno en Vercel:

```env
NEXT_PUBLIC_API_URL=https://URL_BACKEND_RENDER/api
NEXT_PUBLIC_SITE_URL=https://URL_FRONTEND_VERCEL
```

## Sitemap y robots

- `frontend/src/app/sitemap.js` usa `NEXT_PUBLIC_SITE_URL`.
- `frontend/src/app/robots.js` usa `NEXT_PUBLIC_SITE_URL`.
- En local usa `http://localhost:3000`.
- En produccion debe usar la URL real de Vercel.

## Variables de entorno locales

Backend `backend/.env.example`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="cambiar_este_secreto_en_produccion"
PORT=4000
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
```

Frontend `frontend/.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Comandos ejecutados

Backend:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
node prisma/seed.js
npm run start
```

Frontend:

```bash
npm install
npm run lint
npm run build
```

## Pruebas locales antes de deploy

Backend:

- `GET http://localhost:4000/api/health`
- `GET http://localhost:4000/api/db-check`

Resultado local obtenido:

- `/api/health`: status `200`.
- `/api/db-check`: status `200`.

Frontend:

- `http://localhost:3000`
- `http://localhost:3000/login`
- `http://localhost:3000/dashboard`
- `http://localhost:3000/tickets`
- `http://localhost:3000/sitemap.xml`
- `http://localhost:3000/robots.txt`

Resultado local obtenido con build de produccion en puerto temporal:

- `/`: status `200`.
- `/login`: status `200`.
- `/dashboard`: status `200`.
- `/tickets`: status `200`.
- `/sitemap.xml`: status `200`.
- `/robots.txt`: status `200`.

## Pruebas backend en produccion

Health:

```http
GET https://URL_BACKEND_RENDER/api/health
```

Resultado esperado: `success: true`.

DB check:

```http
GET https://URL_BACKEND_RENDER/api/db-check
```

Resultado esperado: conteos de `users`, `tickets` e `histories`.

Login admin:

```http
POST https://URL_BACKEND_RENDER/api/auth/login
```

Body:

```json
{
  "email": "admin@techelpdesk.com",
  "password": "Admin123456"
}
```

Resultado esperado: token JWT y usuario `ADMIN`.

Tickets:

```http
GET https://URL_BACKEND_RENDER/api/tickets
Authorization: Bearer TOKEN_ADMIN
```

Resultado esperado: lista de tickets.

## Pruebas frontend en produccion

- Abrir landing.
- Login admin.
- Login cliente.
- Ver dashboard.
- Crear ticket como cliente.
- Ver tickets.
- Ver detalle.
- Asignar soporte como admin.
- Cambiar estado como soporte.
- Revisar `/sitemap.xml`.
- Revisar `/robots.txt`.
- Ejecutar Lighthouse.

## Capturas recomendadas para PDF final

1. Render backend funcionando.
2. Endpoint `/api/health`.
3. Vercel frontend funcionando.
4. Landing page.
5. Login.
6. Dashboard.
7. Listado de tickets.
8. Crear ticket.
9. Detalle con historial.
10. Asignar soporte.
11. Cambiar estado.
12. Lighthouse.
13. Repositorio GitHub.

## URLs finales

- Backend Render: pendiente
- Frontend Vercel: pendiente
- GitHub: pendiente

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

## Problemas encontrados y solucion aplicada

- Faltaba `.gitignore` raiz. Se creo uno para evitar subir `node_modules`, `.env`, builds y base SQLite local.
- Faltaban `.env.example`. Se agregaron para backend y frontend.
- CORS estaba abierto con configuracion por defecto. Se ajusto para usar `CORS_ORIGIN`, soportando multiples URLs separadas por coma.
- Faltaban scripts `prisma:deploy` y `prisma:generate`. Se agregaron sin actualizar Prisma 6.
- Faltaba README raiz. Se creo con instalacion, comandos, variables, credenciales y despliegue.
- `npm install` del frontend reporto 2 vulnerabilidades moderadas en dependencias transitivas. No se ejecuto `npm audit fix --force` porque puede introducir cambios mayores; queda como riesgo residual para revisar despues del laboratorio.
