# App 5 - Leitura e Escrita de Arquivos com Node.js (fs)

## Descrição
Este projeto implementa uma API REST que realiza operações CRUD (Criar, Ler, Atualizar, Deletar) em arquivos JSON usando o módulo `fs` do Node.js. O projeto demonstra como manter dados persistidos em arquivos no sistema de arquivos local, sendo uma alternativa mais simples antes de avançar para bancos de dados reais.

## Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (versão 12.x ou superior)

### Instalação
1. Clone o repositório
2. Navegue até a pasta do projeto:
   ```
   cd app05
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

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/livros | Obter todos os livros |
| GET | /api/livros/:id | Obter um livro específico pelo ID |
| GET | /api/livros/busca/termo?q=termo | Buscar livros por termo |
| POST | /api/livros | Adicionar um novo livro |
| PUT | /api/livros/:id | Atualizar um livro existente |
| DELETE | /api/livros/:id | Remover um livro |

### Exemplo de Uso

#### Obter todos os livros
```
GET /api/livros
```

#### Adicionar um novo livro
```
POST /api/livros
Content-Type: application/json

{
  "titulo": "O Hobbit",
  "autor": "J.R.R. Tolkien",
  "ano": 1937,
  "genero": "Fantasia",
  "paginas": 310
}
```

#### Atualizar um livro existente
```
PUT /api/livros/1
Content-Type: application/json

{
  "paginas": 320,
  "genero": "Fantasia Épica"
}
```

#### Buscar livros por termo
```
GET /api/livros/busca/termo?q=Tolkien
```

## O Que Este Projeto Ensina

### Conceitos Abordados
- Leitura e escrita de arquivos com o módulo `fs` do Node.js
- Manipulação de arquivos JSON para persistência de dados
- Operações CRUD completas
- Tratamento de erros na manipulação de arquivos
- Promessas (Promises) para operações assíncronas
- Estruturação de código em modelos e rotas
- Validação básica de dados
- Implementação de busca em dados persistidos

### Estrutura do Projeto
- `app.js`: Arquivo principal do servidor Express
- `models/livroModel.js`: Modelo para manipulação do arquivo JSON de livros
- `routes/livroRoutes.js`: Rotas da API para gerenciamento de livros
- `data/livros.json`: Arquivo JSON que armazena os dados dos livros
- `package.json`: Metadados e dependências do projeto

### Benefícios da Persistência em Arquivos
- Simplicidade de implementação
- Não requer configuração de banco de dados
- Fácil para visualizar e editar manualmente
- Excelente para aplicações de pequeno porte
- Útil como transição antes de adotar um banco de dados

### Limitações da Persistência em Arquivos
- Não é adequado para dados muito grandes
- Sem suporte para consultas complexas
- Problemas de concorrência em ambientes multi-usuário
- Desempenho limitado em operações frequentes

## Próximos Passos
Para evoluir seus conhecimentos após este projeto, considere:
- Implementar controle de concorrência nas operações de arquivo
- Adicionar cache para melhorar o desempenho
- Criar backups automáticos dos arquivos JSON
- Migrar para um banco de dados real (SQLite, PostgreSQL, MongoDB)
- Implementar autenticação para proteger os dados
- Adicionar testes unitários e de integração 