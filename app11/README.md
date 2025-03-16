# API REST com PostgreSQL e JWT

API REST desenvolvida com Node.js, Express, PostgreSQL e autenticação JWT, seguindo padrões MVC e boas práticas de desenvolvimento.

## Características

- Autenticação e autorização com JWT
- Validação de dados com Express Validator
- ORM com Sequelize
- Documentação da API disponível
- Logging abrangente com Winston
- Tratamento centralizado de erros
- Migrations e Seeders para o banco de dados
- Criptografia de senhas com bcrypt
- Middlewares para controle de acesso

## Requisitos

- Node.js 14+
- PostgreSQL 12+
- NPM ou Yarn

## Instalação

1. Clone o repositório:

```bash
git clone [URL_DO_REPOSITÓRIO]
cd [NOME_DA_PASTA]
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

4. Execute as migrations do banco de dados:

```bash
npm run migrate
# ou
yarn migrate
```

5. Execute o seeder para criar o usuário administrador:

```bash
npm run seed
# ou
yarn seed
```

## Executando o Projeto

### Ambiente de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

### Ambiente de Produção

```bash
npm start
# ou
yarn start
```

## Documentação da API

A documentação da API está disponível em:

- Local: http://localhost:3000/api

## Usuário Administrador Padrão

Após executar o seeder, um usuário administrador será criado com as seguintes credenciais:

- Email: admin@example.com
- Senha: Admin@123

## Endpoints Principais

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Autenticar usuário
- `GET /api/auth/profile` - Obter perfil do usuário autenticado
- `POST /api/auth/refresh` - Renovar token JWT

### Usuários

- `GET /api/users` - Listar todos os usuários (admin)
- `GET /api/users/:id` - Obter usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Excluir usuário
- `PUT /api/users/:id/password` - Alterar senha

## Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em desenvolvimento com hot-reload
- `npm run migrate` - Executa as migrations
- `npm run migrate:undo` - Desfaz a última migration
- `npm run migrate:undo:all` - Desfaz todas as migrations
- `npm run seed` - Executa os seeders
- `npm run seed:undo` - Desfaz o último seeder
- `npm run seed:undo:all` - Desfaz todos os seeders
- `npm test` - Executa os testes

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença [ISC](LICENSE). 