# App 3 - Servidor com Express.js e API REST

## Descrição
Este projeto implementa um servidor web utilizando o framework Express.js e cria uma API REST para gerenciamento de tarefas. Inclui uma interface de usuário para interagir com a API.

## Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (versão 12.x ou superior)

### Instalação
1. Clone o repositório
2. Navegue até a pasta do projeto:
   ```
   cd app03
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

## O Que Este Projeto Ensina

### Conceitos Abordados
- Criação de um servidor web com Express.js
- Implementação de uma API REST completa (CRUD)
- Uso de middlewares no Express
- Manipulação de requisições e respostas HTTP
- Roteamento no Express
- Servir arquivos estáticos
- Manipulação de dados em memória
- Integração de frontend com backend via API
- Tratamento de erros e respostas de status HTTP

### Estrutura do Projeto
- `app.js`: Arquivo principal que contém o código do servidor Express
- `package.json`: Metadados e dependências do projeto
- `public/`: Diretório contendo arquivos estáticos:
  - `index.html`: Interface de usuário principal
  - `css/style.css`: Estilos da aplicação
  - `js/app.js`: Código JavaScript do frontend
  - `404.html`: Página de erro para rotas não encontradas
  - `500.html`: Página de erro para erros internos do servidor

### Funcionalidades Implementadas
- API REST com endpoints para:
  - Listar todas as tarefas
  - Obter uma tarefa específica
  - Criar uma nova tarefa
  - Atualizar uma tarefa existente
  - Excluir uma tarefa
- Interface de usuário para:
  - Visualizar tarefas
  - Adicionar novas tarefas
  - Marcar tarefas como concluídas/não concluídas
  - Excluir tarefas
  - Filtrar tarefas por status
- Middleware para logging de requisições
- Middleware para tratamento de erros
- Middleware para rotas não encontradas

## Próximos Passos
Para evoluir seus conhecimentos após este projeto, considere:
- Implementar persistência de dados com um banco de dados (MongoDB, SQLite, etc.)
- Adicionar autenticação de usuários
- Organizar o código em uma estrutura MVC
- Implementar validação de dados com bibliotecas como Joi ou express-validator
- Adicionar testes automatizados 