const express = require('express');
const path = require('path');
const fs = require('fs');

// Inicialização do Express
const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());

// Middleware para processar dados de formulários
app.use(express.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Armazenamento de dados em memória (normalmente usaríamos um banco de dados)
let tarefas = [
    { id: 1, descricao: 'Estudar Node.js', concluida: false },
    { id: 2, descricao: 'Criar um servidor com Express', concluida: true },
    { id: 3, descricao: 'Praticar rotas no Express', concluida: false }
];

// Middleware para logging de requisições
app.use((req, res, next) => {
    const dataHora = new Date().toISOString();
    console.log(`[${dataHora}] ${req.method} ${req.url}`);
    next(); // Passa o controle para o próximo middleware
});

// Definição de rotas

// Rota principal - renderiza a página home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API - Lista todas as tarefas
app.get('/api/tarefas', (req, res) => {
    res.json(tarefas);
});

// API - Obter uma tarefa específica por ID
app.get('/api/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tarefa = tarefas.find(t => t.id === id);

    if (!tarefa) {
        return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
    }

    res.json(tarefa);
});

// API - Criar uma nova tarefa
app.post('/api/tarefas', (req, res) => {
    const { descricao } = req.body;

    if (!descricao) {
        return res.status(400).json({ mensagem: 'A descrição da tarefa é obrigatória' });
    }

    // Encontrar o maior ID existente e adicionar 1
    const maxId = tarefas.reduce((max, tarefa) => (tarefa.id > max ? tarefa.id : max), 0);

    const novaTarefa = {
        id: maxId + 1,
        descricao,
        concluida: false
    };

    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
});

// API - Atualizar uma tarefa existente
app.put('/api/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { descricao, concluida } = req.body;

    const index = tarefas.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
    }

    // Atualiza apenas os campos fornecidos
    if (descricao !== undefined) {
        tarefas[index].descricao = descricao;
    }

    if (concluida !== undefined) {
        tarefas[index].concluida = Boolean(concluida);
    }

    res.json(tarefas[index]);
});

// API - Excluir uma tarefa
app.delete('/api/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tarefas.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
    }

    tarefas.splice(index, 1);
    res.status(204).end();
});

// Middleware para tratamento de rotas não encontradas
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor Express rodando em http://localhost:${PORT}`);
}); 