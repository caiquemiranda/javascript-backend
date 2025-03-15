/**
 * Middleware para tratar rotas não encontradas
 */

/**
 * Middleware que captura requisições para rotas não definidas na aplicação
 * @param {Object} req Objeto de requisição
 * @param {Object} res Objeto de resposta
 */
const notFound = (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Rota não encontrada',
        path: req.originalUrl
    });
};

module.exports = notFound; 