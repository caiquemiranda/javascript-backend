const jwt = require('jsonwebtoken');
const { models } = require('../database');
const config = require('../config/app');
const logger = require('../utils/logger');

class AuthService {
    /**
     * Registrar um novo usuário
     * @param {Object} userData - Dados do usuário
     * @returns {Promise<Object>} Usuário criado e token
     */
    async register(userData) {
        const { name, email, password } = userData;

        // Verificar se o usuário já existe
        const existingUser = await models.User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Este email já está registrado');
        }

        // Criar novo usuário
        const user = await models.User.create({
            name,
            email,
            password,
            role: 'user'
        });

        // Gerar token JWT
        const token = this.generateToken(user);

        return {
            user: user.toJSON(),
            token
        };
    }

    /**
     * Autenticar usuário
     * @param {string} email - Email do usuário
     * @param {string} password - Senha do usuário
     * @returns {Promise<Object>} Usuário autenticado e token
     */
    async login(email, password) {
        // Buscar o usuário pelo email
        const user = await models.User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Credenciais inválidas');
        }

        // Verificar se o usuário está ativo
        if (!user.active) {
            throw new Error('Conta desativada. Entre em contato com o administrador');
        }

        // Verificar a senha
        const isPasswordValid = await user.checkPassword(password);
        if (!isPasswordValid) {
            throw new Error('Credenciais inválidas');
        }

        // Atualizar último login
        user.last_login = new Date();
        await user.save();

        // Gerar token JWT
        const token = this.generateToken(user);

        return {
            user: user.toJSON(),
            token
        };
    }

    /**
     * Obter perfil do usuário
     * @param {string} userId - ID do usuário
     * @returns {Promise<Object>} Dados do usuário
     */
    async getProfile(userId) {
        const user = await models.User.findByPk(userId);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return user.toJSON();
    }

    /**
     * Renovar token JWT
     * @param {Object} userData - Dados do usuário do token atual
     * @returns {string} Novo token JWT
     */
    refreshToken(userData) {
        return this.generateToken(userData);
    }

    /**
     * Gerar token JWT
     * @param {Object} user - Dados do usuário
     * @returns {string} Token JWT
     * @private
     */
    generateToken(user) {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );
    }
}

module.exports = new AuthService(); 