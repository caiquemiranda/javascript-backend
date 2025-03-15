const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Função para ler arquivos de forma assíncrona
function lerArquivo(caminhoArquivo) {
    return new Promise((resolve, reject) => {
        fs.readFile(caminhoArquivo, 'utf8', (err, conteudo) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(conteudo);
        });
    });
}

// Função para listar arquivos em um diretório
function listarArquivos(diretorio) {
    return new Promise((resolve, reject) => {
        fs.readdir(diretorio, (err, arquivos) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(arquivos);
        });
    });
}

const server = http.createServer(async (req, res) => {
    const { url } = req;

    // Definir cabeçalho para resposta HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    try {
        // Roteamento
        if (url === '/' || url === '/home') {
            const conteudo = await lerArquivo(path.join(__dirname, 'public', 'index.html'));
            res.statusCode = 200;
            res.end(conteudo);
        }
        else if (url === '/sobre') {
            const conteudo = await lerArquivo(path.join(__dirname, 'public', 'sobre.html'));
            res.statusCode = 200;
            res.end(conteudo);
        }
        else if (url === '/contato') {
            const conteudo = await lerArquivo(path.join(__dirname, 'public', 'contato.html'));
            res.statusCode = 200;
            res.end(conteudo);
        }
        else if (url === '/arquivos') {
            // Lista os arquivos da pasta 'public'
            const arquivos = await listarArquivos(path.join(__dirname, 'public'));

            let html = `
        <html>
          <head>
            <title>Lista de Arquivos</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              h1 { color: #333; }
              ul { list-style-type: none; padding: 0; }
              li { padding: 8px; margin-bottom: 5px; background-color: #f5f5f5; border-radius: 4px; }
              a { color: #0066cc; text-decoration: none; }
              a:hover { text-decoration: underline; }
              .menu { margin-bottom: 20px; padding: 10px; background-color: #333; }
              .menu a { color: white; margin-right: 15px; }
            </style>
          </head>
          <body>
            <div class="menu">
              <a href="/">Home</a>
              <a href="/sobre">Sobre</a>
              <a href="/contato">Contato</a>
              <a href="/arquivos">Arquivos</a>
            </div>
            <h1>Lista de Arquivos do Diretório Public</h1>
            <ul>
      `;

            arquivos.forEach(arquivo => {
                html += `<li>${arquivo}</li>`;
            });

            html += `
            </ul>
          </body>
        </html>
      `;

            res.statusCode = 200;
            res.end(html);
        }
        else {
            // Tenta servir arquivo estático se existir
            try {
                const filePath = path.join(__dirname, 'public', url);
                const conteudo = await lerArquivo(filePath);

                // Identifica o tipo de conteúdo baseado na extensão do arquivo
                const ext = path.extname(url);
                let contentType = 'text/html';

                switch (ext) {
                    case '.css':
                        contentType = 'text/css';
                        break;
                    case '.js':
                        contentType = 'text/javascript';
                        break;
                    case '.json':
                        contentType = 'application/json';
                        break;
                    case '.png':
                        contentType = 'image/png';
                        break;
                    case '.jpg':
                    case '.jpeg':
                        contentType = 'image/jpeg';
                        break;
                }

                res.setHeader('Content-Type', contentType);
                res.statusCode = 200;
                res.end(conteudo);
            } catch (erro) {
                // Se não encontrar o arquivo, retorna 404
                res.statusCode = 404;
                const conteudo = await lerArquivo(path.join(__dirname, 'public', '404.html'));
                res.end(conteudo);
            }
        }
    } catch (erro) {
        console.error('Erro:', erro);
        res.statusCode = 500;
        res.end(`
      <html>
        <head>
          <title>Erro Interno</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            h1 { color: #d9534f; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <h1>500 - Erro Interno do Servidor</h1>
          <p>Ocorreu um erro ao processar sua solicitação.</p>
          <p><a href="/">Voltar para a página inicial</a></p>
        </body>
      </html>
    `);
    }
});

// Inicializa o servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
}); 