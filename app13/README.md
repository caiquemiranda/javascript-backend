# Lista de Tarefas com React e Express

Aplicação simples de lista de tarefas com API REST no backend e React no frontend.

## Estrutura do Projeto

- `/api` - Backend construído com Express
- `/client` - Frontend construído com React

## Funcionalidades

- Listar todas as tarefas
- Adicionar novas tarefas
- Marcar tarefas como concluídas
- Remover tarefas

## Instalação e Execução

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

O servidor estará disponível em `http://localhost:3001`

### Frontend (Cliente)

1. Em um novo terminal, navegue até a pasta do cliente:
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

O frontend estará disponível em `http://localhost:3000`

## Endpoints da API

- `GET /api/tarefas` - Retorna todas as tarefas
- `GET /api/tarefas/:id` - Retorna uma tarefa específica
- `POST /api/tarefas` - Cria uma nova tarefa
- `PUT /api/tarefas/:id` - Atualiza uma tarefa existente
- `DELETE /api/tarefas/:id` - Remove uma tarefa

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- CORS
- Body Parser

### Frontend
- React
- Axios
- CSS
- Font Awesome (para ícones) 