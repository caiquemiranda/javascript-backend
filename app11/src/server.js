/**
 * Servidor principal da aplicação
 */
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const routes = require('./routes');
const { testConnection } = require('./database');
const { handleSequelizeError, handleError } = require('./middlewares/errorHandler');
const appConfig = require('./config/app');
const logger = require('./utils/logger');
const { initialize } = require('./utils/init');

// Inicializar aplicação
initialize();

// Criar aplicação Express
const app = express();

// Configurações de segurança
app.use(helmet());

// Configurações de CORS
app.use(cors(appConfig.cors));

// Parser para JSON e URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Configuração de logs HTTP
if (appConfig.env === 'production') {
    // Em produção, logs em arquivo
    const accessLogStream = fs.createWriteStream(
        path.join('logs', 'access.log'),
        { flags: 'a' }
    );
    app.use(morgan('combined', { stream: accessLogStream }));
} else {
    // Em desenvolvimento, logs coloridos no console
    app.use(morgan('dev'));
}

// Rotas da API
app.use('/api', routes);

// Middlewares de erro
app.use(handleSequelizeError);
app.use(handleError);

// Iniciar servidor
const startServer = async () => {
    try {
        // Testar conexão com o banco
        await testConnection();

        // Iniciar servidor
        app.listen(appConfig.port, () => {
            logger.info(`Servidor rodando na porta ${appConfig.port}`);
            logger.info(`Ambiente: ${appConfig.env}`);
        });
    } catch (error) {
        logger.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    }
};

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
    logger.error('Erro não capturado:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    logger.error('Promise rejeitada não tratada:', error);
    process.exit(1);
});

// Iniciar servidor
startServer();

// Exportar app para testes
module.exports = app; 