/**
 * Middleware para autenticação JWT
 */
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const userModel = require('../models/userModel');

/**
 * Middleware que verifica se o token JWT é válido
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
            message: 'Token de autenticação não fornecido'
        });
    }

    try {
        // Verificar e decodificar o token
        const decoded = jwt.verify(token, jwtConfig.secret, jwtConfig.options);

        // Obter o usuário correspondente
        const user = userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        // Adicionar o usuário à requisição (sem a senha)
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado. Faça login novamente'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro ao verificar token',
            error: error.message
        });
    }
};

/**
 * Middleware que verifica se o usuário é um administrador
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função para chamar o próximo middleware
 */
const requireAdmin = (req, res, next) => {
    // O middleware authenticateToken deve ser executado antes
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Usuário não autenticado'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Acesso negado. Apenas administradores podem acessar este recurso'
        });
    }

    next();
};

module.exports = {
    authenticateToken,
    requireAdmin
}; 