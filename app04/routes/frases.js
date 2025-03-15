const express = require('express');
const router = express.Router();
let frases = require('../data/frases');

// Obter todas as frases
router.get('/', (req, res) => {
    res.json(frases);
});

// Obter uma frase aleatória
router.get('/aleatoria', (req, res) => {
    const indiceAleatorio = Math.floor(Math.random() * frases.length);
    res.json(frases[indiceAleatorio]);
});

// Obter uma frase específica por ID
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const frase = frases.find(f => f.id === id);

    if (!frase) {
        return res.status(404).json({ mensagem: 'Frase não encontrada' });
    }

    res.json(frase);
});

// Adicionar uma nova frase
router.post('/', (req, res) => {
    const { texto, autor } = req.body;

    // Validação básica
    if (!texto || texto.trim() === '') {
        return res.status(400).json({ mensagem: 'O texto da frase é obrigatório' });
    }

    // Encontrar o maior ID e adicionar 1 para o novo ID
    const maxId = frases.reduce((max, frase) => (frase.id > max ? frase.id : max), 0);

    const novaFrase = {
        id: maxId + 1,
        texto,
        autor: autor || 'Anônimo' // Se o autor não for fornecido, usar 'Anônimo'
    };

    frases.push(novaFrase);
    res.status(201).json(novaFrase);
});

// Atualizar uma frase existente
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { texto, autor } = req.body;

    // Encontrar o índice da frase no array
    const index = frases.findIndex(f => f.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Frase não encontrada' });
    }

    // Validação básica
    if (texto !== undefined && texto.trim() === '') {
        return res.status(400).json({ mensagem: 'O texto da frase não pode estar vazio' });
    }

    // Atualizar apenas os campos fornecidos
    const fraseAtualizada = {
        ...frases[index],
        texto: texto !== undefined ? texto : frases[index].texto,
        autor: autor !== undefined ? autor : frases[index].autor
    };

    frases[index] = fraseAtualizada;
    res.json(fraseAtualizada);
});

// Excluir uma frase
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    // Verificar se a frase existe
    const index = frases.findIndex(f => f.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Frase não encontrada' });
    }

    // Remover a frase do array
    frases.splice(index, 1);

    res.status(204).end();
});

module.exports = router; 