const express = require('express');
const router = express.Router();
const labelController = require('../controllers/labelController');

/**
 * @route GET /api/labels
 * @desc Listar todas as etiquetas
 * @access Public
 */
router.get('/', labelController.getAllLabels);

/**
 * @route GET /api/labels/:id
 * @desc Obter uma etiqueta pelo ID
 * @access Public
 */
router.get('/:id', labelController.getLabelById);

/**
 * @route POST /api/labels
 * @desc Criar uma nova etiqueta
 * @access Public
 */
router.post('/', labelController.createLabel);

/**
 * @route PUT /api/labels/:id
 * @desc Atualizar uma etiqueta existente
 * @access Public
 */
router.put('/:id', labelController.updateLabel);

/**
 * @route DELETE /api/labels/:id
 * @desc Excluir uma etiqueta
 * @access Public
 */
router.delete('/:id', labelController.deleteLabel);

/**
 * @route GET /api/labels/task/:taskId
 * @desc Listar etiquetas de uma tarefa
 * @access Public
 */
router.get('/task/:taskId', labelController.getLabelsByTask);

module.exports = router; 