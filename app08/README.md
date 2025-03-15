# API de Gerenciamento de Tarefas com SQLite

Este projeto é uma API RESTful para gerenciamento de tarefas que utiliza SQLite como banco de dados para persistência de dados.

## Funcionalidades

- Gerenciamento completo de tarefas (CRUD)
- Categorização de tarefas
- Sistema de etiquetas (tags)
- Filtragem por status de conclusão, categoria e prioridade
- Busca por texto em títulos e descrições
- Persistência de dados com SQLite

## Pré-requisitos

- Node.js (v14+)
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd app08
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
```bash
node src/database/migrate.js
```

4. Popule o banco com dados iniciais (opcional):
```bash
node src/database/seed.js
```

5. Inicie o servidor:
```bash
npm start
```

## Estrutura do Projeto

```
app08/
├── public/                 # Arquivos estáticos
│   ├── css/                # Estilos CSS
│   └── index.html          # Página inicial
├── src/                    # Código-fonte
│   ├── config/             # Configurações
│   │   └── database.js     # Configuração do SQLite
│   ├── controllers/        # Controladores
│   │   ├── tarefasController.js
│   │   ├── categoriasController.js
│   │   └── etiquetasController.js
│   ├── database/           # Scripts de banco de dados
│   │   ├── migrate.js      # Criação das tabelas
│   │   └── seed.js         # Dados iniciais
│   ├── middlewares/        # Middlewares
│   │   ├── errorHandler.js # Tratamento de erros
│   │   └── notFound.js     # Rotas não encontradas
│   ├── models/             # Modelos
│   │   ├── tarefaModel.js
│   │   ├── categoriaModel.js
│   │   └── etiquetaModel.js
│   ├── routes/             # Rotas
│   │   ├── index.js        # Índice de rotas
│   │   ├── tarefasRoutes.js
│   │   ├── categoriasRoutes.js
│   │   └── etiquetasRoutes.js
│   ├── utils/              # Utilitários
│   │   └── validador.js    # Validação de dados
│   └── server.js           # Arquivo principal do servidor
├── package.json            # Dependências e scripts
└── README.md               # Este arquivo
```

## Endpoints da API

### Tarefas

- `GET /api/tarefas` - Listar todas as tarefas (com filtros opcionais)
- `GET /api/tarefas/:id` - Obter uma tarefa específica
- `POST /api/tarefas` - Criar nova tarefa
- `PUT /api/tarefas/:id` - Atualizar uma tarefa
- `DELETE /api/tarefas/:id` - Remover uma tarefa
- `PATCH /api/tarefas/:id/concluir` - Marcar como concluída/pendente
- `GET /api/tarefas/buscar?termo=...` - Buscar por termo

### Categorias

- `GET /api/categorias` - Listar todas as categorias
- `GET /api/categorias/:id` - Obter uma categoria específica
- `POST /api/categorias` - Criar nova categoria
- `PUT /api/categorias/:id` - Atualizar uma categoria
- `DELETE /api/categorias/:id` - Remover uma categoria
- `GET /api/categorias/buscar?termo=...` - Buscar por termo

### Etiquetas

- `GET /api/etiquetas` - Listar todas as etiquetas
- `GET /api/etiquetas/:id` - Obter uma etiqueta específica
- `POST /api/etiquetas` - Criar nova etiqueta
- `PUT /api/etiquetas/:id` - Atualizar uma etiqueta
- `DELETE /api/etiquetas/:id` - Remover uma etiqueta
- `GET /api/etiquetas/buscar?termo=...` - Buscar por termo
- `GET /api/etiquetas/:id/tarefas` - Listar tarefas da etiqueta

## Exemplos de Uso

### Criar uma nova tarefa

```http
POST /api/tarefas
Content-Type: application/json

{
  "titulo": "Estudar SQLite",
  "descricao": "Aprender sobre as funcionalidades do SQLite",
  "categoria_id": 1,
  "prioridade": 2,
  "data_vencimento": "2023-12-31",
  "etiquetas": [1, 3]
}
```

### Filtrar tarefas por categoria e prioridade

```http
GET /api/tarefas?categoria_id=1&prioridade=2
```

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web
- **SQLite**: Banco de dados relacional
- **Cors**: Middleware para habilitar CORS
- **Morgan**: Logger de requisições HTTP

## Conceitos Aprendidos

- Persistência de dados com banco de dados relacional (SQLite)
- Modelagem de dados com relacionamentos (1:N e N:N)
- Operações SQL (SELECT, INSERT, UPDATE, DELETE)
- Implementação de uma API RESTful com Express
- Validação de dados de entrada
- Tratamento de erros em APIs
- Organização de código em arquitetura MVC

## Licença

Este projeto é para fins educacionais. 