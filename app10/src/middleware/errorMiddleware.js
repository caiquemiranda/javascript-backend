/**
 * Middleware para tratamento de erros
 */

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
 * Middleware para tratamento de erros
 * @param {Error} err - Objeto de erro
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função para chamar o próximo middleware
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Erro interno do servidor';

    // Log do erro (em produção, você pode usar um serviço de log mais robusto)
    console.error(`[${new Date().toISOString()}] ${statusCode} - ${message}`);
    if (err.stack) {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = {
    notFoundHandler,
    errorHandler
}; 