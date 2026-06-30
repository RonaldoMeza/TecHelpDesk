const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/', authMiddleware, authorizeRoles('ADMIN'), userController.getUsers);
router.get('/support', authMiddleware, authorizeRoles('ADMIN', 'SOPORTE'), userController.getSupportUsers);

module.exports = router;
