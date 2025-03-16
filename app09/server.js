/**
 * Servidor principal da aplicação
 */

// Importações
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const config = require('./src/config/config');
const apiRoutes = require('./src/routes');
const { errorHandler } = require('./src/middleware/errorMiddleware');
const userModel = require('./src/models/userModel');

// Inicializar aplicação Express
const app = express();

// Configurar middlewares
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.logging.format));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar rotas da API
app.use('/api', apiRoutes);

// Rota principal para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicializar banco de dados e iniciar servidor
const startServer = async () => {
    try {
        // Garantir que o diretório de dados exista
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Inicializar banco de dados
        await userModel.initDatabase();

        // Iniciar servidor
        const PORT = config.server.port;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT} em modo ${config.server.environment}`);
            console.log(`Acesse: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
};

// Iniciar servidor
startServer(); 