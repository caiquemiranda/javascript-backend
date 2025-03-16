const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const validators = require('../utils/validators');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar um novo usuário
 * @access  Público
 */
router.post('/register', validators.register, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Autenticar usuário
 * @access  Público
 */
router.post('/login', validators.login, authController.login);

/**
 * @route   GET /api/auth/profile
 * @desc    Obter perfil do usuário autenticado
 * @access  Privado
 */
router.get('/profile', authenticateToken, authController.getProfile);

/**
 * @route   POST /api/auth/refresh
 * @desc    Renovar token JWT
 * @access  Privado
 */
router.post('/refresh', authenticateToken, authController.refreshToken);

module.exports = router; 