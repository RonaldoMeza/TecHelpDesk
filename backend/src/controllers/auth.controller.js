const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { generateToken } = require('../utils/jwt');

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw createError('Nombre, email y password son obligatorios', 400);
    }

    if (!isValidEmail(email)) {
      throw createError('El formato del email no es válido', 400);
    }

    if (password.length < 8) {
      throw createError('La contraseña debe tener al menos 8 caracteres', 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createError('El email ya está registrado', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CLIENTE',
      },
    });

    const safeUser = sanitizeUser(user);
    const token = generateToken(safeUser);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      user: safeUser,
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError('Email y password son obligatorios', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw createError('Credenciales inválidas', 401);
    }

    if (!user.isActive) {
      throw createError('El usuario está inactivo', 401);
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw createError('Credenciales inválidas', 401);
    }

    const safeUser = sanitizeUser(user);
    const token = generateToken(safeUser);

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión correcto',
      user: safeUser,
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  res.status(200).json({
    success: true,
    message: 'Perfil autenticado obtenido correctamente',
    user: sanitizeUser(req.user),
  });
}

module.exports = {
  register,
  login,
  me,
};
