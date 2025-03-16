require('dotenv').config();

/**
 * Configurações gerais da aplicação
 */
module.exports = {
    // Ambiente da aplicação
    env: process.env.NODE_ENV || 'development',

    // Porta do servidor
    port: process.env.PORT || 3000,

    // URL base da API
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',

    // Configurações de CORS
    cors: {
        // Origens permitidas
        origin: process.env.CORS_ORIGIN || '*',
        // Métodos HTTP permitidos
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        // Headers permitidos
        allowedHeaders: ['Content-Type', 'Authorization'],
        // Expor headers
        exposedHeaders: ['X-Total-Count'],
        // Permitir credenciais
        credentials: true
    },

    // Configurações de rate limit
    rateLimit: {
        // Janela de tempo em minutos
        windowMs: 15 * 60 * 1000,
        // Número máximo de requisições por IP
        max: 100
    },

    // Configurações de log
    logging: {
        // Nível de log
        level: process.env.LOG_LEVEL || 'info',
        // Formato do timestamp
        timestamp: true
    },

    // Configurações de upload
    upload: {
        // Tamanho máximo do arquivo (em bytes)
        maxFileSize: 5 * 1024 * 1024, // 5MB
        // Tipos de arquivos permitidos
        allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
    }
}; 