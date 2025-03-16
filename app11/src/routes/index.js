const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const { notFoundHandler } = require('../middleware/errorMiddleware');

const router = express.Router();

/**
 * @route   GET /api
 * @desc    Informações da API
 * @access  Público
 */
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API REST com PostgreSQL e Arquitetura MVC',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users'
        }
    });
});

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de usuários
router.use('/users', userRoutes);

// Middleware para rotas não encontradas
router.use(notFoundHandler);

module.exports = router; 