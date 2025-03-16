const winston = require('winston');
const path = require('path');
const appConfig = require('./app');

// Definir níveis de log personalizados
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

// Definir cores para cada nível
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
};

// Adicionar cores ao Winston
winston.addColors(colors);

// Definir formato do log
const format = winston.format.combine(
    // Adicionar timestamp
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    // Adicionar colorização
    winston.format.colorize({ all: true }),
    // Definir formato da mensagem
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

// Definir transportes (destinos) dos logs
const transports = [
    // Console
    new winston.transports.Console({
        format: format
    }),
    // Arquivo de erros
    new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error',
        format: winston.format.combine(
            winston.format.uncolorize(),
            winston.format.json()
        )
    }),
    // Arquivo com todos os logs
    new winston.transports.File({
        filename: path.join('logs', 'combined.log'),
        format: winston.format.combine(
            winston.format.uncolorize(),
            winston.format.json()
        )
    })
];

// Criar logger
const logger = winston.createLogger({
    level: appConfig.logging.level,
    levels,
    format,
    transports
});

// Se não estiver em produção, log para console com cores
if (appConfig.env !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

module.exports = logger; 