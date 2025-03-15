/**
 * Middleware para logging de requisições
 * Registra informações sobre cada requisição recebida
 */
const logger = (req, res, next) => {
    const dataHora = new Date().toISOString();
    const metodo = req.method;
    const url = req.url;
    const ip = req.ip || req.connection.remoteAddress;

    console.log(`[${dataHora}] ${metodo} ${url} - IP: ${ip}`);

    // Registra o tempo de resposta
    const inicio = Date.now();
    res.on('finish', () => {
        const duracao = Date.now() - inicio;
        const status = res.statusCode;
        console.log(`[${dataHora}] ${metodo} ${url} - Status: ${status} - Duração: ${duracao}ms`);
    });

    next();
};

module.exports = logger; 