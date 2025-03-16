/**
 * Controlador para autenticação de usuários
 */
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const jwtConfig = require('../config/jwt');
const { validateRegistration, validateLogin } = require('../utils/validators');

/**
 * Controlador de autenticação
 */
const authController = {
    /**
     * Registra um novo usuário
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     */
    register: (req, res) => {
        try {
            // Validar os dados de entrada
            const { isValid, errors } = validateRegistration(req.body);

            if (!isValid) {
                return res.status(400).json({
                    success: false,
                    errors
                });
            }

            const { name, email, password } = req.body;

            // Criar o usuário
            const newUser = userModel.create({
                name,
                email,
                password,
                role: 'user' // Por padrão, novos usuários têm role 'user'
            });

            // Responder com o usuário criado (sem a senha)
            res.status(201).json({
                success: true,
                message: 'Usuário registrado com sucesso',
                user: newUser
            });
        } catch (error) {
            // Tratar erro de email já em uso
            if (error.message === 'Email já está em uso') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            // Outros erros
            res.status(500).json({
                success: false,
                message: 'Erro ao registrar usuário',
                error: error.message
            });
        }
    },

    /**
     * Autentica um usuário e retorna um token JWT
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     */
    login: (req, res) => {
        try {
            // Validar os dados de entrada
            const { isValid, errors } = validateLogin(req.body);

            if (!isValid) {
                return res.status(400).json({
                    success: false,
                    errors
                });
            }

            const { email, password } = req.body;

            // Autenticar o usuário
            const user = userModel.authenticate(email, password);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
            }

            // Gerar o token JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                jwtConfig.secret,
                {
                    expiresIn: jwtConfig.expiresIn,
                    ...jwtConfig.options
                }
            );

            // Responder com o token e os dados do usuário
            res.json({
                success: true,
                message: 'Autenticação bem-sucedida',
                token,
                user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao autenticar',
                error: error.message
            });
        }
    },

    /**
     * Verifica o token JWT e retorna o usuário atual
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     */
    me: (req, res) => {
        // O middleware de autenticação já verificou o token e adicionou o usuário à requisição
        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        res.json({
            success: true,
            user: req.user
        });
    }
};

module.exports = authController; 