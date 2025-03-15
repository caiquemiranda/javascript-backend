/**
 * Middleware para tratamento de erros
 * Captura erros lançados durante o processamento das requisições
 * e retorna uma resposta formatada para o cliente
 */
const errorMiddleware = (err, req, res, next) => {
    console.error('Erro:', err.message);
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor';

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

module.exports = errorMiddleware; 