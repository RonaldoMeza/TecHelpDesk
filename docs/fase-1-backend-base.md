# Fase 1 - Backend base y base de datos

## Objetivo

Construir la base inicial del backend para TecHelpDesk, dejando configurados Express, Prisma, SQLite, rutas base, manejo de errores, modelos principales y datos iniciales de prueba.

## Modulo elegido

Modulo 2 - Sistema de Mesa de Ayuda (Help Desk).

## Arquitectura inicial del backend

- `src/app.js`: configuracion principal de Express, CORS, JSON, rutas `/api` y middlewares.
- `src/server.js`: inicio del servidor HTTP y cierre ordenado de Prisma.
- `src/config/prisma.js`: instancia unica reutilizable de `PrismaClient`.
- `src/routes/index.routes.js`: endpoints base `GET /api/health` y `GET /api/db-check`.
- `src/middlewares/not-found.middleware.js`: respuesta controlada para rutas inexistentes.
- `src/middlewares/error.middleware.js`: manejo centralizado de errores.
- `prisma/schema.prisma`: modelos, enums y datasource SQLite.
- `prisma/seed.js`: datos iniciales para usuarios, tickets e historial.

## Entidades creadas

- `User`: usuarios del sistema.
- `Ticket`: incidencias registradas.
- `TicketHistory`: historial de cambios y comentarios de tickets.

## Roles definidos

- `ADMIN`
- `SOPORTE`
- `CLIENTE`

## Estados y prioridades

Estados de tickets:

- `ABIERTO`
- `EN_PROCESO`
- `RESUELTO`
- `CERRADO`

Prioridades:

- `BAJA`
- `MEDIA`
- `ALTA`
- `URGENTE`

## Archivos creados o modificados

- `backend/src/app.js`
- `backend/src/server.js`
- `backend/src/config/prisma.js`
- `backend/src/routes/index.routes.js`
- `backend/src/middlewares/error.middleware.js`
- `backend/src/middlewares/not-found.middleware.js`
- `backend/prisma/schema.prisma`
- `backend/prisma/seed.js`
- `backend/.env`
- `backend/package.json`
- `docs/fase-1-backend-base.md`

## Comandos ejecutados

```bash
npm install
node prisma/seed.js
npm run dev
```

La migracion `init_helpdesk` ya existia en `prisma/migrations/20260630142124_init_helpdesk`, por lo que no se genero una migracion nueva.

## Credenciales seed

- Admin: `admin@techelpdesk.com` / `Admin123456`
- Soporte: `soporte@techelpdesk.com` / `Soporte123456`
- Cliente: `cliente@techelpdesk.com` / `Cliente123456`

Las contrasenas se almacenan encriptadas con `bcryptjs`.

## Pruebas realizadas

### Prueba 1

- Metodo: `GET`
- URL: `http://localhost:4000/api/health`
- Resultado obtenido: status `200`

Respuesta esperada similar a:

```json
{
  "success": true,
  "message": "TecHelpDesk API funcionando correctamente",
  "timestamp": "...",
  "environment": "development"
}
```

### Prueba 2

- Metodo: `GET`
- URL: `http://localhost:4000/api/db-check`
- Resultado obtenido: status `200`

Respuesta esperada similar a:

```json
{
  "success": true,
  "message": "Conexion a base de datos correcta",
  "data": {
    "users": 3,
    "tickets": 3,
    "histories": 3
  }
}
```

### Prueba 3

- Metodo: `GET`
- URL: `http://localhost:4000/api/ruta-inexistente`
- Resultado obtenido: status `404`

Respuesta esperada similar a:

```json
{
  "success": false,
  "message": "Ruta no encontrada: /api/ruta-inexistente"
}
```

## Resultado esperado

El backend debe iniciar en `http://localhost:4000`, responder correctamente los endpoints base y confirmar conexion con SQLite mediante Prisma.

## Problemas encontrados y solucion aplicada

- Algunos archivos base existian pero estaban vacios. Se completaron con la configuracion minima requerida para esta fase.
- La migracion inicial ya existia. No se creo otra migracion para evitar duplicidad.
- Se mantiene Prisma 6 (`prisma` y `@prisma/client` en version `^6.19.3`) para evitar el error reportado con Prisma 7 relacionado con la configuracion del datasource `url`.
