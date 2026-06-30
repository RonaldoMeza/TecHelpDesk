# Fase 3 - Tickets e historial de atencion

## Objetivo

Implementar el backend del modulo de tickets para TecHelpDesk, incluyendo CRUD, asignacion de responsable, cambio de estado e historial de atencion con autenticacion JWT y permisos por roles.

## Requerimientos del laboratorio que cumple

- CRUD backend de tickets.
- Seguridad por JWT en todas las rutas de tickets.
- Autorizacion por roles `ADMIN`, `SOPORTE` y `CLIENTE`.
- Historial automatico de creacion, asignacion, cambio de estado y comentarios.
- Uso de transacciones Prisma en operaciones que afectan ticket e historial.
- Respuestas JSON claras para errores de validacion, permisos y recursos no encontrados.

## Reglas por rol

- `ADMIN`: puede ver todos los tickets, ver cualquier detalle, crear, actualizar, asignar responsable, cambiar estado, agregar historial y eliminar tickets.
- `SOPORTE`: puede ver todos los tickets, ver cualquier detalle, actualizar informacion operativa, cambiar estado, agregar historial y asignarse tickets sin responsable. No puede eliminar tickets.
- `CLIENTE`: puede crear tickets, ver solo sus tickets, ver detalle de sus tickets, actualizar sus tickets solo si estan `ABIERTO` y agregar comentarios a sus tickets. No puede asignar responsables, cambiar estado ni eliminar tickets.

## Endpoints implementados

- `GET /api/tickets`: lista tickets segun rol.
- `GET /api/tickets/:id`: obtiene detalle con creador, responsable e historial.
- `POST /api/tickets`: crea ticket con estado inicial `ABIERTO`.
- `PUT /api/tickets/:id`: actualiza `title`, `description`, `category` y `priority`.
- `PATCH /api/tickets/:id/assign`: asigna responsable soporte.
- `PATCH /api/tickets/:id/status`: cambia estado del ticket.
- `POST /api/tickets/:id/histories`: agrega comentario al historial.
- `GET /api/tickets/:id/histories`: lista historial del ticket.
- `DELETE /api/tickets/:id`: elimina ticket e historiales, solo `ADMIN`.

## Archivos creados

- `docs/fase-3-tickets-historial.md`

## Archivos modificados

- `backend/src/controllers/ticket.controller.js`
- `backend/src/routes/ticket.routes.js`
- `backend/src/routes/index.routes.js`
- `backend/prisma/seed.js`

## Validaciones aplicadas

- `title`, `description` y `category` son obligatorios al crear ticket.
- `priority` es opcional y por defecto usa `MEDIA`.
- `priority` debe ser `BAJA`, `MEDIA`, `ALTA` o `URGENTE`.
- En actualizacion general no se permite modificar `status` ni `assigneeId`.
- Los campos enviados para actualizar no pueden estar vacios.
- `CLIENTE` solo actualiza tickets propios si estan `ABIERTO`.
- `assigneeId` es obligatorio para asignar.
- El responsable debe existir y tener rol `SOPORTE`.
- `SOPORTE` solo puede asignarse tickets a si mismo si no tienen responsable.
- `status` es obligatorio y debe ser valido.
- `comment` en historial debe tener al menos 3 caracteres.
- `CLIENTE` solo puede ver o comentar tickets propios.

## Historial automatico

Se crea `TicketHistory` automaticamente en estos casos:

- Creacion de ticket: `Ticket creado por el usuario.`, `oldStatus: null`, `newStatus: ABIERTO`.
- Asignacion de responsable: `Ticket asignado a soporte.`.
- Cambio de estado: comentario enviado o automatico, con `oldStatus` y `newStatus`.
- Comentario manual: comentario enviado, sin cambio de estado.

## Comandos ejecutados

```bash
node --check src/controllers/ticket.controller.js
node --check src/routes/ticket.routes.js
node prisma/seed.js
```

## Pruebas Postman

Antes de probar tickets, obtener tokens con:

- `POST http://localhost:4000/api/auth/login` como `ADMIN`.
- `POST http://localhost:4000/api/auth/login` como `SOPORTE`.
- `POST http://localhost:4000/api/auth/login` como `CLIENTE`.

### Prueba 1 - Crear ticket como CLIENTE

- Metodo: `POST`
- URL: `http://localhost:4000/api/tickets`
- Header: `Authorization: Bearer TOKEN_CLIENTE`
- Resultado esperado: status `201`, ticket con `status: ABIERTO`, creador cliente e historial automatico.

### Prueba 2 - Listar tickets como CLIENTE

- Metodo: `GET`
- URL: `http://localhost:4000/api/tickets`
- Header: `Authorization: Bearer TOKEN_CLIENTE`
- Resultado esperado: status `200`, solo tickets creados por ese cliente.

### Prueba 3 - Listar tickets como ADMIN

- Metodo: `GET`
- URL: `http://localhost:4000/api/tickets`
- Header: `Authorization: Bearer TOKEN_ADMIN`
- Resultado esperado: status `200`, todos los tickets.

### Prueba 4 - Ver detalle de ticket como ADMIN

- Metodo: `GET`
- URL: `http://localhost:4000/api/tickets/ID_TICKET`
- Header: `Authorization: Bearer TOKEN_ADMIN`
- Resultado esperado: status `200`, detalle con `creator`, `assignee` e `histories`.

### Prueba 5 - Asignar ticket a soporte como ADMIN

- Metodo: `PATCH`
- URL: `http://localhost:4000/api/tickets/ID_TICKET/assign`
- Header: `Authorization: Bearer TOKEN_ADMIN`
- Resultado esperado: status `200`, ticket asignado e historial creado.

Body:

```json
{
  "assigneeId": 2
}
```

### Prueba 6 - Cambiar estado como SOPORTE

- Metodo: `PATCH`
- URL: `http://localhost:4000/api/tickets/ID_TICKET/status`
- Header: `Authorization: Bearer TOKEN_SOPORTE`
- Resultado esperado: status `200`, estado cambiado e historial con `oldStatus` y `newStatus`.

Body:

```json
{
  "status": "EN_PROCESO",
  "comment": "Se inició la revisión del incidente reportado."
}
```

### Prueba 7 - Agregar comentario al historial como CLIENTE

- Metodo: `POST`
- URL: `http://localhost:4000/api/tickets/ID_TICKET/histories`
- Header: `Authorization: Bearer TOKEN_CLIENTE`
- Resultado esperado: status `201` si el ticket pertenece al cliente.

### Prueba 8 - Ver historial del ticket

- Metodo: `GET`
- URL: `http://localhost:4000/api/tickets/ID_TICKET/histories`
- Header: `Authorization: Bearer TOKEN_ADMIN`
- Resultado esperado: status `200`, historial ordenado ascendentemente por fecha.

### Prueba 9 - Cliente intenta cambiar estado

- Metodo: `PATCH`
- URL: `http://localhost:4000/api/tickets/ID_TICKET/status`
- Header: `Authorization: Bearer TOKEN_CLIENTE`
- Resultado esperado: status `403`.

### Prueba 10 - Cliente intenta asignar responsable

- Metodo: `PATCH`
- URL: `http://localhost:4000/api/tickets/ID_TICKET/assign`
- Header: `Authorization: Bearer TOKEN_CLIENTE`
- Resultado esperado: status `403`.

### Prueba 11 - Actualizar ticket como CLIENTE cuando esta ABIERTO

- Metodo: `PUT`
- URL: `http://localhost:4000/api/tickets/ID_TICKET_ABIERTO`
- Header: `Authorization: Bearer TOKEN_CLIENTE`
- Resultado esperado: status `200` si el ticket esta `ABIERTO` y pertenece al cliente.

### Prueba 12 - Eliminar ticket como SOPORTE

- Metodo: `DELETE`
- URL: `http://localhost:4000/api/tickets/ID_TICKET`
- Header: `Authorization: Bearer TOKEN_SOPORTE`
- Resultado esperado: status `403`.

### Prueba 13 - Eliminar ticket como ADMIN

- Metodo: `DELETE`
- URL: `http://localhost:4000/api/tickets/ID_TICKET`
- Header: `Authorization: Bearer TOKEN_ADMIN`
- Resultado esperado: status `200`, elimina historiales y ticket.

Usar un ticket de prueba para eliminar, no uno principal del seed.

## Comandos curl.exe para Windows

Login admin:

```bash
curl.exe -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@techelpdesk.com\",\"password\":\"Admin123456\"}"
```

Crear ticket:

```bash
curl.exe -X POST http://localhost:4000/api/tickets -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN_CLIENTE" -d "{\"title\":\"No puedo acceder al sistema\",\"description\":\"El sistema no permite iniciar sesión.\",\"category\":\"Accesos\",\"priority\":\"ALTA\"}"
```

Listar tickets:

```bash
curl.exe http://localhost:4000/api/tickets -H "Authorization: Bearer TOKEN_ADMIN"
```

Cambiar estado:

```bash
curl.exe -X PATCH http://localhost:4000/api/tickets/1/status -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN_SOPORTE" -d "{\"status\":\"EN_PROCESO\",\"comment\":\"Se inició la revisión del caso.\"}"
```

## Resultados esperados

- Las rutas de tickets requieren JWT.
- `ADMIN` puede administrar todos los tickets.
- `SOPORTE` puede operar tickets pero no eliminarlos.
- `CLIENTE` solo opera sobre tickets propios y con permisos limitados.
- Ninguna relacion de usuario devuelve `password`.
- `GET /api/db-check` sigue devolviendo `users`, `tickets` e `histories`.

## Problemas encontrados y solucion aplicada

- Los archivos de tickets existian pero estaban vacios. Se implementaron controller y rutas.
- Como SQLite no reiniciaba IDs al ejecutar el seed varias veces, se agrego limpieza de `sqlite_sequence` en `prisma/seed.js`. Esto permite que los usuarios seed vuelvan a quedar como Admin `1`, Soporte `2` y Cliente `3`, facilitando las pruebas con `assigneeId: 2`.
- No se cambio la autenticacion validada en Fase 2.
- No se actualizo Prisma; se mantiene Prisma 6.
