/**
 * Rotas para gerenciamento de frases motivacionais
 */
const express = require('express');
const router = express.Router();
const frasesController = require('../controllers/frasesController');

/**
 * @route   GET /api/frases
 * @desc    Obtém todas as frases
 * @access  Público
 */
router.get('/', frasesController.obterTodas);

/**
 * @route   GET /api/frases/aleatoria
 * @desc    Obtém uma frase aleatória
 * @access  Público
 */
router.get('/aleatoria', frasesController.obterAleatoria);

/**
 * @route   GET /api/frases/:id
 * @desc    Obtém uma frase pelo ID
 * @access  Público
 */
router.get('/:id', frasesController.obterPorId);

/**
 * @route   POST /api/frases
 * @desc    Cria uma nova frase
 * @access  Público
 */
router.post('/', frasesController.criar);

/**
 * @route   PUT /api/frases/:id
 * @desc    Atualiza uma frase existente
 * @access  Público
 */
router.put('/:id', frasesController.atualizar);

/**
 * @route   DELETE /api/frases/:id
 * @desc    Remove uma frase
 * @access  Público
 */
router.delete('/:id', frasesController.remover);

module.exports = router; 