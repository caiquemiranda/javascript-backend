const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');
const validators = require('../utils/validators');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

/**
 * @route   GET /api/users
 * @desc    Listar todos os usuários
 * @access  Privado (admin)
 */
router.get('/', checkRole(['admin']), userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Obter usuário por ID
 * @access  Privado (admin ou próprio usuário)
 */
router.get('/:id', userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Atualizar usuário
 * @access  Privado (admin ou próprio usuário)
 */
router.put('/:id', validators.updateUser, userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Excluir usuário
 * @access  Privado (admin)
 */
router.delete('/:id', checkRole(['admin']), userController.deleteUser);

/**
 * @route   PUT /api/users/:id/password
 * @desc    Alterar senha do usuário
 * @access  Privado (admin ou próprio usuário)
 */
router.put('/:id/password', validators.changePassword, userController.changePassword);

module.exports = router; 