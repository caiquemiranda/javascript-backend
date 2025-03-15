/**
 * Rotas para gerenciamento de livros
 */
const express = require('express');
const router = express.Router();
const livrosController = require('../controllers/livrosController');

/**
 * @route   GET /api/livros
 * @desc    Obtém todos os livros
 * @access  Público
 */
router.get('/', livrosController.obterTodos);

/**
 * @route   GET /api/livros/busca
 * @desc    Busca livros por termo
 * @access  Público
 */
router.get('/busca', livrosController.buscarPorTermo);

/**
 * @route   GET /api/livros/:id
 * @desc    Obtém um livro pelo ID
 * @access  Público
 */
router.get('/:id', livrosController.obterPorId);

/**
 * @route   POST /api/livros
 * @desc    Cria um novo livro
 * @access  Público
 */
router.post('/', livrosController.criar);

/**
 * @route   PUT /api/livros/:id
 * @desc    Atualiza um livro existente
 * @access  Público
 */
router.put('/:id', livrosController.atualizar);

/**
 * @route   DELETE /api/livros/:id
 * @desc    Remove um livro
 * @access  Público
 */
router.delete('/:id', livrosController.remover);

module.exports = router; 