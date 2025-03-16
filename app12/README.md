# Sistema de Tarefas (Todo List)

Um simples sistema de gerenciamento de tarefas com backend API REST e frontend React.

## Estrutura do Projeto

O projeto está dividido em duas partes:

- `api`: Backend com Node.js e Express
- `client`: Frontend com React

## Como executar

### Backend (API)

1. Navegue até a pasta da API:
```
cd api
```

2. Instale as dependências:
```
npm install
```

3. Inicie o servidor:
```
npm run dev
```

O servidor estará executando em http://localhost:3001

### Frontend (Cliente)

1. Em outro terminal, navegue até a pasta do cliente:
```
cd client
```

2. Instale as dependências:
```
npm install
```

3. Inicie a aplicação React:
```
npm start
```

O frontend estará disponível em http://localhost:3000

## API Endpoints

- `GET /api/tasks`: Retorna todas as tarefas
- `GET /api/tasks/:id`: Retorna uma tarefa específica
- `POST /api/tasks`: Cria uma nova tarefa
- `PUT /api/tasks/:id`: Atualiza uma tarefa existente
- `DELETE /api/tasks/:id`: Remove uma tarefa

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- CORS
- Body Parser

### Frontend
- React
- Axios (para requisições HTTP)
- CSS (para estilização) 