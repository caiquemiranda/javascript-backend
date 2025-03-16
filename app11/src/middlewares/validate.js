const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Middleware para validar os dados da requisição usando express-validator
 * @param {Array} validations - Array de validações do express-validator
 */
const validate = (validations) => {
    return async (req, res, next) => {
        try {
            // Executar todas as validações
            await Promise.all(validations.map(validation => validation.run(req)));

            // Verificar se há erros
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.warn('Erro de validação:', errors.array());
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            next();
        } catch (error) {
            logger.error('Erro no middleware de validação:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    };
};

module.exports = validate; 