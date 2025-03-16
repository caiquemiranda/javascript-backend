const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const logger = require('../utils/logger');

/**
 * Controlador para autenticação e gerenciamento de usuários
 */
const authController = {
    /**
     * Registrar um novo usuário
     * @route POST /api/auth/register
     */
    register: async (req, res, next) => {
        try {
            // Verificar erros de validação
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const result = await authService.register(req.body);

            res.status(201).json({
                success: true,
                message: 'Usuário registrado com sucesso',
                data: result
            });
        } catch (error) {
            logger.error('Erro ao registrar usuário:', error);
            next(error);
        }
    },

    /**
     * Login de usuário
     * @route POST /api/auth/login
     */
    login: async (req, res, next) => {
        try {
            // Verificar erros de validação
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { email, password } = req.body;
            const result = await authService.login(email, password);

            res.json({
                success: true,
                message: 'Login realizado com sucesso',
                data: result
            });
        } catch (error) {
            logger.error('Erro no login:', error);
            next(error);
        }
    },

    /**
     * Obter perfil do usuário autenticado
     * @route GET /api/auth/profile
     */
    getProfile: async (req, res, next) => {
        try {
            const user = await authService.getProfile(req.user.id);

            res.json({
                success: true,
                data: { user }
            });
        } catch (error) {
            logger.error('Erro ao obter perfil:', error);
            next(error);
        }
    },

    /**
     * Renovar token JWT
     * @route POST /api/auth/refresh
     */
    refreshToken: (req, res) => {
        try {
            const token = authService.refreshToken(req.user);

            res.json({
                success: true,
                message: 'Token renovado com sucesso',
                data: { token }
            });
        } catch (error) {
            logger.error('Erro ao renovar token:', error);
            next(error);
        }
    }
};

module.exports = authController; 