const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { registerValidation, loginValidation } = require('../validators/auth');

/**
 * Rotas de autenticação
 */

// Registro de usuário
router.post('/register',
    validate(registerValidation),
    authController.register
);

// Login
router.post('/login',
    validate(loginValidation),
    authController.login
);

// Perfil do usuário (requer autenticação)
router.get('/profile',
    authMiddleware,
    authController.getProfile
);

// Renovar token (requer autenticação)
router.post('/refresh',
    authMiddleware,
    authController.refreshToken
);

module.exports = router; 