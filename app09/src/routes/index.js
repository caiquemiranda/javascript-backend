/**
 * Arquivo central de rotas da API
 */

const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const { notFoundHandler } = require('../middleware/errorMiddleware');

const router = express.Router();

/**
 * @route   GET /api
 * @desc    Rota de informações básicas da API
 * @access  Público
 */
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API REST com autenticação JWT',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users'
        },
        documentation: '/api-docs'  // Se implementar Swagger/OpenAPI
    });
});

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de usuários
router.use('/users', userRoutes);

// Middleware para rotas não encontradas
router.use(notFoundHandler);

module.exports = router; 