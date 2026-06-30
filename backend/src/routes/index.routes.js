const express = require('express');
const prisma = require('../config/prisma');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const ticketRoutes = require('./ticket.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TecHelpDesk API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

router.get('/db-check', async (req, res, next) => {
  try {
    const [users, tickets, histories] = await Promise.all([
      prisma.user.count(),
      prisma.ticket.count(),
      prisma.ticketHistory.count(),
    ]);

    res.status(200).json({
      success: true,
      message: 'Conexión a base de datos correcta',
      data: {
        users,
        tickets,
        histories,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tickets', ticketRoutes);

module.exports = router;
