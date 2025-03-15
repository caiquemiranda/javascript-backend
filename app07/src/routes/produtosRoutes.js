/**
 * Rotas para o recurso Produtos
 */
const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtosController');

/**
 * @route   GET /api/produtos
 * @desc    Listar todos os produtos
 * @access  Público
 */
router.get('/', produtosController.listarTodos);

/**
 * @route   GET /api/produtos/busca?termo=xyz
 * @desc    Buscar produtos por termo
 * @access  Público
 */
router.get('/busca', produtosController.buscarPorTermo);

/**
 * @route   GET /api/produtos/:id
 * @desc    Obter um produto específico
 * @access  Público
 */
router.get('/:id', produtosController.buscarPorId);

/**
 * @route   POST /api/produtos
 * @desc    Criar um novo produto
 * @access  Público
 */
router.post('/', produtosController.criar);

/**
 * @route   PUT /api/produtos/:id
 * @desc    Atualizar um produto existente
 * @access  Público
 */
router.put('/:id', produtosController.atualizar);

/**
 * @route   DELETE /api/produtos/:id
 * @desc    Remover um produto
 * @access  Público
 */
router.delete('/:id', produtosController.remover);

module.exports = router; 