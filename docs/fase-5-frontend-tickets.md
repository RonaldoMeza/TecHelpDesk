# Fase 5 - Frontend del modulo de tickets

## Objetivo

Crear las pantallas frontend para gestionar tickets en TecHelpDesk, integradas con los endpoints backend ya implementados y protegidas con JWT almacenado en `localStorage`.

## Requerimientos del laboratorio que cumple

- Listado frontend de tickets.
- Creacion de tickets desde formulario.
- Detalle de ticket con informacion completa e historial.
- Edicion de datos generales del ticket.
- Comentarios en historial.
- Cambio de estado para `ADMIN` y `SOPORTE`.
- Asignacion de responsable para `ADMIN` y autoasignacion para `SOPORTE`.
- Eliminacion visual para `ADMIN`.
- Reglas visuales por rol.
- Manejo de loading, errores, permisos y token invalido.

## Rutas frontend implementadas

- `/tickets`: listado de tickets.
- `/tickets/new`: formulario de creacion.
- `/tickets/[id]`: detalle, historial y acciones.
- `/tickets/[id]/edit`: edicion de datos generales.

## Endpoints backend consumidos

- `GET /api/tickets`
- `GET /api/tickets/:id`
- `POST /api/tickets`
- `PUT /api/tickets/:id`
- `PATCH /api/tickets/:id/assign`
- `PATCH /api/tickets/:id/status`
- `POST /api/tickets/:id/histories`
- `GET /api/tickets/:id/histories`
- `DELETE /api/tickets/:id`
- `GET /api/users/support`

## Componentes creados

- `TicketCard.jsx`: card responsive para tickets.
- `TicketForm.jsx`: formulario reutilizable para crear y editar.
- `TicketStatusBadge.jsx`: badge visual de estado.
- `TicketPriorityBadge.jsx`: badge visual de prioridad.
- `TicketHistoryList.jsx`: lista de historial ordenada visualmente.
- `TicketActions.jsx`: acciones por rol para editar, asignar, cambiar estado y eliminar.

## Archivos creados

- `frontend/src/lib/tickets.js`
- `frontend/src/components/tickets/TicketCard.jsx`
- `frontend/src/components/tickets/TicketForm.jsx`
- `frontend/src/components/tickets/TicketStatusBadge.jsx`
- `frontend/src/components/tickets/TicketPriorityBadge.jsx`
- `frontend/src/components/tickets/TicketHistoryList.jsx`
- `frontend/src/components/tickets/TicketActions.jsx`
- `frontend/src/app/tickets/page.jsx`
- `frontend/src/app/tickets/new/page.jsx`
- `frontend/src/app/tickets/[id]/page.jsx`
- `frontend/src/app/tickets/[id]/edit/page.jsx`
- `docs/fase-5-frontend-tickets.md`

## Archivos modificados

- `frontend/src/lib/api.js`
- `frontend/src/components/Navbar.jsx`
- `frontend/src/app/dashboard/page.jsx`

## Reglas visuales por rol

- `ADMIN`: ve acciones de editar, asignar responsable, cambiar estado, eliminar y comentar.
- `SOPORTE`: ve editar, autoasignarse si el ticket no tiene responsable, cambiar estado y comentar. No ve eliminar.
- `CLIENTE`: ve editar solo si el ticket esta `ABIERTO` y puede comentar. No ve asignar, cambiar estado ni eliminar.

## Validaciones frontend

- Crear y editar ticket requieren `title`, `description`, `category` y `priority`.
- La descripcion debe tener minimo 10 caracteres.
- Comentarios de historial requieren minimo 3 caracteres.
- Al asignar como admin se exige seleccionar usuario soporte.
- Si el backend responde `401`, se borra sesion y se redirige a `/login`.

## Comandos ejecutados

```bash
npm run lint
npm run build
npx -y react-doctor@latest . --verbose --scope changed
```

## Pruebas manuales realizadas

Las pruebas funcionales completas se realizaran manualmente en navegador con backend y frontend levantados:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## Resultados esperados

- Login cliente permite entrar al dashboard.
- Cliente crea ticket desde `/tickets/new` y lo ve en `/tickets`.
- Cliente ve detalle e historial de sus tickets.
- Cliente puede agregar comentarios.
- Admin ve todos los tickets y puede asignar soporte.
- Soporte ve tickets y puede cambiar estado.
- Cliente no ve acciones restringidas.
- Admin puede eliminar un ticket de prueba.

## Problemas encontrados y solucion aplicada

- El frontend fue movido a `src/app`, `src/components` y `src/lib` para continuar con la estructura solicitada del laboratorio.
- Se agrego `status` a los errores de `apiFetch` para manejar token invalido y redireccion a `/login`.
- `npm run lint` y `npm run build` se ejecutaron correctamente.
- React Doctor marco advertencias por redireccion cliente con `localStorage`, aceptadas para esta fase porque la proteccion solicitada es del lado cliente.
- No se modifico backend ni Prisma.
