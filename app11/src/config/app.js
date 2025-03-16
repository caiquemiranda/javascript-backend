require('dotenv').config();

module.exports = {
    // Configurações do servidor
    server: {
        port: parseInt(process.env.PORT || '3000', 10),
        nodeEnv: process.env.NODE_ENV || 'development',
    },

    // Configurações de log
    logging: {
        level: process.env.LOG_LEVEL || 'info',
    },

    // Configurações JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'sua_chave_secreta_aqui',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },

    // Configurações CORS
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }
}; 