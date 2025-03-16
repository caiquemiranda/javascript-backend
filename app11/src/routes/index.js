const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./users');
const { handleNotFound } = require('../middlewares/errorHandler');

/**
 * Rotas da API
 */

// Rota raiz
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API REST com PostgreSQL',
        version: '1.0.0'
    });
});

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de usuários
router.use('/users', userRoutes);

// Rota 404 para endpoints não encontrados
router.use(handleNotFound);

module.exports = router; 