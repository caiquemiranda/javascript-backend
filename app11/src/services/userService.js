const { models } = require('../database');
const logger = require('../utils/logger');

class UserService {
    /**
     * Listar todos os usuários com paginação
     * @param {number} page - Número da página
     * @param {number} limit - Limite de itens por página
     * @returns {Promise<Object>} Lista de usuários e informações de paginação
     */
    async getAllUsers(page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const { count, rows: users } = await models.User.findAndCountAll({
            limit,
            offset,
            order: [['created_at', 'DESC']],
            attributes: { exclude: ['password'] }
        });

        const totalPages = Math.ceil(count / limit);

        return {
            users,
            pagination: {
                total: count,
                totalPages,
                currentPage: page,
                limit
            }
        };
    }

    /**
     * Obter usuário por ID
     * @param {string} id - ID do usuário
     * @returns {Promise<Object>} Dados do usuário
     */
    async getUserById(id) {
        const user = await models.User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return user;
    }

    /**
     * Atualizar usuário
     * @param {string} id - ID do usuário
     * @param {Object} updateData - Dados para atualização
     * @param {Object} requestUser - Usuário que fez a requisição
     * @returns {Promise<Object>} Usuário atualizado
     */
    async updateUser(id, updateData, requestUser) {
        const user = await models.User.findByPk(id);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Verificar permissões
        if ((updateData.role !== undefined || updateData.active !== undefined) &&
            requestUser.role !== 'admin') {
            throw new Error('Permissão negada. Somente administradores podem alterar role ou status de ativação');
        }

        // Verificar se o email já está em uso
        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await models.User.findOne({
                where: { email: updateData.email }
            });
            if (existingUser) {
                throw new Error('Este email já está em uso');
            }
        }

        // Atualizar usuário
        await user.update({
            name: updateData.name || user.name,
            email: updateData.email || user.email,
            role: updateData.role || user.role,
            active: updateData.active !== undefined ? updateData.active : user.active
        });

        return user;
    }

    /**
     * Excluir usuário
     * @param {string} id - ID do usuário
     * @param {string} requestUserId - ID do usuário que fez a requisição
     * @returns {Promise<void>}
     */
    async deleteUser(id, requestUserId) {
        const user = await models.User.findByPk(id);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Impedir que o usuário exclua a si mesmo
        if (id === requestUserId) {
            throw new Error('Você não pode excluir seu próprio usuário');
        }

        await user.destroy();
    }

    /**
     * Alterar senha do usuário
     * @param {string} id - ID do usuário
     * @param {string} currentPassword - Senha atual
     * @param {string} newPassword - Nova senha
     * @param {Object} requestUser - Usuário que fez a requisição
     * @returns {Promise<void>}
     */
    async changePassword(id, currentPassword, newPassword, requestUser) {
        const user = await models.User.findByPk(id);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Apenas o próprio usuário ou um admin pode alterar a senha
        if (id !== requestUser.id && requestUser.role !== 'admin') {
            throw new Error('Permissão negada');
        }

        // Verificar senha atual (exceto para administradores)
        if (id === requestUser.id) {
            const isPasswordValid = await user.checkPassword(currentPassword);
            if (!isPasswordValid) {
                throw new Error('Senha atual incorreta');
            }
        }

        // Atualizar senha
        user.password = newPassword;
        await user.save();
    }
}

module.exports = new UserService(); 