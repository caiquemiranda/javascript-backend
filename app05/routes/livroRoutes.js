const express = require('express');
const router = express.Router();
const livroModel = require('../models/livroModel');

// Middleware para validação básica de livro
const validarLivro = (req, res, next) => {
    const { titulo, autor } = req.body;
    const erros = [];

    if (!titulo || titulo.trim() === '') {
        erros.push('O título do livro é obrigatório');
    }

    if (!autor || autor.trim() === '') {
        erros.push('O autor do livro é obrigatório');
    }

    if (erros.length > 0) {
        return res.status(400).json({ erros });
    }

    next();
};

// Obter todos os livros
router.get('/', async (req, res) => {
    try {
        const livros = await livroModel.obterTodos();
        res.json(livros);
    } catch (erro) {
        console.error('Erro ao obter livros:', erro);
        res.status(500).json({ erro: 'Erro ao obter livros' });
    }
});

// Obter livro por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const livro = await livroModel.obterPorId(id);

        if (!livro) {
            return res.status(404).json({ erro: `Livro com ID ${id} não encontrado` });
        }

        res.json(livro);
    } catch (erro) {
        console.error(`Erro ao obter livro com ID ${req.params.id}:`, erro);
        res.status(500).json({ erro: 'Erro ao obter livro' });
    }
});

// Buscar livros por termo
router.get('/busca/termo', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({ erro: 'Termo de busca obrigatório' });
        }

        const resultados = await livroModel.buscar(q);
        res.json(resultados);
    } catch (erro) {
        console.error('Erro ao buscar livros:', erro);
        res.status(500).json({ erro: 'Erro ao buscar livros' });
    }
});

// Adicionar novo livro
router.post('/', validarLivro, async (req, res) => {
    try {
        const livroNovo = req.body;
        const livroAdicionado = await livroModel.adicionar(livroNovo);

        res.status(201).json(livroAdicionado);
    } catch (erro) {
        console.error('Erro ao adicionar livro:', erro);
        res.status(500).json({ erro: 'Erro ao adicionar livro' });
    }
});

// Atualizar livro existente
router.put('/:id', validarLivro, async (req, res) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;

        const livroAtualizado = await livroModel.atualizar(id, dadosAtualizados);

        if (!livroAtualizado) {
            return res.status(404).json({ erro: `Livro com ID ${id} não encontrado` });
        }

        res.json(livroAtualizado);
    } catch (erro) {
        console.error(`Erro ao atualizar livro com ID ${req.params.id}:`, erro);
        res.status(500).json({ erro: 'Erro ao atualizar livro' });
    }
});

// Remover livro
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const removido = await livroModel.remover(id);

        if (!removido) {
            return res.status(404).json({ erro: `Livro com ID ${id} não encontrado` });
        }

        res.status(204).end();
    } catch (erro) {
        console.error(`Erro ao remover livro com ID ${req.params.id}:`, erro);
        res.status(500).json({ erro: 'Erro ao remover livro' });
    }
});

module.exports = router; 