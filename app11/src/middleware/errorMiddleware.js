const logger = require('../utils/logger');

/**
 * Middleware para rotas não encontradas (404)
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função para chamar o próximo middleware
 */
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Rota não encontrada: ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

/**
 * Middleware para validação de erros do Sequelize
 * @param {Error} err - Objeto de erro
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função para chamar o próximo middleware
 */
const sequelizeErrorHandler = (err, req, res, next) => {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        const errors = err.errors.map(error => ({
            field: error.path,
            message: error.message
        }));

        return res.status(400).json({
            success: false,
            message: 'Erro de validação',
            errors
        });
    }

    if (err.name === 'SequelizeDatabaseError') {
        logger.error('Erro de banco de dados:', err);
        return res.status(500).json({
            success: false,
            message: 'Erro de banco de dados',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno'
        });
    }

    next(err);
};

/**
 * Middleware para tratamento de erros de validação do Express-Validator
 * @param {Error} err - Objeto de erro
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função para chamar o próximo middleware
 */
const validationErrorHandler = (err, req, res, next) => {
    if (err.array && typeof err.array === 'function') {
        const errors = err.array();
        return res.status(400).json({
            success: false,
            message: 'Erro de validação',
            errors
        });
    }

    next(err);
};

/**
 * Middleware para tratamento global de erros
 * @param {Error} err - Objeto de erro
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função para chamar o próximo middleware
 */
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Erro interno do servidor';

    // Log do erro
    logger.error(`[${statusCode}] ${message}`, {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        stack: err.stack
    });

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = {
    notFoundHandler,
    sequelizeErrorHandler,
    validationErrorHandler,
    globalErrorHandler
}; 