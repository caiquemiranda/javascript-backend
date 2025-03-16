# Formulário com Envio para API

Aplicação de cadastro com formulário React que envia dados para uma API backend.

## Estrutura do Projeto

- `/api` - Backend construído com Express
- `/client` - Frontend construído com React

## Funcionalidades

- Formulário completo com validação de campos
- Armazenamento de dados em API
- Listagem de cadastros
- Edição e remoção de cadastros
- Validação no frontend e backend

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- CORS
- Joi (validação)

### Frontend
- React
- Formik (gerenciamento de formulários)
- Yup (validação de esquemas)
- React Input Mask (máscaras de input)
- React Toastify (notificações)
- Axios (requisições HTTP)

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

## Fluxo da Aplicação

1. O usuário preenche o formulário de cadastro
2. Os dados são validados no frontend usando Formik e Yup
3. Após a validação, os dados são enviados para a API
4. A API valida os dados novamente usando Joi
5. Se válido, o cadastro é armazenado e retornado com sucesso
6. O frontend atualiza a lista de cadastros
7. O usuário pode editar ou excluir os cadastros existentes

## Endpoints da API

- `GET /api/cadastros` - Retorna todos os cadastros
- `GET /api/cadastros/:id` - Retorna um cadastro específico
- `POST /api/cadastros` - Cria um novo cadastro
- `PUT /api/cadastros/:id` - Atualiza um cadastro existente
- `DELETE /api/cadastros/:id` - Remove um cadastro 