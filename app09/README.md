# API com Autenticação JWT

Uma API RESTful com autenticação baseada em JSON Web Tokens (JWT) e persistência em banco de dados SQLite.

## Funcionalidades

- ✅ Registro e autenticação de usuários
- 🔒 Proteção de rotas com JWT
- 👥 Gerenciamento de usuários (CRUD)
- 🛡️ Controle de acesso baseado em funções (user/admin)
- 🔐 Senhas com hash usando bcrypt
- 📦 Persistência de dados com SQLite

## Pré-requisitos

- Node.js (v14+)
- npm ou yarn

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd app09
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

4. Inicie o servidor:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. Acesse a aplicação em `http://localhost:3000`

## Estrutura do Projeto

```
app09/
├── data/                  # Diretório para o banco de dados SQLite
├── public/                # Arquivos estáticos
│   ├── css/               # Estilos CSS
│   ├── js/                # Scripts JavaScript
│   └── index.html         # Página inicial
├── src/                   # Código-fonte
│   ├── config/            # Configurações
│   ├── controllers/       # Controladores
│   ├── middleware/        # Middlewares
│   ├── models/            # Modelos de dados
│   ├── routes/            # Rotas da API
│   └── utils/             # Utilitários
├── .env                   # Variáveis de ambiente
├── .gitignore             # Arquivos ignorados pelo Git
├── package.json           # Dependências e scripts
├── README.md              # Documentação
└── server.js              # Ponto de entrada da aplicação
```

## Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registrar um novo usuário
- `POST /api/auth/login` - Autenticar usuário e obter token
- `GET /api/auth/me` - Obter dados do usuário atual (requer autenticação)

### Usuários

- `GET /api/users` - Listar todos os usuários (requer admin)
- `GET /api/users/:id` - Obter usuário por ID (próprio usuário ou admin)
- `PUT /api/users/:id` - Atualizar usuário (próprio usuário ou admin)
- `DELETE /api/users/:id` - Excluir usuário (próprio usuário ou admin)

## Exemplos de Uso

### Registrar um novo usuário

```javascript
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Usuário Teste',
    email: 'usuario@teste.com',
    password: 'Senha123'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Login

```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@teste.com',
    password: 'Senha123'
  })
})
.then(res => res.json())
.then(data => {
  localStorage.setItem('token', data.token);
  console.log(data);
});
```

### Acessar rota protegida

```javascript
const token = localStorage.getItem('token');

fetch('/api/auth/me', {
  method: 'GET',
  headers: { 
    'Authorization': `Bearer ${token}` 
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

## Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web
- **SQLite** - Banco de dados
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Hash de senhas
- **dotenv** - Gerenciamento de variáveis de ambiente
- **cors** - Middleware para habilitar CORS
- **morgan** - Middleware para logging

## Conceitos Aplicados

- Autenticação e autorização
- Segurança de APIs
- Persistência de dados
- Arquitetura MVC
- Validação de dados
- Tratamento de erros
- Controle de acesso baseado em funções (RBAC)

## Licença

Este projeto é para fins educacionais. 