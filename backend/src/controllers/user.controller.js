const prisma = require('../config/prisma');

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

async function getUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: userSelect,
      orderBy: { id: 'asc' },
    });

    res.status(200).json({
      success: true,
      message: 'Usuarios obtenidos correctamente',
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

async function getSupportUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'SOPORTE' },
      select: userSelect,
      orderBy: { id: 'asc' },
    });

    res.status(200).json({
      success: true,
      message: 'Usuarios de soporte obtenidos correctamente',
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  getSupportUsers,
};
