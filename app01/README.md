# App 1 - Servidor HTTP Básico com Node.js Puro

## Descrição
Este projeto implementa um servidor HTTP básico utilizando apenas o módulo nativo `http` do Node.js, sem frameworks externos. O servidor responde a diferentes rotas com conteúdo HTML formatado.

## Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (versão 12.x ou superior)

### Instalação
1. Clone o repositório
2. Navegue até a pasta do projeto:
   ```
   cd app01
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

## O Que Este Projeto Ensina

### Conceitos Abordados
- Criação de um servidor HTTP usando o módulo nativo `http` do Node.js
- Roteamento básico baseado na URL solicitada
- Manipulação de requisições e respostas HTTP
- Definição de cabeçalhos e códigos de status HTTP
- Resposta com conteúdo HTML

### Estrutura do Projeto
- `server.js`: Arquivo principal que contém o código do servidor
- `package.json`: Metadados e dependências do projeto

### Rotas Implementadas
- `/`: Página inicial de boas-vindas
- `/info`: Exibe informações sobre a requisição atual
- Qualquer outra rota: Página 404 (não encontrada)

## Próximos Passos
Para avançar seus conhecimentos após este projeto, considere:
- Adicionar mais rotas e funcionalidades
- Implementar um sistema de logs
- Ler dados de um arquivo para servir conteúdo dinâmico
- Estudar o módulo `fs` do Node.js para manipulação de arquivos 