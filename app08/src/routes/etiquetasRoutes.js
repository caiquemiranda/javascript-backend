/**
 * Rotas para operações relacionadas a etiquetas
 */
const express = require('express');
const router = express.Router();
const etiquetasController = require('../controllers/etiquetasController');

// Rota para listar todas as etiquetas
router.get('/', etiquetasController.listarEtiquetas);

// Rota para buscar etiquetas por nome
router.get('/buscar', etiquetasController.buscarEtiquetas);

// Rota para obter tarefas de uma etiqueta específica
router.get('/:id/tarefas', etiquetasController.obterTarefasPorEtiqueta);

// Rota para obter uma etiqueta específica pelo ID
router.get('/:id', etiquetasController.obterEtiquetaPorId);

// Rota para criar uma nova etiqueta
router.post('/', etiquetasController.criarEtiqueta);

// Rota para atualizar uma etiqueta existente
router.put('/:id', etiquetasController.atualizarEtiqueta);

// Rota para excluir uma etiqueta
router.delete('/:id', etiquetasController.removerEtiqueta);

module.exports = router; 