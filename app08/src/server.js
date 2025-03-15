/**
 * Servidor principal da API de tarefas com SQLite
 */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Importando rotas
const taskRoutes = require('./routes/taskRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const labelRoutes = require('./routes/labelRoutes');

// Importando middlewares
const errorMiddleware = require('./middlewares/errorMiddleware');
const notFoundMiddleware = require('./middlewares/notFoundMiddleware');

// Importação da configuração do banco de dados
const db = require('./config/database');

// Inicializa o Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(morgan('dev')); // Logging de requisições HTTP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rotas da API
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/labels', labelRoutes);

// Rota principal - Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Verifica a conexão com o banco de dados antes de iniciar o servidor
db.get("SELECT 1", (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
        process.exit(1);
    }

    // Iniciar o servidor
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
        console.log('Endpoints disponíveis:');
        console.log(' - http://localhost:' + PORT + '/api/tasks');
        console.log(' - http://localhost:' + PORT + '/api/categories');
        console.log(' - http://localhost:' + PORT + '/api/labels');
    });
});

module.exports = app; 