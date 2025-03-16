const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

/**
 * @route GET /api/tasks
 * @desc Listar todas as tarefas
 * @access Public
 */
router.get('/', taskController.getAllTasks);

/**
 * @route GET /api/tasks/:id
 * @desc Obter uma tarefa pelo ID
 * @access Public
 */
router.get('/:id', taskController.getTaskById);

/**
 * @route POST /api/tasks
 * @desc Criar uma nova tarefa
 * @access Public
 */
router.post('/', taskController.createTask);

/**
 * @route PUT /api/tasks/:id
 * @desc Atualizar uma tarefa existente
 * @access Public
 */
router.put('/:id', taskController.updateTask);

/**
 * @route DELETE /api/tasks/:id
 * @desc Excluir uma tarefa
 * @access Public
 */
router.delete('/:id', taskController.deleteTask);

/**
 * @route GET /api/tasks/category/:categoryId
 * @desc Listar tarefas por categoria
 * @access Public
 */
router.get('/category/:categoryId', taskController.getTasksByCategory);

/**
 * @route GET /api/tasks/label/:labelId
 * @desc Listar tarefas por etiqueta
 * @access Public
 */
router.get('/label/:labelId', taskController.getTasksByLabel);

/**
 * @route POST /api/tasks/:taskId/labels/:labelId
 * @desc Adicionar uma etiqueta a uma tarefa
 * @access Public
 */
router.post('/:taskId/labels/:labelId', taskController.addLabelToTask);

/**
 * @route DELETE /api/tasks/:taskId/labels/:labelId
 * @desc Remover uma etiqueta de uma tarefa
 * @access Public
 */
router.delete('/:taskId/labels/:labelId', taskController.removeLabelFromTask);

module.exports = router; 