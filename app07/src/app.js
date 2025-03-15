/**
 * Aplicação principal
 * API de produtos com CRUD completo usando Express.js e persistência em JSON
 */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Importação de middlewares
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

// Importação de rotas
const produtosRoutes = require('./routes/produtosRoutes');

// Inicialização do Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev')); // Logging de requisições HTTP

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rota principal - Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Informações da API
app.get('/api', (req, res) => {
    res.json({
        nome: 'API de Produtos',
        versao: '1.0.0',
        descricao: 'API RESTful para gerenciamento de produtos com persistência em JSON',
        endpoints: {
            produtos: '/api/produtos'
        },
        documentacao: '/api/docs'
    });
});

// Documentação da API
app.get('/api/docs', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Documentação da API de Produtos</title>
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
                <h1>Documentação da API de Produtos</h1>
                <p>Esta API permite gerenciar produtos com operações CRUD completas.</p>
                
                <h2>Endpoints Disponíveis</h2>
                
                <table>
                    <tr>
                        <th>Método</th>
                        <th>Rota</th>
                        <th>Descrição</th>
                    </tr>
                    <tr>
                        <td>GET</td>
                        <td>/api/produtos</td>
                        <td>Listar todos os produtos</td>
                    </tr>
                    <tr>
                        <td>GET</td>
                        <td>/api/produtos/:id</td>
                        <td>Obter um produto específico</td>
                    </tr>
                    <tr>
                        <td>GET</td>
                        <td>/api/produtos/busca?termo=xyz</td>
                        <td>Buscar produtos por termo</td>
                    </tr>
                    <tr>
                        <td>POST</td>
                        <td>/api/produtos</td>
                        <td>Criar um novo produto</td>
                    </tr>
                    <tr>
                        <td>PUT</td>
                        <td>/api/produtos/:id</td>
                        <td>Atualizar um produto existente</td>
                    </tr>
                    <tr>
                        <td>DELETE</td>
                        <td>/api/produtos/:id</td>
                        <td>Remover um produto</td>
                    </tr>
                </table>
                
                <h2>Exemplos de Uso</h2>
                
                <h3>Criar um novo produto</h3>
                <pre>
POST /api/produtos
Content-Type: application/json

{
    "nome": "Smartphone XYZ",
    "descricao": "Smartphone com 128GB de armazenamento",
    "preco": 1299.99,
    "estoque": 50,
    "categoria": "Eletrônicos"
}
                </pre>
                
                <h3>Atualizar um produto</h3>
                <pre>
PUT /api/produtos/1
Content-Type: application/json

{
    "preco": 1199.99,
    "estoque": 45
}
                </pre>
                
                <h3>Buscar produtos por termo</h3>
                <pre>
GET /api/produtos/busca?termo=smartphone
                </pre>
                
                <footer style="margin-top: 50px; color: #777; font-size: 0.9em;">
                    <p>App 7 - CRUD completo com Express.js e dados em arquivo JSON | Node.js & Express</p>
                </footer>
            </body>
        </html>
    `);
});

// Montar as rotas
app.use('/api/produtos', produtosRoutes);

// Middleware para rotas não encontradas
app.use(notFound);

// Middleware para tratamento de erros
app.use(errorHandler);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Documentação disponível em http://localhost:${PORT}/api/docs`);
}); 