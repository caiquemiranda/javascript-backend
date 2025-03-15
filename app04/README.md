# App 4 - API de Frases com Rotas Dinâmicas

## Descrição
Este projeto implementa uma API RESTful para gerenciar frases motivacionais. Ele demonstra a criação de rotas dinâmicas, o uso de diferentes métodos HTTP e a manipulação de dados em memória, com uma arquitetura mais organizada, separando dados e rotas.

## Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (versão 12.x ou superior)

### Instalação
1. Clone o repositório
2. Navegue até a pasta do projeto:
   ```
   cd app04
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
| GET | /api/frases | Retorna todas as frases motivacionais |
| GET | /api/frases/aleatoria | Retorna uma frase aleatória |
| GET | /api/frases/:id | Retorna uma frase específica pelo ID |
| POST | /api/frases | Adiciona uma nova frase |
| PUT | /api/frases/:id | Atualiza uma frase existente |
| DELETE | /api/frases/:id | Remove uma frase pelo ID |

### Exemplo de Uso

#### Obtendo todas as frases:
```
GET /api/frases
```

#### Obtendo uma frase aleatória:
```
GET /api/frases/aleatoria
```

#### Adicionando uma nova frase:
```
POST /api/frases
Content-Type: application/json

{
  "texto": "Sua frase motivacional aqui",
  "autor": "Nome do Autor"
}
```

## O Que Este Projeto Ensina

### Conceitos Abordados
- Criação de uma API REST com Express.js
- Implementação de rotas dinâmicas com parâmetros
- Uso de diferentes métodos HTTP (GET, POST, PUT, DELETE)
- Manipulação de dados em memória (array)
- Organização de código com separação de responsabilidades
- Middlewares para processamento de requisições
- Tratamento de erros e respostas adequadas
- Validação básica de dados
- Geração de IDs dinâmicos para novos recursos

### Estrutura do Projeto
- `app.js`: Arquivo principal com a configuração do servidor Express
- `data/frases.js`: Arquivo que contém os dados das frases em memória
- `routes/frases.js`: Arquivo com as rotas e lógica de manipulação das frases
- `package.json`: Metadados e dependências do projeto

### Boas Práticas Demonstradas
- Organização de código em módulos reutilizáveis
- Separação de dados e lógica de negócio
- Uso de routers do Express para organizar endpoints
- Validação de entradas do usuário
- Respostas com códigos HTTP apropriados
- Documentação de API através de página inicial informativa

## Próximos Passos
Para evoluir seus conhecimentos após este projeto, considere:
- Implementar persistência de dados com um arquivo JSON ou banco de dados
- Adicionar uma camada de serviço para separar ainda mais a lógica de negócio
- Implementar validação mais robusta com bibliotecas como Joi
- Adicionar paginação para a listagem de frases
- Implementar autenticação para proteger as rotas de modificação
- Adicionar testes automatizados para os endpoints da API 