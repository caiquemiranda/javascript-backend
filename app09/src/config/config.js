/**
 * Configurações do sistema
 */

// Importação de dependências
require('dotenv').config();

// Configuração principal
const config = {
    // Configuração do servidor
    server: {
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || 'development'
    },

    // Configuração do banco de dados
    database: {
        path: process.env.DB_PATH || './data/database.sqlite',
    },

    // Configuração JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'chave_super_secreta_temporaria_nao_use_em_producao',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },

    // Outras configurações
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    },

    // Configuração de logs
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
    }
};

// Validações básicas
if (config.server.environment === 'production' &&
    config.jwt.secret === 'chave_super_secreta_temporaria_nao_use_em_producao') {
    console.warn('AVISO: Você está usando uma chave JWT padrão em ambiente de produção. Configure uma chave segura.');
}

module.exports = config; 