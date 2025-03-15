# Gerenciador de Produtos

Uma aplicação completa para gerenciamento de produtos com interface web e API RESTful, desenvolvida com Node.js e Express.

## Descrição

Este projeto implementa um sistema de gerenciamento de produtos com operações CRUD (Create, Read, Update, Delete) completas e persistência de dados em arquivos JSON. A aplicação possui uma interface web amigável e uma API RESTful para integração com outros sistemas.

## Funcionalidades

- Cadastro, edição e remoção de produtos
- Listagem de todos os produtos
- Busca de produtos por termo
- Validação de dados
- Persistência em arquivos JSON
- Interface web responsiva

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript
- **Express.js**: Framework web para Node.js
- **JavaScript**: Linguagem de programação
- **HTML/CSS**: Interface do usuário
- **Fetch API**: Comunicação com o backend
- **JSON**: Formato de armazenamento de dados

## Estrutura do Projeto

```
app07/
├── controllers/        # Controladores da aplicação
│   └── produtosController.js
├── data/               # Diretório para armazenamento de dados
│   └── produtos.json
├── middleware/         # Middlewares do Express
│   ├── errorHandler.js
│   └── notFound.js
├── models/             # Modelos de dados
│   └── produtoModel.js
├── public/             # Arquivos estáticos
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── index.html
├── routes/             # Rotas da API
│   └── produtosRoutes.js
├── utils/              # Utilitários
│   └── validador.js
├── app.js              # Arquivo principal da aplicação
├── package.json        # Dependências e scripts
└── README.md           # Documentação
```

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Inicie o servidor:
   ```
   npm start
   ```
   ou para desenvolvimento:
   ```
   npm run dev
   ```
4. Acesse a aplicação em `http://localhost:3000`

## API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/produtos | Lista todos os produtos |
| GET | /api/produtos/:id | Obtém um produto pelo ID |
| GET | /api/produtos/busca?termo=xyz | Busca produtos por termo |
| POST | /api/produtos | Cria um novo produto |
| PUT | /api/produtos/:id | Atualiza um produto existente |
| DELETE | /api/produtos/:id | Remove um produto |

## Modelo de Dados

```json
{
  "id": 1,
  "nome": "Nome do Produto",
  "descricao": "Descrição detalhada do produto",
  "preco": 99.90,
  "estoque": 100,
  "categoria": "Categoria do Produto",
  "dataCriacao": "2023-06-15T10:30:00.000Z",
  "dataAtualizacao": "2023-06-16T14:20:00.000Z"
}
```

## Conceitos Abordados

- **Arquitetura MVC**: Separação de responsabilidades entre Model, View e Controller
- **API RESTful**: Implementação de endpoints seguindo princípios REST
- **Middleware**: Uso de middlewares para tratamento de erros e rotas não encontradas
- **Validação de Dados**: Validação e normalização de dados de entrada
- **Persistência em Arquivos**: Armazenamento de dados em arquivos JSON
- **Frontend Interativo**: Interface web com JavaScript para interação com a API
- **Responsividade**: Design adaptável a diferentes tamanhos de tela

## Próximos Passos

- Implementar autenticação de usuários
- Adicionar testes automatizados
- Implementar paginação na listagem de produtos
- Adicionar upload de imagens para os produtos
- Migrar para um banco de dados relacional ou NoSQL

## Licença

Este projeto está licenciado sob a licença ISC. 