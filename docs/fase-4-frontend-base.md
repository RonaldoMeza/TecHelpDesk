# Fase 4 - Frontend base

## Objetivo

Crear la base visual y funcional del frontend de TecHelpDesk con Next.js App Router, Tailwind CSS, login, registro, perfil autenticado y dashboard protegido conectado al backend.

## Requerimientos del laboratorio que cumple

- Frontend base con Next.js App Router.
- Landing page responsive.
- Login conectado a `POST /api/auth/login`.
- Registro conectado a `POST /api/auth/register`.
- Dashboard protegido conectado a `GET /api/auth/me`.
- Manejo de token JWT en `localStorage`.
- Helper centralizado para consumo de API con `fetch` nativo.
- Navegacion base con estado de sesion.
- Diseno responsive con Tailwind CSS.
- SEO basico con metadata en layout.

## Archivos creados

- `frontend/src/lib/api.js`
- `frontend/src/lib/auth.js`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/ProtectedRoute.jsx`
- `frontend/src/components/StatCard.jsx`
- `frontend/src/app/page.jsx`
- `frontend/src/app/login/page.jsx`
- `frontend/src/app/register/page.jsx`
- `frontend/src/app/dashboard/page.jsx`
- `docs/fase-4-frontend-base.md`

## Archivos modificados

- `frontend/.env.local`
- `frontend/src/app/layout.tsx`
- `frontend/src/app/globals.css`

## Rutas frontend implementadas

- `/`: landing page de TecHelpDesk.
- `/login`: formulario de inicio de sesion.
- `/register`: formulario de registro de clientes.
- `/dashboard`: panel protegido con perfil autenticado.

## Endpoints backend consumidos

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`

## Variables de entorno

Archivo: `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Comandos ejecutados

```bash
npm run lint
npm run build
npx -y react-doctor@latest . --verbose --diff
npx -y react-doctor@latest . --verbose --scope changed
```

## Pruebas manuales

### Prueba 1 - Landing page

- URL: `http://localhost:3000`
- Resultado esperado: muestra landing page de TecHelpDesk con botones de login y registro.

### Prueba 2 - Login admin

- URL: `http://localhost:3000/login`
- Credenciales: `admin@techelpdesk.com` / `Admin123456`
- Resultado esperado: login correcto y redireccion a `/dashboard`.

### Prueba 3 - Dashboard autenticado

- URL: `http://localhost:3000/dashboard`
- Resultado esperado: muestra nombre, email y rol del usuario autenticado.

### Prueba 4 - Cerrar sesion

- Accion: presionar `Cerrar sesión`.
- Resultado esperado: borra token y usuario de `localStorage` y redirige a `/login`.

### Prueba 5 - Dashboard sin sesion

- URL: `http://localhost:3000/dashboard` sin token.
- Resultado esperado: redireccion a `/login`.

### Prueba 6 - Registro cliente

- URL: `http://localhost:3000/register`
- Resultado esperado: crea usuario con rol `CLIENTE`, guarda sesion y redirige a `/dashboard`.

## Resultados esperados

- El frontend inicia con `npm run dev` en `http://localhost:3000`.
- Login y registro guardan `token` y `user` en `localStorage`.
- Dashboard protegido valida sesion local y perfil contra backend.
- Navbar muestra opciones segun exista o no sesion.
- No se implementa CRUD visual de tickets en esta fase.

## Problemas encontrados y solucion aplicada

- El frontend fue organizado bajo `src/app`, `src/components` y `src/lib` para alinearse con la estructura solicitada del laboratorio.
- `.env.local` existia pero estaba vacio. Se agrego `NEXT_PUBLIC_API_URL=http://localhost:4000/api`.
- `npm run lint` detecto estados derivados desde `useEffect`; se corrigio usando `useSyncExternalStore` para leer sesion desde `localStorage`.
- React Doctor mantiene advertencias por redireccion cliente en rutas protegidas. Se acepta en esta fase porque la proteccion solicitada usa `localStorage` del lado cliente.
- No se modifico backend, Prisma ni rutas existentes.
