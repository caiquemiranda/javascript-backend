const express = require('express');
const path = require('path');
const produtosRoutes = require('./routes/produtosRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Inicializa o app Express
const app = express();

// Middleware para processar JSON
app.use(express.json());

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api/produtos', produtosRoutes);

// Rota principal - serve o arquivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware para rotas não encontradas
app.use(notFound);

// Middleware para tratamento de erros
app.use(errorHandler);

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});

module.exports = app; 