/**
 * Arquivo de índice para todas as rotas da aplicação
 */
const express = require('express');
const router = express.Router();

// Importa as rotas específicas
const tarefasRoutes = require('./tarefasRoutes');
const categoriasRoutes = require('./categoriasRoutes');
const etiquetasRoutes = require('./etiquetasRoutes');

// Rota principal da API
router.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'API de Gerenciamento de Tarefas',
        version: '1.0.0',
        endpoints: {
            tarefas: '/api/tarefas',
            categorias: '/api/categorias',
            etiquetas: '/api/etiquetas'
        }
    });
});

// Configura as rotas específicas
router.use('/tarefas', tarefasRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/etiquetas', etiquetasRoutes);

module.exports = router; 