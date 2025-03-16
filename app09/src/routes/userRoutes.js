/**
 * Rotas para gerenciamento de usuários
 */

const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Obter todos os usuários
 * @access  Privado (somente admin)
 */
router.get('/', authenticateToken, requireAdmin, userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Obter um usuário pelo ID
 * @access  Privado (próprio usuário ou admin)
 */
router.get('/:id', authenticateToken, userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Atualizar um usuário
 * @access  Privado (próprio usuário ou admin)
 */
router.put('/:id', authenticateToken, userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Excluir um usuário
 * @access  Privado (próprio usuário ou admin)
 */
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router; 