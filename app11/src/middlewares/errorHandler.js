const { ValidationError } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Middleware para tratamento de erros do Sequelize
 */
const handleSequelizeError = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        logger.warn('Erro de validação do Sequelize:', err);
        return res.status(400).json({
            success: false,
            message: 'Erro de validação',
            errors: err.errors.map(error => ({
                field: error.path,
                message: error.message
            }))
        });
    }
    next(err);
};

/**
 * Middleware para tratamento de erros gerais
 */
const handleError = (err, req, res, next) => {
    logger.error('Erro não tratado:', err);

    // Verificar se é um erro conhecido
    if (err.status) {
        return res.status(err.status).json({
            success: false,
            message: err.message
        });
    }

    // Erro desconhecido
    return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
    });
};

/**
 * Middleware para tratamento de rotas não encontradas
 */
const handleNotFound = (req, res) => {
    logger.warn(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
};

module.exports = {
    handleSequelizeError,
    handleError,
    handleNotFound
}; 