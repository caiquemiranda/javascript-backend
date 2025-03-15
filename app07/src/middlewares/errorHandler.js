/**
 * Middleware para tratamento centralizado de erros
 * @param {Error} err Objeto de erro
 * @param {Object} req Objeto de requisição Express
 * @param {Object} res Objeto de resposta Express
 * @param {Function} next Função para passar para o próximo middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Erro não tratado:', err);

    // Status padrão de erro interno do servidor
    const statusCode = err.statusCode || 500;

    // Resposta de erro
    const errorResponse = {
        success: false,
        error: err.type || 'Erro interno do servidor',
        message: err.message || 'Ocorreu um erro ao processar a solicitação',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    };

    // Envia a resposta de erro
    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler; 