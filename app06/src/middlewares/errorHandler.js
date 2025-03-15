/**
 * Middleware para tratamento centralizado de erros
 * Captura erros lançados durante o processamento das requisições
 */
const errorHandler = (err, req, res, next) => {
    console.error('Erro:', err);
    
    // Verifica se o erro tem um código de status definido
    const statusCode = err.statusCode || 500;
    
    // Prepara a resposta de erro
    const errorResponse = {
        error: {
            message: err.message || 'Erro interno do servidor',
            status: statusCode,
            timestamp: new Date().toISOString()
        }
    };
    
    // Em ambiente de desenvolvimento, inclui a stack trace
    if (process.env.NODE_ENV !== 'production') {
        errorResponse.error.stack = err.stack;
    }
    
    // Envia a resposta de erro
    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler; 