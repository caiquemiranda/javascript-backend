const { body } = require('express-validator');

/**
 * Validações para registro de usuário
 */
const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('O nome é obrigatório')
        .isLength({ min: 3, max: 100 })
        .withMessage('O nome deve ter entre 3 e 100 caracteres'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('O email é obrigatório')
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('A senha é obrigatória')
        .isLength({ min: 6 })
        .withMessage('A senha deve ter no mínimo 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
        .withMessage('A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'),

    body('role')
        .optional()
        .trim()
        .isIn(['admin', 'user'])
        .withMessage('Role inválida')
];

/**
 * Validações para login
 */
const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('O email é obrigatório')
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('A senha é obrigatória')
];

module.exports = {
    registerValidation,
    loginValidation
}; 