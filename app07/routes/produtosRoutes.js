const express = require('express');
const produtosController = require('../controllers/produtosController');

const router = express.Router();

/**
 * @route GET /api/produtos
 * @desc Retorna todos os produtos
 */
router.get('/', produtosController.listarProdutos);

/**
 * @route GET /api/produtos/busca
 * @desc Busca produtos por termo
 */
router.get('/busca', produtosController.buscarProdutos);

/**
 * @route GET /api/produtos/:id
 * @desc Retorna um produto pelo ID
 */
router.get('/:id', produtosController.obterProdutoPorId);

/**
 * @route POST /api/produtos
 * @desc Cria um novo produto
 */
router.post('/', produtosController.criarProduto);

/**
 * @route PUT /api/produtos/:id
 * @desc Atualiza um produto existente
 */
router.put('/:id', produtosController.atualizarProduto);

/**
 * @route DELETE /api/produtos/:id
 * @desc Remove um produto
 */
router.delete('/:id', produtosController.removerProduto);

module.exports = router; 