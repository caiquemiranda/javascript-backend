# App 2 - Servidor com Leitura de Arquivos

## Descrição
Este projeto implementa um servidor HTTP com capacidade de leitura de arquivos do sistema de arquivos local. Ele serve páginas HTML estáticas e demonstra como manipular diferentes tipos de conteúdo baseado na extensão dos arquivos.

## Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (versão 12.x ou superior)

### Instalação
1. Clone o repositório
2. Navegue até a pasta do projeto:
   ```
   cd app02
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
- Leitura de arquivos com o módulo `fs` do Node.js
- Promisificação de callbacks para melhor manipulação assíncrona
- Tratamento de diferentes tipos de arquivos baseado em suas extensões
- Servir conteúdo estático de forma dinâmica
- Manipulação de caminhos com o módulo `path`
- Criação de respostas HTML, CSS e JavaScript
- Tratamento de erros com try/catch em funções assíncronas

### Estrutura do Projeto
- `server.js`: Arquivo principal que contém o código do servidor
- `package.json`: Metadados e dependências do projeto
- `public/`: Diretório contendo arquivos estáticos:
  - `index.html`: Página inicial
  - `sobre.html`: Página com informações sobre o projeto
  - `contato.html`: Formulário de contato simulado
  - `404.html`: Página de erro personalizada para rotas não encontradas

### Funcionalidades Implementadas
- Roteamento básico para diferentes páginas HTML
- Leitura assíncrona de arquivos usando Promises
- Identificação de tipos de conteúdo (MIME types) baseado na extensão do arquivo
- Listagem de arquivos em um diretório
- Tratamento personalizado de erros 404 (página não encontrada)
- Tratamento de erros 500 (erro interno do servidor)

## Próximos Passos
Para evoluir seus conhecimentos após este projeto, considere:
- Implementar um sistema de roteamento mais robusto
- Adicionar suporte para formulários com processamento real
- Integrar um banco de dados simples (arquivo JSON)
- Implementar APIs REST básicas
- Criar um sistema de log de requisições 