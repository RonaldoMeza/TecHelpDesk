const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

function createAuthError(message) {
  const error = new Error(message);
  error.statusCode = 401;
  return error;
}

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw createAuthError('Token no proporcionado');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw createAuthError('Formato de token inválido');
    }

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw createAuthError('Token inválido o expirado');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || !user.isActive) {
      throw createAuthError('Usuario no autorizado');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authMiddleware;
