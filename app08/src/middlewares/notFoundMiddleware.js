/**
 * Middleware para tratamento de rotas não encontradas
 * Retorna um erro 404 quando uma rota não é encontrada
 */
const notFoundMiddleware = (req, res, next) => {
    const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

module.exports = notFoundMiddleware; 