/**
 * Controlador para operações com usuários
 */
const userModel = require('../models/userModel');
const { validateUserUpdate } = require('../utils/validators');

/**
 * Controlador de usuários
 */
const userController = {
    /**
     * Lista todos os usuários (acessível somente para admins)
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     */
    getAllUsers: (req, res) => {
        try {
            // Verificar se o usuário é admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Acesso não autorizado. Somente administradores podem listar todos os usuários.'
                });
            }

            const users = userModel.findAll();

            res.json({
                success: true,
                users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao listar usuários',
                error: error.message
            });
        }
    },

    /**
     * Obtém os detalhes de um usuário específico
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     */
    getUserById: (req, res) => {
        try {
            const userId = parseInt(req.params.id);

            // Verificar se o usuário está acessando seus próprios dados ou é um admin
            if (req.user.id !== userId && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Acesso não autorizado. Você só pode acessar seus próprios dados.'
                });
            }

            const user = userModel.findById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            // Remover a senha antes de retornar
            const { password, ...userWithoutPassword } = user;

            res.json({
                success: true,
                user: userWithoutPassword
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar usuário',
                error: error.message
            });
        }
    },

    /**
     * Atualiza os dados de um usuário
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     */
    updateUser: (req, res) => {
        try {
            const userId = parseInt(req.params.id);

            // Verificar se o usuário está atualizando seus próprios dados ou é um admin
            if (req.user.id !== userId && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Acesso não autorizado. Você só pode atualizar seus próprios dados.'
                });
            }

            // Validar os dados de entrada
            const { isValid, errors } = validateUserUpdate(req.body);

            if (!isValid) {
                return res.status(400).json({
                    success: false,
                    errors
                });
            }

            // Apenas admins podem atualizar a role
            if (req.body.role && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Apenas administradores podem alterar a role de um usuário'
                });
            }

            // Atualizar o usuário
            const updatedUser = userModel.update(userId, req.body);

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Usuário atualizado com sucesso',
                user: updatedUser
            });
        } catch (error) {
            // Tratar erro de email já em uso
            if (error.message === 'Email já está em uso') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Erro ao atualizar usuário',
                error: error.message
            });
        }
    },

    /**
     * Remove um usuário
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     */
    deleteUser: (req, res) => {
        try {
            const userId = parseInt(req.params.id);

            // Verificar se o usuário está excluindo seus próprios dados ou é um admin
            if (req.user.id !== userId && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Acesso não autorizado. Você só pode excluir sua própria conta.'
                });
            }

            // Não permitir que o usuário exclua a conta de um admin (a menos que seja um admin)
            const userToDelete = userModel.findById(userId);
            if (userToDelete && userToDelete.role === 'admin' && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Não é possível excluir uma conta de administrador'
                });
            }

            // Excluir o usuário
            const deleted = userModel.delete(userId);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Usuário excluído com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao excluir usuário',
                error: error.message
            });
        }
    }
};

module.exports = userController; 