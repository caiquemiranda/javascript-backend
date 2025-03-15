/**
 * Arquivo de rotas principal
 * Agrupa todas as rotas da aplicação
 */
const express = require('express');
const router = express.Router();
const path = require('path');

// Importação das rotas específicas
const tarefasRoutes = require('./tarefasRoutes');
const frasesRoutes = require('./frasesRoutes');
const livrosRoutes = require('./livrosRoutes');

// Rota principal - Página inicial
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Montagem das rotas específicas
router.use('/api/tarefas', tarefasRoutes);
router.use('/api/frases', frasesRoutes);
router.use('/api/livros', livrosRoutes);

// Rota de informações da API
router.get('/api', (req, res) => {
    res.json({
        nome: 'API Express.js',
        versao: '1.0.0',
        descricao: 'API RESTful implementada com Express.js',
        endpoints: {
            tarefas: '/api/tarefas',
            frases: '/api/frases',
            livros: '/api/livros'
        },
        documentacao: '/api/docs'
    });
});

// Rota para documentação da API
router.get('/api/docs', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Documentação da API</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                    h1 { color: #333; }
                    h2 { color: #555; margin-top: 30px; }
                    code { background-color: #f4f4f4; padding: 5px; border-radius: 4px; }
                    pre { background-color: #f4f4f4; padding: 15px; border-radius: 4px; overflow-x: auto; }
                    .endpoint { margin-bottom: 15px; }
                    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                </style>
            </head>
            <body>
                <h1>Documentação da API</h1>
                <p>Esta API fornece acesso a tarefas, frases motivacionais e livros.</p>
                
                <h2>Endpoints Disponíveis</h2>
                
                <h3>Tarefas</h3>
                <ul>
                    <li><code>GET /api/tarefas</code> - Listar todas as tarefas</li>
                    <li><code>GET /api/tarefas/:id</code> - Obter uma tarefa específica</li>
                    <li><code>POST /api/tarefas</code> - Criar uma nova tarefa</li>
                    <li><code>PUT /api/tarefas/:id</code> - Atualizar uma tarefa existente</li>
                    <li><code>DELETE /api/tarefas/:id</code> - Remover uma tarefa</li>
                </ul>
                
                <h3>Frases Motivacionais</h3>
                <ul>
                    <li><code>GET /api/frases</code> - Listar todas as frases</li>
                    <li><code>GET /api/frases/aleatoria</code> - Obter uma frase aleatória</li>
                    <li><code>GET /api/frases/:id</code> - Obter uma frase específica</li>
                    <li><code>POST /api/frases</code> - Criar uma nova frase</li>
                    <li><code>PUT /api/frases/:id</code> - Atualizar uma frase existente</li>
                    <li><code>DELETE /api/frases/:id</code> - Remover uma frase</li>
                </ul>
                
                <h3>Livros</h3>
                <ul>
                    <li><code>GET /api/livros</code> - Listar todos os livros</li>
                    <li><code>GET /api/livros/busca?q=termo</code> - Buscar livros por termo</li>
                    <li><code>GET /api/livros/:id</code> - Obter um livro específico</li>
                    <li><code>POST /api/livros</code> - Criar um novo livro</li>
                    <li><code>PUT /api/livros/:id</code> - Atualizar um livro existente</li>
                    <li><code>DELETE /api/livros/:id</code> - Remover um livro</li>
                </ul>
                
                <h2>Exemplos de Uso</h2>
                
                <h3>Criar uma nova tarefa</h3>
                <pre>
POST /api/tarefas
Content-Type: application/json

{
    "descricao": "Estudar Express.js"
}
                </pre>
                
                <h3>Obter uma frase aleatória</h3>
                <pre>
GET /api/frases/aleatoria
                </pre>
                
                <h3>Buscar livros por termo</h3>
                <pre>
GET /api/livros/busca?q=Ficção
                </pre>
                
                <footer style="margin-top: 50px; color: #777; font-size: 0.9em;">
                    <p>App 6 - Introdução ao Express.js | Node.js & Express</p>
                </footer>
            </body>
        </html>
    `);
});

module.exports = router; 