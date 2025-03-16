/**
 * Arquivo central de rotas da API
 */

const express = require('express');
const fileRoutes = require('./fileRoutes');
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
        message: 'API de Upload de Arquivos',
        version: '1.0.0',
        endpoints: {
            files: '/api/files'
        }
    });
});

// Rotas de arquivos
router.use('/files', fileRoutes);

// Middleware para rotas não encontradas
router.use(notFoundHandler);

module.exports = router; 