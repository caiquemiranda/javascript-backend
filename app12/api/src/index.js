const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Armazenamento em memória para as tarefas
let tasks = [
    { id: 1, title: 'Aprender Express', completed: false },
    { id: 2, title: 'Criar uma API REST', completed: false },
    { id: 3, title: 'Conectar frontend com backend', completed: false }
];

// Rotas da API
// GET - Listar todas as tarefas
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// GET - Buscar uma tarefa específica
app.get('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(task => task.id === taskId);

    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ message: 'Tarefa não encontrada' });
    }
});

// POST - Criar uma nova tarefa
app.post('/api/tasks', (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'O título da tarefa é obrigatório' });
    }

    const newId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;

    const newTask = {
        id: newId,
        title,
        completed: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT - Atualizar uma tarefa existente
app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, completed } = req.body;

    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: title !== undefined ? title : tasks[taskIndex].title,
        completed: completed !== undefined ? completed : tasks[taskIndex].completed
    };

    res.json(tasks[taskIndex]);
});

// DELETE - Remover uma tarefa
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.json(deletedTask);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 