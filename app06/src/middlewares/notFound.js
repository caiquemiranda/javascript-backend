/**
 * Middleware para tratamento de rotas não encontradas
 * Captura requisições para rotas que não existem na aplicação
 */
const notFound = (req, res, next) => {
    const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
    error.statusCode = 404;

    next(error);
};

module.exports = notFound; 