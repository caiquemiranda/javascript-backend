const { validationResult } = require('express-validator');
const { models } = require('../database');
const logger = require('../utils/logger');

/**
 * Controlador para operações de usuários
 */
const userController = {
    /**
     * Listar todos os usuários
     * @route GET /api/users
     */
    getAllUsers: async (req, res, next) => {
        try {
            // Opções de paginação
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const offset = (page - 1) * limit;

            // Buscar usuários com paginação
            const { count, rows: users } = await models.User.findAndCountAll({
                limit,
                offset,
                order: [['created_at', 'DESC']],
                attributes: { exclude: ['password'] } // Não retornar senhas
            });

            // Calcular total de páginas
            const totalPages = Math.ceil(count / limit);

            res.json({
                success: true,
                data: {
                    users,
                    pagination: {
                        total: count,
                        totalPages,
                        currentPage: page,
                        limit
                    }
                }
            });
        } catch (error) {
            logger.error('Erro ao listar usuários:', error);
            next(error);
        }
    },

    /**
     * Obter usuário por ID
     * @route GET /api/users/:id
     */
    getUserById: async (req, res, next) => {
        try {
            const { id } = req.params;

            const user = await models.User.findByPk(id, {
                attributes: { exclude: ['password'] } // Não retornar senha
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            res.json({
                success: true,
                data: { user }
            });
        } catch (error) {
            logger.error(`Erro ao buscar usuário ID ${req.params.id}:`, error);
            next(error);
        }
    },

    /**
     * Atualizar usuário
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

            const { id } = req.params;
            const { name, email, role, active } = req.body;

            // Verificar se o usuário existe
            const user = await models.User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            // Verificar permissões (apenas administradores podem alterar roles ou ativar/desativar)
            if ((role !== undefined || active !== undefined) && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Permissão negada. Somente administradores podem alterar role ou status de ativação'
                });
            }

            // Verificar se o email já está em uso por outro usuário
            if (email && email !== user.email) {
                const existingUser = await models.User.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'Este email já está em uso'
                    });
                }
            }

            // Atualizar usuário
            await user.update({
                name: name || user.name,
                email: email || user.email,
                role: role || user.role,
                active: active !== undefined ? active : user.active
            });

            res.json({
                success: true,
                message: 'Usuário atualizado com sucesso',
                data: { user: user.toJSON() }
            });
        } catch (error) {
            logger.error(`Erro ao atualizar usuário ID ${req.params.id}:`, error);
            next(error);
        }
    },

    /**
     * Excluir usuário
     * @route DELETE /api/users/:id
     */
    deleteUser: async (req, res, next) => {
        try {
            const { id } = req.params;

            // Verificar se o usuário existe
            const user = await models.User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            // Impedir que o próprio usuário se exclua
            if (id === req.user.id) {
                return res.status(400).json({
                    success: false,
                    message: 'Você não pode excluir seu próprio usuário'
                });
            }

            // Excluir usuário
            await user.destroy();

            res.json({
                success: true,
                message: 'Usuário excluído com sucesso'
            });
        } catch (error) {
            logger.error(`Erro ao excluir usuário ID ${req.params.id}:`, error);
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

            const { id } = req.params;
            const { currentPassword, newPassword } = req.body;

            // Apenas o próprio usuário ou um admin pode alterar a senha
            if (id !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Permissão negada'
                });
            }

            // Verificar se o usuário existe
            const user = await models.User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            // Verificar senha atual (exceto para administradores)
            if (id === req.user.id) {
                const isPasswordValid = await user.checkPassword(currentPassword);
                if (!isPasswordValid) {
                    return res.status(400).json({
                        success: false,
                        message: 'Senha atual incorreta'
                    });
                }
            }

            // Atualizar senha
            user.password = newPassword;
            await user.save();

            res.json({
                success: true,
                message: 'Senha alterada com sucesso'
            });
        } catch (error) {
            logger.error(`Erro ao alterar senha do usuário ID ${req.params.id}:`, error);
            next(error);
        }
    }
};

module.exports = userController; 