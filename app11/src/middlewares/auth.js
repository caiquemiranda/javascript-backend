const jwt = require('jsonwebtoken');
const { models } = require('../database');
const jwtConfig = require('../config/jwt');
const logger = require('../utils/logger');

/**
 * Middleware de autenticação JWT
 * Verifica se o token é válido e adiciona o usuário à requisição
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Obter o token do header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token não fornecido'
            });
        }

        // Verificar formato do token
        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
            return res.status(401).json({
                success: false,
                message: 'Token mal formatado'
            });
        }

        const [scheme, token] = parts;
        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({
                success: false,
                message: 'Token mal formatado'
            });
        }

        try {
            // Verificar token
            const decoded = jwt.verify(token, jwtConfig.secret, {
                ...jwtConfig.options,
                algorithms: [jwtConfig.algorithm]
            });

            // Buscar usuário no banco
            const user = await models.User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            // Verificar se o usuário existe e está ativo
            if (!user || !user.active) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuário não encontrado ou inativo'
                });
            }

            // Adicionar usuário à requisição
            req.user = user;

            return next();
        } catch (error) {
            logger.error('Erro ao verificar token:', error);
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
    } catch (error) {
        logger.error('Erro no middleware de autenticação:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

module.exports = authMiddleware; 