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

const config = require('./config/app');
const logger = require('./utils/logger');
const apiRoutes = require('./routes');
const {
    sequelizeErrorHandler,
    validationErrorHandler,
    globalErrorHandler
} = require('./middleware/errorMiddleware');
const { testConnection } = require('./database');

// Inicializar aplicação Express
const app = express();

// Configurar middlewares de segurança e utilidades
app.use(helmet());
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar logs de requisição HTTP
if (config.server.nodeEnv === 'production') {
    // Em produção, registrar logs em um arquivo
    const accessLogStream = fs.createWriteStream(
        path.join(__dirname, '../logs/access.log'),
        { flags: 'a' }
    );
    app.use(morgan('combined', { stream: accessLogStream }));
} else {
    // Em desenvolvimento, registrar logs no console
    app.use(morgan('dev'));
}

// Configurar rotas da API
app.use('/api', apiRoutes);

// Rota raiz para informações básicas
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API REST com PostgreSQL e estrutura MVC',
        docs: '/api'
    });
});

// Middlewares de tratamento de erros
app.use(validationErrorHandler);
app.use(sequelizeErrorHandler);
app.use(globalErrorHandler);

// Iniciar servidor
const PORT = config.server.port;

const startServer = async () => {
    try {
        // Testar conexão com o banco de dados
        const dbConnected = await testConnection();

        if (!dbConnected) {
            logger.error('Falha ao conectar ao banco de dados. Verifique as configurações.');
            process.exit(1);
        }

        // Iniciar servidor
        app.listen(PORT, () => {
            logger.info(`Servidor rodando na porta ${PORT} em modo ${config.server.nodeEnv}`);
            logger.info(`Acesse: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        logger.error('Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
};

// Iniciar o servidor
startServer();

// Tratamento de exceções não capturadas
process.on('uncaughtException', (error) => {
    logger.error('Exceção não capturada:', error);
    // Em um ambiente de produção real, você pode querer notificar administradores
    // e possivelmente reiniciar o processo
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Rejeição de promessa não tratada:', reason);
});

// Exportar o app para testes
module.exports = app; 