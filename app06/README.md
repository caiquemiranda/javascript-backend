# App 6 - Introdução ao Express.js

## Descrição
Este projeto implementa uma API RESTful utilizando o framework Express.js, consolidando as funcionalidades dos projetos anteriores em uma única aplicação organizada e modular. O foco principal é demonstrar a estruturação de uma aplicação Express.js com rotas separadas, middlewares e controladores.

## Conceitos Abordados
- **express.Router()**: Organização de rotas em arquivos separados
- **Middlewares**: Implementação e uso de middlewares personalizados
- **Estrutura de Rotas Separadas**: Separação de responsabilidades por domínio
- **Controladores**: Implementação da lógica de negócio em controladores específicos
- **Serviços Compartilhados**: Reutilização de código através de serviços

## Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (versão 12.x ou superior)

### Instalação
1. Clone o repositório
2. Navegue até a pasta do projeto:
   ```
   cd app06
   ```
3. Instale as dependências:
   ```
   npm install
   ```

### Execução
- Para iniciar o servidor normalmente:
  ```
  npm start
  ```
- Para iniciar o servidor com recarga automática (desenvolvimento):
  ```
  npm run dev
  ```

O servidor estará rodando em http://localhost:3000

## Estrutura do Projeto
```
app06/
├── src/
│   ├── middlewares/       # Middlewares personalizados
│   │   ├── logger.js      # Middleware de logging
│   │   ├── errorHandler.js # Middleware de tratamento de erros
│   │   └── notFound.js    # Middleware para rotas não encontradas
│   ├── routes/            # Rotas da aplicação
│   │   ├── index.js       # Arquivo principal de rotas
│   │   ├── tarefasRoutes.js # Rotas para tarefas
│   │   ├── frasesRoutes.js # Rotas para frases
│   │   └── livrosRoutes.js # Rotas para livros
│   ├── controllers/       # Controladores
│   │   ├── tarefasController.js # Controlador de tarefas
│   │   ├── frasesController.js # Controlador de frases
│   │   └── livrosController.js # Controlador de livros
│   ├── services/          # Serviços compartilhados
│   │   └── fileService.js # Serviço para manipulação de arquivos
│   ├── utils/             # Utilitários
│   │   └── responseFormatter.js # Formatador de respostas
│   └── app.js             # Arquivo principal da aplicação
├── public/                # Arquivos estáticos
│   ├── css/               # Estilos CSS
│   ├── js/                # Scripts JavaScript
│   └── index.html         # Página inicial
├── data/                  # Arquivos de dados
│   ├── tarefas.json       # Dados de tarefas
│   ├── frases.json        # Dados de frases
│   └── livros.json        # Dados de livros
├── package.json           # Metadados e dependências
└── README.md              # Documentação
```

## Endpoints da API

### Tarefas
- `GET /api/tarefas` - Listar todas as tarefas
- `GET /api/tarefas/:id` - Obter uma tarefa específica
- `POST /api/tarefas` - Criar uma nova tarefa
- `PUT /api/tarefas/:id` - Atualizar uma tarefa existente
- `DELETE /api/tarefas/:id` - Remover uma tarefa

### Frases Motivacionais
- `GET /api/frases` - Listar todas as frases
- `GET /api/frases/aleatoria` - Obter uma frase aleatória
- `GET /api/frases/:id` - Obter uma frase específica
- `POST /api/frases` - Criar uma nova frase
- `PUT /api/frases/:id` - Atualizar uma frase existente
- `DELETE /api/frases/:id` - Remover uma frase

### Livros
- `GET /api/livros` - Listar todos os livros
- `GET /api/livros/busca?q=termo` - Buscar livros por termo
- `GET /api/livros/:id` - Obter um livro específico
- `POST /api/livros` - Criar um novo livro
- `PUT /api/livros/:id` - Atualizar um livro existente
- `DELETE /api/livros/:id` - Remover um livro

## Documentação
A documentação completa da API está disponível em `/api/docs` quando o servidor estiver em execução.

## Benefícios do Express.js
- **Abstração de complexidades**: Simplifica o desenvolvimento de aplicações web
- **Organização de código**: Facilita a estruturação do projeto
- **Middlewares**: Sistema flexível para processamento de requisições
- **Roteamento**: Sistema de roteamento intuitivo e poderoso
- **Ecossistema**: Ampla variedade de plugins e extensões disponíveis
- **Performance**: Otimizado para aplicações web em Node.js

## Próximos Passos
- Implementar autenticação e autorização
- Integrar com banco de dados
- Adicionar testes automatizados
- Implementar documentação interativa com Swagger 