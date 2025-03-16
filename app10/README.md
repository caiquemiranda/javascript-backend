# Upload de Arquivos com Multer

Sistema para upload e gerenciamento de imagens e documentos com interface web, utilizando Express.js e Multer.

## Funcionalidades

- Upload de imagem única
- Upload de múltiplas imagens
- Upload de documentos (PDF, DOC, DOCX, TXT)
- Listagem de arquivos enviados
- Visualização de imagens
- Download de documentos
- Exclusão de arquivos
- Interface web responsiva e intuitiva

## Pré-requisitos

- Node.js (v14+)
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/javascript-backend.git
cd javascript-backend/app10
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Crie as pastas para armazenamento de arquivos:
```bash
mkdir -p uploads/images uploads/documents
```

4. Inicie o servidor:
```bash
npm start
# ou
yarn start
```

5. Acesse a aplicação em seu navegador:
```
http://localhost:3000
```

## Estrutura do Projeto

```
app10/
├── public/                  # Arquivos estáticos
│   ├── css/                 # Estilos CSS
│   ├── js/                  # Scripts JavaScript
│   └── index.html           # Página principal
├── src/                     # Código-fonte
│   ├── controllers/         # Controladores
│   ├── middleware/          # Middlewares
│   ├── routes/              # Rotas da API
│   ├── utils/               # Utilitários
│   └── server.js            # Arquivo principal do servidor
├── uploads/                 # Diretório para armazenar arquivos enviados
│   ├── images/              # Imagens enviadas
│   └── documents/           # Documentos enviados
├── package.json             # Dependências e scripts
└── README.md                # Documentação
```

## API Endpoints

### Imagens

- **GET /api/files/images** - Lista todas as imagens enviadas
- **POST /api/files/images/upload** - Upload de uma imagem única
- **POST /api/files/images/multiple** - Upload de múltiplas imagens
- **DELETE /api/files/images/:filename** - Exclui uma imagem pelo nome do arquivo

### Documentos

- **GET /api/files/documents** - Lista todos os documentos enviados
- **POST /api/files/documents/upload** - Upload de um documento
- **DELETE /api/files/documents/:filename** - Exclui um documento pelo nome do arquivo

## Tecnologias Utilizadas

- **Express.js**: Framework web para Node.js
- **Multer**: Middleware para manipulação de `multipart/form-data`
- **Cors**: Middleware para habilitar CORS
- **Morgan**: Middleware para logging de requisições HTTP
- **HTML/CSS/JavaScript**: Frontend da aplicação

## Conceitos Aprendidos

- Manipulação de arquivos no servidor com Node.js
- Configuração e uso do Multer para upload de arquivos
- Validação de tipos de arquivos e limites de tamanho
- Armazenamento de arquivos em disco
- Streaming de arquivos para download
- Manipulação do DOM e Fetch API no frontend
- Prévia de imagens e documentos antes do upload
- Gerenciamento de estado da interface

## Limitações e Melhorias Futuras

- Implementar autenticação de usuários
- Adicionar suporte para mais tipos de arquivos
- Implementar compressão de imagens
- Adicionar suporte para armazenamento em nuvem (AWS S3, Google Cloud Storage)
- Melhorar a segurança com verificação de conteúdo malicioso

## Licença

Este projeto é para fins educacionais. 