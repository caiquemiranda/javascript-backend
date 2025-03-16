const { body } = require('express-validator');

/**
 * Validadores para as rotas da API
 */
const validators = {
    /**
     * Validação para registro de usuário
     */
    register: [
        body('name')
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage('O nome deve ter entre 3 e 100 caracteres'),

        body('email')
            .trim()
            .isEmail()
            .withMessage('Forneça um email válido')
            .normalizeEmail(),

        body('password')
            .isLength({ min: 6 })
            .withMessage('A senha deve ter no mínimo 6 caracteres')
            .matches(/\d/)
            .withMessage('A senha deve conter pelo menos um número')
    ],

    /**
     * Validação para login
     */
    login: [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Forneça um email válido')
            .normalizeEmail(),

        body('password')
            .notEmpty()
            .withMessage('A senha é obrigatória')
    ],

    /**
     * Validação para atualização de usuário
     */
    updateUser: [
        body('name')
            .optional()
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage('O nome deve ter entre 3 e 100 caracteres'),

        body('email')
            .optional()
            .trim()
            .isEmail()
            .withMessage('Forneça um email válido')
            .normalizeEmail(),

        body('role')
            .optional()
            .isIn(['user', 'admin'])
            .withMessage('Role inválida. Valores aceitos: user, admin'),

        body('active')
            .optional()
            .isBoolean()
            .withMessage('O status deve ser um booleano')
    ],

    /**
     * Validação para alteração de senha
     */
    changePassword: [
        body('currentPassword')
            .notEmpty()
            .withMessage('A senha atual é obrigatória'),

        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('A nova senha deve ter no mínimo 6 caracteres')
            .matches(/\d/)
            .withMessage('A nova senha deve conter pelo menos um número'),

        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error('As senhas não conferem');
                }
                return true;
            })
    ]
};

module.exports = validators; 