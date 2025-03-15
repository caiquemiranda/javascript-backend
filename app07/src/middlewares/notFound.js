/**
 * Middleware para tratamento de rotas não encontradas
 * @param {Object} req Objeto de requisição Express
 * @param {Object} res Objeto de resposta Express
 * @param {Function} next Função para passar para o próximo middleware
 */
const notFound = (req, res, next) => {
    const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
    error.statusCode = 404;
    error.type = 'NotFoundError';
    
    next(error);
};

module.exports = notFound; 