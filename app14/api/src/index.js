const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Armazenamento em memória para os dados do formulário
let cadastros = [];

// Schema de validação com Joi
const cadastroSchema = Joi.object({
    nome: Joi.string().min(3).max(100).required()
        .messages({
            'string.min': 'O nome deve ter no mínimo 3 caracteres',
            'string.max': 'O nome deve ter no máximo 100 caracteres',
            'string.empty': 'O nome é obrigatório',
            'any.required': 'O nome é obrigatório'
        }),

    email: Joi.string().email().required()
        .messages({
            'string.email': 'Email inválido',
            'string.empty': 'O email é obrigatório',
            'any.required': 'O email é obrigatório'
        }),

    telefone: Joi.string().pattern(/^\(\d{2}\)\s\d{5}-\d{4}$/).required()
        .messages({
            'string.pattern.base': 'Telefone deve estar no formato (99) 99999-9999',
            'string.empty': 'O telefone é obrigatório',
            'any.required': 'O telefone é obrigatório'
        }),

    dataNascimento: Joi.date().iso().max('now').required()
        .messages({
            'date.base': 'Data de nascimento inválida',
            'date.max': 'A data de nascimento não pode ser no futuro',
            'any.required': 'A data de nascimento é obrigatória'
        }),

    cidade: Joi.string().min(2).max(100).required()
        .messages({
            'string.min': 'A cidade deve ter no mínimo 2 caracteres',
            'string.empty': 'A cidade é obrigatória',
            'any.required': 'A cidade é obrigatória'
        }),

    estado: Joi.string().length(2).required()
        .messages({
            'string.length': 'O estado deve ser informado com 2 caracteres (sigla)',
            'string.empty': 'O estado é obrigatório',
            'any.required': 'O estado é obrigatório'
        }),

    profissao: Joi.string().min(2).max(100).required()
        .messages({
            'string.min': 'A profissão deve ter no mínimo 2 caracteres',
            'string.empty': 'A profissão é obrigatória',
            'any.required': 'A profissão é obrigatória'
        })
});

// Rota raiz
app.get('/', (req, res) => {
    res.json({ message: 'API de Formulário funcionando!' });
});

// Rota para obter todos os cadastros
app.get('/api/cadastros', (req, res) => {
    res.json(cadastros);
});

// Rota para obter um cadastro específico pelo ID
app.get('/api/cadastros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const cadastro = cadastros.find(c => c.id === id);

    if (!cadastro) {
        return res.status(404).json({ message: 'Cadastro não encontrado' });
    }

    res.json(cadastro);
});

// Rota para criar um novo cadastro
app.post('/api/cadastros', (req, res) => {
    // Validar os dados com Joi
    const { error, value } = cadastroSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const erros = error.details.map(err => ({
            campo: err.path[0],
            mensagem: err.message
        }));

        return res.status(400).json({
            mensagem: 'Dados inválidos',
            erros
        });
    }

    // Verificar se o email já está cadastrado
    const emailExistente = cadastros.some(c => c.email === value.email);

    if (emailExistente) {
        return res.status(400).json({
            mensagem: 'Email já cadastrado',
            erros: [{ campo: 'email', mensagem: 'Este email já está cadastrado' }]
        });
    }

    // Criar um novo cadastro
    const novoCadastro = {
        id: cadastros.length > 0 ? Math.max(...cadastros.map(c => c.id)) + 1 : 1,
        ...value,
        dataCadastro: new Date().toISOString()
    };

    cadastros.push(novoCadastro);
    res.status(201).json(novoCadastro);
});

// Rota para atualizar um cadastro
app.put('/api/cadastros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = cadastros.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Cadastro não encontrado' });
    }

    // Validar os dados com Joi
    const { error, value } = cadastroSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const erros = error.details.map(err => ({
            campo: err.path[0],
            mensagem: err.message
        }));

        return res.status(400).json({
            mensagem: 'Dados inválidos',
            erros
        });
    }

    // Verificar se o email já está cadastrado (exceto para o próprio cadastro)
    const emailExistente = cadastros.some(c => c.email === value.email && c.id !== id);

    if (emailExistente) {
        return res.status(400).json({
            mensagem: 'Email já cadastrado',
            erros: [{ campo: 'email', mensagem: 'Este email já está cadastrado' }]
        });
    }

    // Atualizar o cadastro
    cadastros[index] = {
        ...cadastros[index],
        ...value,
        dataAtualizacao: new Date().toISOString()
    };

    res.json(cadastros[index]);
});

// Rota para excluir um cadastro
app.delete('/api/cadastros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = cadastros.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Cadastro não encontrado' });
    }

    const cadastroRemovido = cadastros.splice(index, 1)[0];
    res.json(cadastroRemovido);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 