require('dotenv').config();

const bcrypt = require('bcryptjs');
const prisma = require('../src/config/prisma');

async function main() {
    const [adminPassword, soportePassword, clientePassword] = await Promise.all([
        bcrypt.hash('Admin123456', 10),
        bcrypt.hash('Soporte123456', 10),
        bcrypt.hash('Cliente123456', 10),
    ]);

  await prisma.ticketHistory.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$executeRawUnsafe('DELETE FROM sqlite_sequence WHERE name IN ("User", "Ticket", "TicketHistory")');

  const admin = await prisma.user.create({
        data: {
            name: 'Administrador TecHelpDesk',
            email: 'admin@techelpdesk.com',
            password: adminPassword,
            role: 'ADMIN',
        },
    });

    const soporte = await prisma.user.create({
        data: {
            name: 'Soporte TecHelpDesk',
            email: 'soporte@techelpdesk.com',
            password: soportePassword,
            role: 'SOPORTE',
        },
    });

    const cliente = await prisma.user.create({
        data: {
            name: 'Cliente Demo',
            email: 'cliente@techelpdesk.com',
            password: clientePassword,
            role: 'CLIENTE',
        },
    });

    const ticket1 = await prisma.ticket.create({
        data: {
            title: 'No puedo acceder al sistema',
            description: 'El usuario cliente reporta que no puede iniciar sesión en la plataforma.',
            category: 'Accesos',
            priority: 'ALTA',
            status: 'ABIERTO',
            creatorId: cliente.id,
            assigneeId: soporte.id,
        },
    });

    const ticket2 = await prisma.ticket.create({
        data: {
            title: 'Error al generar reporte',
            description: 'El reporte mensual no se descarga correctamente desde el panel administrativo.',
            category: 'Reportes',
            priority: 'MEDIA',
            status: 'EN_PROCESO',
            creatorId: admin.id,
            assigneeId: soporte.id,
        },
    });

    const ticket3 = await prisma.ticket.create({
        data: {
            title: 'Solicitud de actualización de datos',
            description: 'El cliente solicita corregir datos de contacto registrados en el sistema.',
            category: 'Datos de usuario',
            priority: 'BAJA',
            status: 'RESUELTO',
            creatorId: cliente.id,
            assigneeId: soporte.id,
        },
    });

    await prisma.ticketHistory.createMany({
        data: [
            {
                ticketId: ticket1.id,
                userId: cliente.id,
                comment: 'Ticket creado por el cliente.',
                oldStatus: null,
                newStatus: 'ABIERTO',
            },
            {
                ticketId: ticket2.id,
                userId: soporte.id,
                comment: 'El equipo de soporte inició la revisión del reporte.',
                oldStatus: 'ABIERTO',
                newStatus: 'EN_PROCESO',
            },
            {
                ticketId: ticket3.id,
                userId: soporte.id,
                comment: 'Los datos fueron actualizados y la solicitud quedó resuelta.',
                oldStatus: 'EN_PROCESO',
                newStatus: 'RESUELTO',
            },
        ],
    });

    console.log('Seed inicial ejecutado correctamente.');
}

main()
    .catch((error) => {
        console.error('Error ejecutando seed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
