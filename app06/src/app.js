/**
 * Aplicação principal
 * Configura e inicializa o servidor Express
 */
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

// Middlewares personalizados
const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

// Rotas
const routes = require('./routes');

// Inicialização do Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev')); // Logging de requisições HTTP
app.use(logger); // Logging personalizado

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Montar as rotas
app.use('/', routes);

// Middleware para rotas não encontradas
app.use(notFound);

// Middleware para tratamento de erros
app.use(errorHandler);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Documentação disponível em http://localhost:${PORT}/api/docs`);
}); 