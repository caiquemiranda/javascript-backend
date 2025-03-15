/**
 * Rotas para operações relacionadas a tarefas
 */
const express = require('express');
const router = express.Router();
const tarefasController = require('../controllers/tarefasController');

// Rota para listar todas as tarefas (com filtros opcionais)
router.get('/', tarefasController.listarTarefas);

// Rota para buscar tarefas por termo
router.get('/buscar', tarefasController.buscarTarefas);

// Rota para obter uma tarefa específica pelo ID
router.get('/:id', tarefasController.obterTarefaPorId);

// Rota para criar uma nova tarefa
router.post('/', tarefasController.criarTarefa);

// Rota para atualizar uma tarefa existente
router.put('/:id', tarefasController.atualizarTarefa);

// Rota para marcar tarefa como concluída/pendente
router.patch('/:id/concluir', tarefasController.marcarConclusao);

// Rota para excluir uma tarefa
router.delete('/:id', tarefasController.removerTarefa);

module.exports = router; 