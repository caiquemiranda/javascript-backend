const jwt = require('jsonwebtoken');
const config = require('../config/app');
const logger = require('../utils/logger');

/**
 * Middleware para verificar o token JWT nas requisições
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função para chamar o próximo middleware
 */
const authenticateToken = (req, res, next) => {
    // Obter o token do cabeçalho Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Acesso negado. Token não fornecido.'
        });
    }

    try {
        // Verificar e decodificar o token
        const decoded = jwt.verify(token, config.jwt.secret);

        // Adicionar o usuário decodificado à requisição
        req.user = decoded;

        // Seguir para o próximo middleware
        next();
    } catch (error) {
        logger.error('Erro ao verificar token JWT:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado. Faça login novamente.'
            });
        }

        return res.status(403).json({
            success: false,
            message: 'Token inválido.'
        });
    }
};

/**
 * Middleware para verificar permissões de roles do usuário
 * @param {Array} roles - Lista de roles permitidas
 */
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Não autenticado.'
            });
        }

        const { role } = req.user;

        if (!roles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: 'Permissão negada. Role não autorizada.'
            });
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    checkRole,
}; 