/**
 * Rotas para operações relacionadas a categorias
 */
const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');

// Rota para listar todas as categorias
router.get('/', categoriasController.listarCategorias);

// Rota para buscar categorias por nome
router.get('/buscar', categoriasController.buscarCategorias);

// Rota para obter uma categoria específica pelo ID
router.get('/:id', categoriasController.obterCategoriaPorId);

// Rota para criar uma nova categoria
router.post('/', categoriasController.criarCategoria);

// Rota para atualizar uma categoria existente
router.put('/:id', categoriasController.atualizarCategoria);

// Rota para excluir uma categoria
router.delete('/:id', categoriasController.removerCategoria);

module.exports = router; 