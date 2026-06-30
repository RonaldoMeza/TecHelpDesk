const express = require('express');
const ticketController = require('../controllers/ticket.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', ticketController.getTickets);
router.post('/', ticketController.createTicket);
router.get('/:id', ticketController.getTicketById);
router.put('/:id', ticketController.updateTicket);
router.patch('/:id/assign', authorizeRoles('ADMIN', 'SOPORTE'), ticketController.assignTicket);
router.patch('/:id/status', authorizeRoles('ADMIN', 'SOPORTE'), ticketController.updateTicketStatus);
router.post('/:id/histories', ticketController.addTicketHistory);
router.get('/:id/histories', ticketController.getTicketHistories);
router.delete('/:id', authorizeRoles('ADMIN'), ticketController.deleteTicket);

module.exports = router;
