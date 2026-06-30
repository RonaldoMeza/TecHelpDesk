# Guia de pruebas frontend completo - TecHelpDesk

## Objetivo

Validar desde el navegador que el frontend completo de TecHelpDesk funciona correctamente, incluyendo autenticacion, dashboard, tickets, historial, permisos por rol, SEO basico, sitemap, robots y preparacion Lighthouse.

## Preparacion

Abrir dos terminales.

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

URLs principales:

- Backend: `http://localhost:4000/api`
- Frontend: `http://localhost:3000`

Credenciales seed:

- Admin: `admin@techelpdesk.com` / `Admin123456`
- Soporte: `soporte@techelpdesk.com` / `Soporte123456`
- Cliente: `cliente@techelpdesk.com` / `Cliente123456`

## Prueba 1 - Landing page

URL: `http://localhost:3000`

Validar:

- Se muestra TecHelpDesk.
- Hay botones de iniciar sesion y registrarse.
- Se mencionan roles Administrador, Soporte y Cliente.
- En movil no hay elementos cortados.
- No hay errores criticos en consola.

## Prueba 2 - SEO publico

URLs:

- `http://localhost:3000/sitemap.xml`
- `http://localhost:3000/robots.txt`

Validar sitemap:

- Incluye rutas publicas indexables: `/`, `/login` y `/register`.
- No incluye rutas privadas como `/dashboard` o `/tickets`, porque robots las bloquea.

Validar robots:

- Permite `/`.
- Restringe `/dashboard`, `/tickets`, `/tickets/` y `/api`.
- Incluye URL de sitemap.

## Prueba 3 - Login admin

URL: `http://localhost:3000/login`

Credenciales:

- Email: `admin@techelpdesk.com`
- Password: `Admin123456`

Validar:

- Login exitoso.
- Redireccion a `/dashboard`.
- Dashboard muestra nombre, email y rol `ADMIN`.
- Navbar muestra Dashboard, Tickets, Crear ticket y Cerrar sesion.

## Prueba 4 - Dashboard protegido

Acciones:

- Cerrar sesion.
- Abrir `http://localhost:3000/dashboard` sin sesion.

Validar:

- Redireccion a `/login`.
- Token y usuario se eliminan de `localStorage`.

## Prueba 5 - Registro cliente

URL: `http://localhost:3000/register`

Datos sugeridos:

- Nombre: `Cliente Frontend Demo`
- Email: `cliente.frontend.demo@techelpdesk.com`
- Password: `Cliente123456`

Validar:

- Registro correcto.
- Redireccion a dashboard.
- Usuario creado con rol `CLIENTE`.

## Prueba 6 - Cliente crea ticket

Login como Cliente seed.

URL: `http://localhost:3000/tickets/new`

Datos:

- Title: `No puedo acceder al sistema`
- Description: `El sistema no me permite iniciar sesión desde la mañana.`
- Category: `Accesos`
- Priority: `ALTA`

Validar:

- Ticket creado correctamente.
- Redireccion a `/tickets`.
- Ticket visible en listado.

## Prueba 7 - Cliente ve sus tickets

URL: `http://localhost:3000/tickets`

Validar:

- El cliente solo ve tickets propios.
- Las cards muestran titulo, categoria, prioridad, estado, creador, responsable y fecha.
- El diseno es responsive.

## Prueba 8 - Cliente ve detalle e historial

Abrir detalle desde `Ver detalle`.

Validar:

- Se muestra titulo, descripcion, categoria, prioridad, estado, creador, responsable, fechas e historial.
- Cliente no ve acciones de asignar, cambiar estado ni eliminar.
- Si el ticket esta `ABIERTO`, cliente ve opcion de editar.

## Prueba 9 - Cliente agrega comentario

Comentario:

```text
El error continúa al intentar ingresar desde Chrome.
```

Validar:

- Comentario agregado.
- Historial se actualiza.
- Mensaje de exito visible.

## Prueba 10 - Admin ve y asigna tickets

Login como Admin.

URL: `http://localhost:3000/tickets`

Validar:

- Admin ve todos los tickets.
- En detalle, Admin puede asignar soporte.
- Seleccionar soporte `soporte@techelpdesk.com`.
- Ticket queda asignado.
- Historial registra la asignacion.

## Prueba 11 - Soporte cambia estado

Login como Soporte.

Abrir detalle de un ticket.

Cambiar estado:

- Estado: `EN_PROCESO`
- Comentario: `Se inició la revisión del caso.`

Validar:

- Estado actualizado.
- Historial muestra oldStatus y newStatus.
- Soporte no ve boton eliminar.

## Prueba 12 - Edicion de ticket

Validar segun rol:

- Admin puede editar tickets.
- Soporte puede editar tickets.
- Cliente solo ve editar si el ticket esta `ABIERTO`.
- El formulario no permite descripcion menor a 10 caracteres.
- Al guardar, vuelve al detalle.

## Prueba 13 - Admin elimina ticket de prueba

Crear un ticket temporal.

Login como Admin y abrir detalle.

Validar:

- Boton eliminar visible.
- Confirmacion con `window.confirm`.
- Al aceptar, redirecciona a `/tickets`.
- El ticket desaparece del listado.

## Prueba 14 - Accesibilidad y responsive

Validar en DevTools:

- Vista movil: 360px o 390px.
- Navbar no se corta.
- Botones no se salen de pantalla.
- Formularios mantienen labels visibles.
- Mensajes de error son legibles.
- Se puede navegar con tabulador en links y botones principales.
- Link de salto aparece al enfocar con teclado.

## Prueba 15 - Lighthouse

URL recomendada: `http://localhost:3000`

Pasos:

1. Detener `npm run dev` si esta activo.
2. Ejecutar `npm run build`.
3. Ejecutar `npm run start`.
4. Abrir una ventana incognito para evitar que IndexedDB, cache o extensiones afecten Performance.
5. Abrir `http://localhost:3000`.
6. Abrir Chrome DevTools.
7. Ir a Lighthouse.
8. Seleccionar Performance, Accessibility, Best Practices y SEO.
9. Ejecutar en Desktop y Mobile.

Resultado esperado:

- Performance: idealmente `>= 85`.
- Accessibility: idealmente `>= 85`.
- Best Practices: idealmente `>= 85`.
- SEO: idealmente `>= 85`.

Si el puntaje baja:

- Confirmar que no estas auditando `npm run dev`. Si Lighthouse muestra "Minify JavaScript", normalmente estas midiendo modo desarrollo, cache antigua o extensiones.
- Cerrar extensiones del navegador.
- Ejecutar nuevamente en ventana incognito.
- Borrar datos del sitio desde DevTools > Application > Storage > Clear site data.
- Revisar la consola por errores de red.
- Asegurarse de auditar la landing `/`, no rutas privadas como `/dashboard` o `/tickets`, porque esas rutas estan marcadas como no indexables.

## Checklist final

- Landing carga sin errores.
- Login funciona para Admin, Soporte y Cliente.
- Dashboard protegido redirige sin sesion.
- Registro crea cliente.
- Cliente crea y comenta tickets.
- Admin asigna y elimina tickets de prueba.
- Soporte cambia estado.
- Cliente no ve acciones restringidas.
- Sitemap funciona.
- Robots funciona.
- Lighthouse preparado para puntajes mayores o iguales a 85.
