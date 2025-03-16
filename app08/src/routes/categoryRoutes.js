const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * @route GET /api/categories
 * @desc Listar todas as categorias
 * @access Public
 */
router.get('/', categoryController.getAllCategories);

/**
 * @route GET /api/categories/:id
 * @desc Obter uma categoria pelo ID
 * @access Public
 */
router.get('/:id', categoryController.getCategoryById);

/**
 * @route POST /api/categories
 * @desc Criar uma nova categoria
 * @access Public
 */
router.post('/', categoryController.createCategory);

/**
 * @route PUT /api/categories/:id
 * @desc Atualizar uma categoria existente
 * @access Public
 */
router.put('/:id', categoryController.updateCategory);

/**
 * @route DELETE /api/categories/:id
 * @desc Excluir uma categoria
 * @access Public
 */
router.delete('/:id', categoryController.deleteCategory);

module.exports = router; 