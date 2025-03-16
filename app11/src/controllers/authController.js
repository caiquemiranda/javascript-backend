const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { models } = require('../database');
const config = require('../config/app');
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

            const { name, email, password } = req.body;

            // Verificar se o usuário já existe
            const existingUser = await models.User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Este email já está registrado'
                });
            }

            // Criar novo usuário
            const user = await models.User.create({
                name,
                email,
                password,
                role: 'user' // Por padrão, todos os novos registros são usuários normais
            });

            // Gerar token JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                config.jwt.secret,
                { expiresIn: config.jwt.expiresIn }
            );

            // Responder com dados do usuário e token
            res.status(201).json({
                success: true,
                message: 'Usuário registrado com sucesso',
                data: {
                    user: user.toJSON(),
                    token
                }
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

            // Buscar o usuário pelo email
            const user = await models.User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
            }

            // Verificar se o usuário está ativo
            if (!user.active) {
                return res.status(401).json({
                    success: false,
                    message: 'Conta desativada. Entre em contato com o administrador'
                });
            }

            // Verificar a senha
            const isPasswordValid = await user.checkPassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
            }

            // Atualizar último login
            user.last_login = new Date();
            await user.save();

            // Gerar token JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                config.jwt.secret,
                { expiresIn: config.jwt.expiresIn }
            );

            // Responder com dados do usuário e token
            res.json({
                success: true,
                message: 'Login realizado com sucesso',
                data: {
                    user: user.toJSON(),
                    token
                }
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
            // req.user.id é definido pelo middleware de autenticação
            const user = await models.User.findByPk(req.user.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            res.json({
                success: true,
                data: {
                    user: user.toJSON()
                }
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
        // O usuário já está autenticado pelo middleware de autenticação
        const { id, email, role } = req.user;

        // Gerar novo token
        const token = jwt.sign(
            { id, email, role },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );

        res.json({
            success: true,
            message: 'Token renovado com sucesso',
            data: { token }
        });
    }
};

module.exports = authController; 