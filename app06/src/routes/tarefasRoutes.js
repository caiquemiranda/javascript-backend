/**
 * Rotas para gerenciamento de tarefas
 */
const express = require('express');
const router = express.Router();
const tarefasController = require('../controllers/tarefasController');

/**
 * @route   GET /api/tarefas
 * @desc    Obtém todas as tarefas
 * @access  Público
 */
router.get('/', tarefasController.obterTodas);

/**
 * @route   GET /api/tarefas/:id
 * @desc    Obtém uma tarefa pelo ID
 * @access  Público
 */
router.get('/:id', tarefasController.obterPorId);

/**
 * @route   POST /api/tarefas
 * @desc    Cria uma nova tarefa
 * @access  Público
 */
router.post('/', tarefasController.criar);

/**
 * @route   PUT /api/tarefas/:id
 * @desc    Atualiza uma tarefa existente
 * @access  Público
 */
router.put('/:id', tarefasController.atualizar);

/**
 * @route   DELETE /api/tarefas/:id
 * @desc    Remove uma tarefa
 * @access  Público
 */
router.delete('/:id', tarefasController.remover);

module.exports = router; 