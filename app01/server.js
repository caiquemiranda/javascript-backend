const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const { url, method } = req;

    // Definindo cabeçalhos para resposta HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    // Roteamento básico
    if (url === '/') {
        res.statusCode = 200;
        res.end(`
      <html>
        <head>
          <title>Servidor Node.js</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            h1 { color: #333; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <h1>Bem-vindo ao Servidor Node.js!</h1>
          <p>Este é um servidor HTTP básico criado com Node.js puro.</p>
          <p>Visite <a href="/info">/info</a> para ver informações do servidor.</p>
        </body>
      </html>
    `);
    } else if (url === '/info') {
        res.statusCode = 200;
        res.end(`
      <html>
        <head>
          <title>Informações do Servidor</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            h1 { color: #333; }
            p { color: #666; }
            code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <h1>Informações do Servidor</h1>
          <p>Método de requisição: <code>${method}</code></p>
          <p>URL acessada: <code>${url}</code></p>
          <p>Servidor rodando na porta: <code>${PORT}</code></p>
          <p><a href="/">Voltar para a página inicial</a></p>
        </body>
      </html>
    `);
    } else {
        res.statusCode = 404;
        res.end(`
      <html>
        <head>
          <title>Página não encontrada</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            h1 { color: #d9534f; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <h1>404 - Página não encontrada</h1>
          <p>A página que você está procurando não existe.</p>
          <p><a href="/">Voltar para a página inicial</a></p>
        </body>
      </html>
    `);
    }
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
}); 