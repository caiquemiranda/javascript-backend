/**
 * Rotas de autenticação
 */

const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar um novo usuário
 * @access  Público
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuário
 * @access  Público
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Obter informações do usuário atual
 * @access  Privado
 */
router.get('/me', authenticateToken, authController.me);

module.exports = router; 