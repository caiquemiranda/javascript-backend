/**
 * Middleware para tratamento centralizado de erros
 * @param {Error} err Objeto de erro
 * @param {Object} req Objeto de requisição
 * @param {Object} res Objeto de resposta
 * @param {Function} next Função next
 */
function errorHandler(err, req, res, next) {
    console.error('Erro:', err.message);
    console.error(err.stack);
    
    // Responde com status 500 e mensagem de erro
    res.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'production' ? undefined : err.message
    });
}

module.exports = errorHandler; 