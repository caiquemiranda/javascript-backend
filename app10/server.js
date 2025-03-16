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

// Inicializar aplicação Express
const app = express();

// Configurar middlewares
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.logging.format));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Servir arquivos enviados
app.use('/files/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/files/documents', express.static(path.join(__dirname, 'uploads/documents')));

// Configurar rotas da API
app.use('/api', apiRoutes);

// Rota principal para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Garantir que os diretórios de upload existam
const ensureUploadDirectories = () => {
    const directories = [
        path.join(__dirname, 'uploads'),
        path.join(__dirname, 'uploads/images'),
        path.join(__dirname, 'uploads/documents')
    ];

    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Diretório criado: ${dir}`);
        }
    });
};

// Iniciar servidor
const startServer = async () => {
    try {
        // Garantir que os diretórios de upload existam
        ensureUploadDirectories();

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