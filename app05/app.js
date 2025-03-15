const express = require('express');
const path = require('path');
const livroRoutes = require('./routes/livroRoutes');

// Inicialização do Express
const app = express();
const PORT = 3000;

// Middleware para processar JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requisições
app.use((req, res, next) => {
    const dataHora = new Date().toISOString();
    console.log(`[${dataHora}] ${req.method} ${req.url}`);
    next();
});

// Rota principal - Página inicial simples
app.get('/', (req, res) => {
    res.send(`
    <html>
      <head>
        <title>API de Livros com Persistência em Arquivo</title>
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
        <h1>API de Livros com Persistência em Arquivo</h1>
        <p>Bem-vindo à API de Livros. Esta API permite gerenciar livros utilizando persistência em arquivos JSON.</p>
        
        <h2>Funcionalidades</h2>
        <ul>
          <li>Criar, ler, atualizar e excluir livros (CRUD)</li>
          <li>Buscar livros por termo</li>
          <li>Persistência de dados em arquivo JSON</li>
          <li>Validação básica de dados</li>
        </ul>
        
        <h2>Endpoints Disponíveis</h2>
        
        <table>
          <tr>
            <th>Método</th>
            <th>Rota</th>
            <th>Descrição</th>
          </tr>
          <tr>
            <td>GET</td>
            <td>/api/livros</td>
            <td>Obter todos os livros</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/api/livros/:id</td>
            <td>Obter um livro específico pelo ID</td>
          </tr>
          <tr>
            <td>GET</td>
            <td>/api/livros/busca/termo?q=termo</td>
            <td>Buscar livros por termo</td>
          </tr>
          <tr>
            <td>POST</td>
            <td>/api/livros</td>
            <td>Adicionar um novo livro</td>
          </tr>
          <tr>
            <td>PUT</td>
            <td>/api/livros/:id</td>
            <td>Atualizar um livro existente</td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>/api/livros/:id</td>
            <td>Remover um livro</td>
          </tr>
        </table>
        
        <h2>Exemplos de Uso</h2>
        
        <div class="endpoint">
          <h3>Adicionar um novo livro</h3>
          <code>POST /api/livros</code>
          <p>Body:</p>
          <pre>
{
  "titulo": "O Hobbit",
  "autor": "J.R.R. Tolkien",
  "ano": 1937,
  "genero": "Fantasia",
  "paginas": 310
}
          </pre>
        </div>
        
        <div class="endpoint">
          <h3>Atualizar um livro</h3>
          <code>PUT /api/livros/1</code>
          <p>Body:</p>
          <pre>
{
  "paginas": 320,
  "genero": "Fantasia Épica"
}
          </pre>
        </div>
        
        <div class="endpoint">
          <h3>Buscar livros por termo</h3>
          <code>GET /api/livros/busca/termo?q=Tolkien</code>
        </div>
        
        <footer style="margin-top: 50px; color: #777; font-size: 0.9em;">
          <p>App 5 - Leitura e Escrita de Arquivos com Node.js (fs) | Node.js & Express</p>
        </footer>
      </body>
    </html>
  `);
});

// Montar o router de livros no caminho /api/livros
app.use('/api/livros', livroRoutes);

// Middleware para tratamento de rotas não encontradas
app.use((req, res, next) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        mensagem: 'A rota solicitada não existe nesta API'
    });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
        erro: 'Erro interno do servidor',
        mensagem: 'Ocorreu um erro ao processar a solicitação'
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
}); 