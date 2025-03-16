const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');
const validate = require('../middlewares/validate');
const { updateUserValidation, changePasswordValidation } = require('../validators/user');

/**
 * Rotas de usuários (todas requerem autenticação)
 */
router.use(authMiddleware);

// Listar todos os usuários (apenas admin)
router.get('/',
    checkRole('admin'),
    userController.getAllUsers
);

// Obter usuário por ID (admin ou próprio usuário)
router.get('/:id',
    userController.getUserById
);

// Atualizar usuário (admin ou próprio usuário)
router.put('/:id',
    validate(updateUserValidation),
    userController.updateUser
);

// Excluir usuário (apenas admin)
router.delete('/:id',
    checkRole('admin'),
    userController.deleteUser
);

// Alterar senha (admin ou próprio usuário)
router.put('/:id/password',
    validate(changePasswordValidation),
    userController.changePassword
);

module.exports = router; 