/**
 * Middleware para tratamento de erros
 */

/**
 * Middleware que captura erros não tratados na aplicação
 * @param {Error} err O erro capturado
 * @param {Object} req Objeto de requisição
 * @param {Object} res Objeto de resposta
 * @param {Function} next Função para chamar o próximo middleware
 */
const errorHandler = (err, req, res, next) => {
    // Registra o erro no console (em ambiente de produção, poderia ser armazenado em um log)
    console.error(err.stack || err);

    // Status do erro (500 é o padrão para erros não tratados)
    const status = err.statusCode || 500;

    // Mensagem de erro
    let message = 'Erro interno do servidor';

    // Em ambiente de desenvolvimento, pode fornecer mais detalhes
    if (process.env.NODE_ENV === 'development') {
        message = err.message || message;
    }

    // Responde com o erro em formato JSON
    res.status(status).json({
        status: 'error',
        message,
        // Inclui detalhes apenas em ambiente de desenvolvimento
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err.details || err.errno || null
        })
    });
};

module.exports = errorHandler; 