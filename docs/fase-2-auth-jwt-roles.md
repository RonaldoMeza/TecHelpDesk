# Fase 2 - Autenticacion, JWT y roles

## Objetivo

Implementar autenticacion y autorizacion para TecHelpDesk usando registro, login, tokens JWT, ruta de perfil autenticado y permisos por roles.

## Requerimientos del laboratorio que cumple

- Registro de usuarios clientes.
- Login con validacion de credenciales.
- Encriptacion de contrasenas con `bcryptjs`.
- Generacion y validacion de JWT con `jsonwebtoken`.
- Middleware de autenticacion por token Bearer.
- Middleware de autorizacion por roles.
- Rutas protegidas para usuarios autenticados.
- Validacion de acceso por roles `ADMIN`, `SOPORTE` y `CLIENTE`.

## Archivos creados

- `backend/src/utils/jwt.js`
- `docs/fase-2-auth-jwt-roles.md`

## Archivos modificados

- `backend/src/controllers/auth.controller.js`
- `backend/src/controllers/user.controller.js`
- `backend/src/middlewares/auth.middleware.js`
- `backend/src/middlewares/role.middleware.js`
- `backend/src/routes/auth.routes.js`
- `backend/src/routes/user.routes.js`
- `backend/src/routes/index.routes.js`

## JWT

JWT permite generar un token firmado para identificar al usuario autenticado sin guardar sesion en el servidor. En esta fase el token incluye `id`, `email` y `role`, usa `JWT_SECRET` desde `.env` y expira en `7d`.

El token se envia en rutas protegidas con el header:

```http
Authorization: Bearer TOKEN
```

## bcrypt

`bcryptjs` se usa para encriptar contrasenas antes de guardarlas en base de datos. En el login se compara la contrasena enviada con el hash almacenado, sin devolver nunca el password en las respuestas.

## Roles

- `ADMIN`: puede listar todos los usuarios y consultar usuarios de soporte.
- `SOPORTE`: puede consultar usuarios de soporte.
- `CLIENTE`: puede autenticarse y consultar su perfil, pero no puede listar usuarios.

El registro publico siempre crea usuarios con rol `CLIENTE`, aunque se envie otro rol en el body.

## Endpoints implementados

- `POST /api/auth/register`: registra un usuario cliente.
- `POST /api/auth/login`: autentica credenciales y devuelve JWT.
- `GET /api/auth/me`: devuelve el usuario autenticado sin password.
- `GET /api/users`: lista usuarios sin password, solo `ADMIN`.
- `GET /api/users/support`: lista usuarios con rol `SOPORTE`, permitido para `ADMIN` y `SOPORTE`.

## Comandos ejecutados

```bash
node prisma/seed.js
npm run dev
```

Tambien se ejecutaron pruebas HTTP equivalentes a Postman desde PowerShell/curl.

## Pruebas realizadas en Postman

### Prueba 1 - Registrar cliente nuevo

- Metodo: `POST`
- URL: `http://localhost:4000/api/auth/register`
- Resultado obtenido: status `201`
- Validacion: devuelve `success: true`, usuario sin password, token y rol `CLIENTE`.

Body:

```json
{
  "name": "Cliente Nuevo",
  "email": "cliente.nuevo2@techelpdesk.com",
  "password": "Cliente123456"
}
```

### Prueba 2 - Login admin

- Metodo: `POST`
- URL: `http://localhost:4000/api/auth/login`
- Resultado obtenido: status `200`
- Validacion: devuelve usuario con rol `ADMIN` y token.

Body:

```json
{
  "email": "admin@techelpdesk.com",
  "password": "Admin123456"
}
```

### Prueba 3 - Obtener perfil autenticado

- Metodo: `GET`
- URL: `http://localhost:4000/api/auth/me`
- Header: `Authorization: Bearer TOKEN_ADMIN`
- Resultado obtenido: status `200`
- Validacion: devuelve datos del admin sin password.

### Prueba 4 - Ruta protegida sin token

- Metodo: `GET`
- URL: `http://localhost:4000/api/auth/me`
- Resultado obtenido: status `401`
- Validacion: devuelve mensaje `Token no proporcionado`.

### Prueba 5 - Listar usuarios como ADMIN

- Metodo: `GET`
- URL: `http://localhost:4000/api/users`
- Header: `Authorization: Bearer TOKEN_ADMIN`
- Resultado obtenido: status `200`
- Validacion: devuelve lista de usuarios sin passwords.

### Prueba 6 - Login cliente

- Metodo: `POST`
- URL: `http://localhost:4000/api/auth/login`
- Resultado obtenido: status `200`
- Validacion: devuelve token de usuario `CLIENTE`.

Body:

```json
{
  "email": "cliente@techelpdesk.com",
  "password": "Cliente123456"
}
```

### Prueba 7 - Intentar listar usuarios como CLIENTE

- Metodo: `GET`
- URL: `http://localhost:4000/api/users`
- Header: `Authorization: Bearer TOKEN_CLIENTE`
- Resultado obtenido: status `403`
- Validacion: devuelve mensaje de permisos insuficientes.

### Prueba 8 - Login con contrasena incorrecta

- Metodo: `POST`
- URL: `http://localhost:4000/api/auth/login`
- Resultado obtenido: status `401`
- Validacion: devuelve mensaje `Credenciales inválidas`.

Body:

```json
{
  "email": "admin@techelpdesk.com",
  "password": "Incorrecta123"
}
```

### Prueba 9 - Ver usuarios de soporte como ADMIN o SOPORTE

- Metodo: `GET`
- URL: `http://localhost:4000/api/users/support`
- Header: `Authorization: Bearer TOKEN_ADMIN` o `Authorization: Bearer TOKEN_SOPORTE`
- Resultado obtenido: status `200`
- Validacion: devuelve usuarios con rol `SOPORTE`.

## Comandos curl.exe para Windows

Login admin:

```bash
curl.exe -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@techelpdesk.com\",\"password\":\"Admin123456\"}"
```

Perfil autenticado:

```bash
curl.exe http://localhost:4000/api/auth/me -H "Authorization: Bearer TOKEN_ADMIN"
```

Listar usuarios como admin:

```bash
curl.exe http://localhost:4000/api/users -H "Authorization: Bearer TOKEN_ADMIN"
```

## Resultados esperados

- Usuarios registrados desde `/register` quedan con rol `CLIENTE`.
- Login exitoso devuelve JWT y usuario sin password.
- Rutas protegidas sin token devuelven `401`.
- Rutas sin permisos devuelven `403`.
- Listado de usuarios no expone contrasenas.

## Problemas encontrados y solucion aplicada

- Durante una prueba automatizada inicial, PowerShell envio mal el JSON a `curl.exe`, generando error de parseo en Express. Se repitieron las pruebas usando `Invoke-WebRequest` con `ConvertTo-Json` y los endpoints respondieron correctamente.
- Se mantuvo Prisma `^6.19.3`; no se actualizo a Prisma 7.
- No se implemento CRUD completo de tickets ni frontend, porque pertenecen a fases posteriores.
