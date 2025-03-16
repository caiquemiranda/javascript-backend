const { validationResult } = require('express-validator');
const userService = require('../services/userService');
const logger = require('../utils/logger');

/**
 * Controlador para gerenciamento de usuários
 */
const userController = {
    /**
     * Listar todos os usuários com paginação
     * @route GET /api/users
     */
    getAllUsers: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await userService.getAllUsers(page, limit);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            logger.error('Erro ao listar usuários:', error);
            next(error);
        }
    },

    /**
     * Obter um usuário específico por ID
     * @route GET /api/users/:id
     */
    getUserById: async (req, res, next) => {
        try {
            const user = await userService.getUserById(req.params.id);

            res.json({
                success: true,
                data: { user }
            });
        } catch (error) {
            logger.error('Erro ao buscar usuário:', error);
            next(error);
        }
    },

    /**
     * Atualizar um usuário
     * @route PUT /api/users/:id
     */
    updateUser: async (req, res, next) => {
        try {
            // Verificar erros de validação
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const updatedUser = await userService.updateUser(
                req.params.id,
                req.body,
                req.user
            );

            res.json({
                success: true,
                message: 'Usuário atualizado com sucesso',
                data: { user: updatedUser }
            });
        } catch (error) {
            logger.error('Erro ao atualizar usuário:', error);
            next(error);
        }
    },

    /**
     * Excluir um usuário
     * @route DELETE /api/users/:id
     */
    deleteUser: async (req, res, next) => {
        try {
            await userService.deleteUser(req.params.id, req.user.id);

            res.json({
                success: true,
                message: 'Usuário excluído com sucesso'
            });
        } catch (error) {
            logger.error('Erro ao excluir usuário:', error);
            next(error);
        }
    },

    /**
     * Alterar senha do usuário
     * @route PUT /api/users/:id/password
     */
    changePassword: async (req, res, next) => {
        try {
            // Verificar erros de validação
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { currentPassword, newPassword } = req.body;
            await userService.changePassword(
                req.params.id,
                currentPassword,
                newPassword,
                req.user
            );

            res.json({
                success: true,
                message: 'Senha alterada com sucesso'
            });
        } catch (error) {
            logger.error('Erro ao alterar senha:', error);
            next(error);
        }
    }
};

module.exports = userController; 