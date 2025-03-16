const { body, param } = require('express-validator');

/**
 * Validações para atualização de usuário
 */
const updateUserValidation = [
    param('id')
        .isUUID(4)
        .withMessage('ID inválido'),

    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('O nome não pode estar vazio')
        .isLength({ min: 3, max: 100 })
        .withMessage('O nome deve ter entre 3 e 100 caracteres'),

    body('email')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('O email não pode estar vazio')
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),

    body('role')
        .optional()
        .trim()
        .isIn(['admin', 'user'])
        .withMessage('Role inválida'),

    body('active')
        .optional()
        .isBoolean()
        .withMessage('O campo active deve ser um booleano')
];

/**
 * Validações para alteração de senha
 */
const changePasswordValidation = [
    param('id')
        .isUUID(4)
        .withMessage('ID inválido'),

    body('currentPassword')
        .trim()
        .notEmpty()
        .withMessage('A senha atual é obrigatória'),

    body('newPassword')
        .trim()
        .notEmpty()
        .withMessage('A nova senha é obrigatória')
        .isLength({ min: 6 })
        .withMessage('A nova senha deve ter no mínimo 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
        .withMessage('A nova senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número')
];

module.exports = {
    updateUserValidation,
    changePasswordValidation
}; 