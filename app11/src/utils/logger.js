const winston = require('winston');
const config = require('../config/app');

// Configuração de formato para logs
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Criação do logger
const logger = winston.createLogger({
    level: config.logging.level,
    format: logFormat,
    transports: [
        // Console em ambiente de desenvolvimento
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        // Arquivo de log para erros
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        // Arquivo de log para todos os níveis
        new winston.transports.File({
            filename: 'logs/combined.log'
        }),
    ],
});

// Em produção, envie logs para um serviço externo, se necessário
if (config.server.nodeEnv === 'production') {
    // Aqui você pode adicionar transports para serviços de log como
    // Loggly, Papertrail, AWS CloudWatch, etc.
}

module.exports = logger; 