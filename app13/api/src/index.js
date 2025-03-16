const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Armazenamento em memória para as tarefas
let tarefas = [
    { id: 1, descricao: 'Estudar Express', concluida: false },
    { id: 2, descricao: 'Aprender React', concluida: false },
    { id: 3, descricao: 'Integrar Frontend e Backend', concluida: false }
];

// Rota raiz
app.get('/', (req, res) => {
    res.json({ message: 'API de Lista de Tarefas funcionando!' });
});

// GET - Listar todas as tarefas
app.get('/api/tarefas', (req, res) => {
    res.json(tarefas);
});

// GET - Buscar uma tarefa específica
app.get('/api/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tarefa = tarefas.find(t => t.id === id);

    if (!tarefa) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    res.json(tarefa);
});

// POST - Criar uma nova tarefa
app.post('/api/tarefas', (req, res) => {
    const { descricao } = req.body;

    if (!descricao) {
        return res.status(400).json({ message: 'A descrição da tarefa é obrigatória' });
    }

    const novaTarefa = {
        id: tarefas.length > 0 ? Math.max(...tarefas.map(t => t.id)) + 1 : 1,
        descricao,
        concluida: false
    };

    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
});

// PUT - Atualizar uma tarefa existente
app.put('/api/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { descricao, concluida } = req.body;

    const index = tarefas.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    tarefas[index] = {
        ...tarefas[index],
        descricao: descricao !== undefined ? descricao : tarefas[index].descricao,
        concluida: concluida !== undefined ? concluida : tarefas[index].concluida
    };

    res.json(tarefas[index]);
});

// DELETE - Excluir uma tarefa
app.delete('/api/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tarefas.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    const tarefaRemovida = tarefas.splice(index, 1)[0];
    res.json(tarefaRemovida);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 