const express = require('express');
const path = require('path');
const frasesRouter = require('./routes/frases');

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
        <title>API de Frases Motivacionais</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; }
          h2 { color: #555; margin-top: 30px; }
          code { background-color: #f4f4f4; padding: 5px; border-radius: 4px; }
          pre { background-color: #f4f4f4; padding: 15px; border-radius: 4px; overflow-x: auto; }
          .endpoint { margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <h1>API de Frases Motivacionais</h1>
        <p>Bem-vindo à API de Frases Motivacionais. Esta API permite gerenciar frases motivacionais através dos seguintes endpoints:</p>
        
        <h2>Endpoints Disponíveis</h2>
        
        <div class="endpoint">
          <code>GET /api/frases</code>
          <p>Retorna todas as frases motivacionais.</p>
        </div>
        
        <div class="endpoint">
          <code>GET /api/frases/aleatoria</code>
          <p>Retorna uma frase aleatória.</p>
        </div>
        
        <div class="endpoint">
          <code>GET /api/frases/:id</code>
          <p>Retorna uma frase específica pelo ID.</p>
        </div>
        
        <div class="endpoint">
          <code>POST /api/frases</code>
          <p>Adiciona uma nova frase. Requer um corpo JSON com os campos <code>texto</code> e opcionalmente <code>autor</code>.</p>
          <pre>
{
  "texto": "Sua frase motivacional aqui",
  "autor": "Nome do Autor"
}
          </pre>
        </div>
        
        <div class="endpoint">
          <code>PUT /api/frases/:id</code>
          <p>Atualiza uma frase existente. Requer um corpo JSON com os campos a serem atualizados.</p>
          <pre>
{
  "texto": "Novo texto da frase",
  "autor": "Novo autor"
}
          </pre>
        </div>
        
        <div class="endpoint">
          <code>DELETE /api/frases/:id</code>
          <p>Remove uma frase pelo ID.</p>
        </div>
        
        <h2>Exemplo de Uso</h2>
        <p>Você pode testar a API usando ferramentas como Postman, Insomnia ou curl, ou através de requisições fetch do JavaScript.</p>
        
        <footer style="margin-top: 50px; color: #777; font-size: 0.9em;">
          <p>App 4 - API de Frases com Rotas Dinâmicas | Node.js & Express</p>
        </footer>
      </body>
    </html>
  `);
});

// Montar o router de frases no caminho /api/frases
app.use('/api/frases', frasesRouter);

// Middleware para tratamento de rotas não encontradas
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        message: 'A rota solicitada não existe nesta API'
    });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro ao processar a solicitação'
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
}); 