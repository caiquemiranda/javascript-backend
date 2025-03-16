# API REST com PostgreSQL e Estrutura MVC

API RESTful de gerenciamento de usuários utilizando PostgreSQL, Sequelize ORM e arquitetura MVC.

## Funcionalidades

- Registro e autenticação de usuários com JWT
- CRUD completo de usuários
- Proteção de rotas com middleware de autenticação
- Validação de dados com express-validator
- Logs estruturados com Winston
- Documentação de API com Swagger

## Pré-requisitos

- Node.js (v14+)
- PostgreSQL (v12+)
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/javascript-backend.git
cd javascript-backend/app11
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Configure o banco de dados:
```bash
# Crie o banco de dados
createdb api_users

# Execute as migrações
npm run migrate

# Execute as seeds (opcional)
npm run seed
```

5. Inicie o servidor:
```bash
npm run dev
```

6. Acesse a API:
```
http://localhost:3000/api
```

## Estrutura do Projeto

```
app11/
├── src/
│   ├── controllers/    # Controladores para lógica de requisições
│   ├── models/         # Modelos para interação com o banco de dados
│   ├── routes/         # Definição de rotas da API
│   ├── middleware/     # Middlewares (JWT, validação, etc.)
│   ├── services/       # Camada de serviços para lógica de negócios
│   ├── utils/          # Funções utilitárias
│   ├── config/         # Configurações da aplicação
│   └── database/       # Arquivos relacionados ao banco de dados
│       ├── migrations/ # Migrações para estrutura do banco
│       └── seeds/      # Seeds para dados iniciais
├── tests/              # Testes automatizados
└── public/             # Arquivos estáticos (documentação, etc.)
```

## API Endpoints

### Autenticação

- **POST /api/auth/register** - Registrar novo usuário
- **POST /api/auth/login** - Autenticar usuário
- **GET /api/auth/profile** - Obter perfil do usuário autenticado
- **POST /api/auth/refresh** - Renovar token JWT

### Usuários (requer autenticação)

- **GET /api/users** - Listar todos os usuários
- **GET /api/users/:id** - Obter usuário por ID
- **PUT /api/users/:id** - Atualizar usuário
- **DELETE /api/users/:id** - Remover usuário

## Tecnologias Utilizadas

- **Express.js**: Framework web para Node.js
- **Sequelize**: ORM para PostgreSQL
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação e autorização
- **Winston**: Logging estruturado
- **Express Validator**: Validação de dados
- **Helmet**: Segurança para cabeçalhos HTTP
- **Jest**: Framework de testes

## Conceitos Aplicados

- Arquitetura MVC (Model-View-Controller)
- Autenticação e autorização com JWT
- Relacionamentos em banco de dados relacional
- Validação de dados de entrada
- Tratamento de erros centralizado
- Logging estruturado
- Testes automatizados
- Boas práticas de segurança

## Licença

Este projeto é para fins educacionais. 