const prisma = require('../config/prisma');

const VALID_PRIORITIES = ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'];
const VALID_STATUSES = ['ABIERTO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
};

const ticketInclude = {
  creator: { select: userSelect },
  assignee: { select: userSelect },
};

const ticketDetailInclude = {
  ...ticketInclude,
  histories: {
    include: {
      user: { select: userSelect },
    },
    orderBy: { createdAt: 'asc' },
  },
};

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parseTicketId(req) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw createError('ID de ticket inválido', 400);
  }

  return id;
}

function validateNotEmpty(value, fieldName) {
  if (value !== undefined && String(value).trim() === '') {
    throw createError(`El campo ${fieldName} no puede estar vacío`, 400);
  }
}

async function findTicketOrFail(id, include = ticketInclude) {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include,
  });

  if (!ticket) {
    throw createError('Ticket no encontrado', 404);
  }

  return ticket;
}

function ensureClientOwnsTicket(user, ticket) {
  if (user.role === 'CLIENTE' && ticket.creatorId !== user.id) {
    throw createError('No tienes permisos para acceder a este ticket', 403);
  }
}

function sortTicketsForSupport(tickets, supportId) {
  return tickets.sort((a, b) => {
    const aAssigned = a.assigneeId === supportId ? 0 : 1;
    const bAssigned = b.assigneeId === supportId ? 0 : 1;

    if (aAssigned !== bAssigned) return aAssigned - bAssigned;

    const aOpen = a.status === 'ABIERTO' ? 0 : 1;
    const bOpen = b.status === 'ABIERTO' ? 0 : 1;

    if (aOpen !== bOpen) return aOpen - bOpen;

    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

async function getTickets(req, res, next) {
  try {
    let tickets;

    if (req.user.role === 'CLIENTE') {
      tickets = await prisma.ticket.findMany({
        where: { creatorId: req.user.id },
        include: ticketInclude,
        orderBy: { createdAt: 'desc' },
      });
    } else {
      tickets = await prisma.ticket.findMany({
        include: ticketInclude,
        orderBy: { createdAt: 'desc' },
      });

      if (req.user.role === 'SOPORTE') {
        tickets = sortTicketsForSupport(tickets, req.user.id);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Tickets obtenidos correctamente',
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
}

async function getTicketById(req, res, next) {
  try {
    const id = parseTicketId(req);
    const ticket = await findTicketOrFail(id, ticketDetailInclude);

    ensureClientOwnsTicket(req.user, ticket);

    res.status(200).json({
      success: true,
      message: 'Ticket obtenido correctamente',
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
}

async function createTicket(req, res, next) {
  try {
    const { title, description, category, priority = 'MEDIA' } = req.body;

    if (!title || !description || !category) {
      throw createError('Título, descripción y categoría son obligatorios', 400);
    }

    validateNotEmpty(title, 'title');
    validateNotEmpty(description, 'description');
    validateNotEmpty(category, 'category');

    if (!VALID_PRIORITIES.includes(priority)) {
      throw createError('Prioridad inválida', 400);
    }

    const ticket = await prisma.$transaction(async (tx) => {
      const createdTicket = await tx.ticket.create({
        data: {
          title,
          description,
          category,
          priority,
          status: 'ABIERTO',
          creatorId: req.user.id,
        },
      });

      await tx.ticketHistory.create({
        data: {
          ticketId: createdTicket.id,
          userId: req.user.id,
          comment: 'Ticket creado por el usuario.',
          oldStatus: null,
          newStatus: 'ABIERTO',
        },
      });

      return tx.ticket.findUnique({
        where: { id: createdTicket.id },
        include: ticketDetailInclude,
      });
    });

    res.status(201).json({
      success: true,
      message: 'Ticket creado correctamente',
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
}

async function updateTicket(req, res, next) {
  try {
    const id = parseTicketId(req);
    const { title, description, category, priority, status, assigneeId } = req.body;

    if (status !== undefined || assigneeId !== undefined) {
      throw createError('No se puede cambiar status ni assigneeId desde esta ruta', 400);
    }

    const data = {};

    for (const field of ['title', 'description', 'category']) {
      if (req.body[field] !== undefined) {
        validateNotEmpty(req.body[field], field);
        data[field] = req.body[field];
      }
    }

    if (priority !== undefined) {
      validateNotEmpty(priority, 'priority');

      if (!VALID_PRIORITIES.includes(priority)) {
        throw createError('Prioridad inválida', 400);
      }

      data.priority = priority;
    }

    if (Object.keys(data).length === 0) {
      throw createError('No se enviaron campos válidos para actualizar', 400);
    }

    const ticket = await findTicketOrFail(id);

    if (req.user.role === 'CLIENTE') {
      ensureClientOwnsTicket(req.user, ticket);

      if (ticket.status !== 'ABIERTO') {
        throw createError('Solo puedes actualizar tickets abiertos', 403);
      }
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data,
      include: ticketInclude,
    });

    res.status(200).json({
      success: true,
      message: 'Ticket actualizado correctamente',
      data: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
}

async function assignTicket(req, res, next) {
  try {
    const id = parseTicketId(req);
    const assigneeId = Number(req.body.assigneeId);

    if (!Number.isInteger(assigneeId) || assigneeId <= 0) {
      throw createError('assigneeId es obligatorio y debe ser válido', 400);
    }

    const ticket = await findTicketOrFail(id);

    if (req.user.role === 'SOPORTE') {
      if (assigneeId !== req.user.id) {
        throw createError('Soporte solo puede asignarse tickets a sí mismo', 403);
      }

      if (ticket.assigneeId) {
        throw createError('Soporte solo puede asignarse tickets sin responsable', 403);
      }
    }

    const assignee = await prisma.user.findUnique({
      where: { id: assigneeId },
    });

    if (!assignee || assignee.role !== 'SOPORTE') {
      throw createError('El responsable debe existir y tener rol SOPORTE', 400);
    }

    const updatedTicket = await prisma.$transaction(async (tx) => {
      await tx.ticket.update({
        where: { id },
        data: { assigneeId },
      });

      await tx.ticketHistory.create({
        data: {
          ticketId: id,
          userId: req.user.id,
          comment: 'Ticket asignado a soporte.',
          oldStatus: null,
          newStatus: null,
        },
      });

      return tx.ticket.findUnique({
        where: { id },
        include: ticketDetailInclude,
      });
    });

    res.status(200).json({
      success: true,
      message: 'Ticket asignado correctamente',
      data: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
}

async function updateTicketStatus(req, res, next) {
  try {
    const id = parseTicketId(req);
    const { status, comment } = req.body;

    if (!status) {
      throw createError('status es obligatorio', 400);
    }

    if (!VALID_STATUSES.includes(status)) {
      throw createError('Estado inválido', 400);
    }

    if (comment !== undefined && String(comment).trim().length < 3) {
      throw createError('El comentario debe tener al menos 3 caracteres', 400);
    }

    const ticket = await findTicketOrFail(id);
    const historyComment = comment || `Estado cambiado de ${ticket.status} a ${status}.`;

    const updatedTicket = await prisma.$transaction(async (tx) => {
      await tx.ticket.update({
        where: { id },
        data: { status },
      });

      await tx.ticketHistory.create({
        data: {
          ticketId: id,
          userId: req.user.id,
          comment: historyComment,
          oldStatus: ticket.status,
          newStatus: status,
        },
      });

      return tx.ticket.findUnique({
        where: { id },
        include: ticketDetailInclude,
      });
    });

    res.status(200).json({
      success: true,
      message: 'Estado del ticket actualizado correctamente',
      data: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
}

async function addTicketHistory(req, res, next) {
  try {
    const id = parseTicketId(req);
    const { comment } = req.body;

    if (!comment || String(comment).trim().length < 3) {
      throw createError('El comentario es obligatorio y debe tener al menos 3 caracteres', 400);
    }

    const ticket = await findTicketOrFail(id);
    ensureClientOwnsTicket(req.user, ticket);

    const history = await prisma.ticketHistory.create({
      data: {
        ticketId: id,
        userId: req.user.id,
        comment,
        oldStatus: null,
        newStatus: null,
      },
      include: {
        user: { select: userSelect },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Historial agregado correctamente',
      data: history,
    });
  } catch (error) {
    next(error);
  }
}

async function getTicketHistories(req, res, next) {
  try {
    const id = parseTicketId(req);
    const ticket = await findTicketOrFail(id);

    ensureClientOwnsTicket(req.user, ticket);

    const histories = await prisma.ticketHistory.findMany({
      where: { ticketId: id },
      include: {
        user: { select: userSelect },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json({
      success: true,
      message: 'Historial del ticket obtenido correctamente',
      data: histories,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteTicket(req, res, next) {
  try {
    const id = parseTicketId(req);

    await findTicketOrFail(id);

    await prisma.$transaction(async (tx) => {
      await tx.ticketHistory.deleteMany({
        where: { ticketId: id },
      });

      await tx.ticket.delete({
        where: { id },
      });
    });

    res.status(200).json({
      success: true,
      message: 'Ticket e historiales asociados eliminados correctamente',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  assignTicket,
  updateTicketStatus,
  addTicketHistory,
  getTicketHistories,
  deleteTicket,
};
