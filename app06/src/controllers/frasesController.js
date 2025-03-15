/**
 * Controlador para gerenciamento de frases motivacionais
 * Implementa a lógica de negócio para operações CRUD de frases
 */
const path = require('path');
const fileService = require('../services/fileService');
const responseFormatter = require('../utils/responseFormatter');

// Caminho para o arquivo de dados
const frasesFilePath = path.join(__dirname, '../../data/frases.json');

// Inicializa o arquivo de frases se não existir
const initFrasesFile = async () => {
    const frases = await fileService.readJsonFile(frasesFilePath);
    if (frases.length === 0) {
        const frasesIniciais = [
            { id: 1, texto: 'A persistência é o caminho do êxito.', autor: 'Charles Chaplin' },
            { id: 2, texto: 'O sucesso nasce do querer, da determinação e persistência.', autor: 'Ayrton Senna' },
            { id: 3, texto: 'Só se pode alcançar um grande êxito quando nos mantemos fiéis a nós mesmos.', autor: 'Friedrich Nietzsche' },
            { id: 4, texto: 'O que não provoca minha morte faz com que eu fique mais forte.', autor: 'Friedrich Nietzsche' },
            { id: 5, texto: 'Não importa o quão devagar você vá, desde que você não pare.', autor: 'Confúcio' }
        ];
        await fileService.writeJsonFile(frasesFilePath, frasesIniciais);
    }
};

// Inicializa o arquivo ao carregar o controlador
initFrasesFile();

/**
 * Obtém todas as frases
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const obterTodas = async (req, res, next) => {
    try {
        const frases = await fileService.readJsonFile(frasesFilePath);
        res.json(responseFormatter.success(frases, 'Frases obtidas com sucesso'));
    } catch (error) {
        next(error);
    }
};

/**
 * Obtém uma frase aleatória
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const obterAleatoria = async (req, res, next) => {
    try {
        const frases = await fileService.readJsonFile(frasesFilePath);

        if (frases.length === 0) {
            return res.status(404).json(
                responseFormatter.error('Não há frases disponíveis', 404)
            );
        }

        const indiceAleatorio = Math.floor(Math.random() * frases.length);
        const fraseAleatoria = frases[indiceAleatorio];

        res.json(responseFormatter.success(fraseAleatoria, 'Frase aleatória obtida com sucesso'));
    } catch (error) {
        next(error);
    }
};

/**
 * Obtém uma frase pelo ID
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const obterPorId = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const frases = await fileService.readJsonFile(frasesFilePath);
        const frase = frases.find(f => f.id === id);

        if (!frase) {
            return res.status(404).json(
                responseFormatter.error(`Frase com ID ${id} não encontrada`, 404)
            );
        }

        res.json(responseFormatter.success(frase, 'Frase obtida com sucesso'));
    } catch (error) {
        next(error);
    }
};

/**
 * Cria uma nova frase
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const criar = async (req, res, next) => {
    try {
        const { texto, autor } = req.body;

        // Validação básica
        if (!texto || texto.trim() === '') {
            return res.status(400).json(
                responseFormatter.error('O texto da frase é obrigatório', 400)
            );
        }

        const frases = await fileService.readJsonFile(frasesFilePath);

        // Encontra o maior ID atual
        const maxId = frases.length > 0 ? Math.max(...frases.map(f => f.id)) : 0;

        // Cria a nova frase
        const novaFrase = {
            id: maxId + 1,
            texto: texto.trim(),
            autor: autor ? autor.trim() : 'Desconhecido'
        };

        // Adiciona a nova frase e salva
        frases.push(novaFrase);
        await fileService.writeJsonFile(frasesFilePath, frases);

        res.status(201).json(
            responseFormatter.success(novaFrase, 'Frase criada com sucesso', 201)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Atualiza uma frase existente
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const atualizar = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { texto, autor } = req.body;

        // Validação básica
        if (texto !== undefined && texto.trim() === '') {
            return res.status(400).json(
                responseFormatter.error('O texto da frase não pode ser vazio', 400)
            );
        }

        const frases = await fileService.readJsonFile(frasesFilePath);
        const index = frases.findIndex(f => f.id === id);

        if (index === -1) {
            return res.status(404).json(
                responseFormatter.error(`Frase com ID ${id} não encontrada`, 404)
            );
        }

        // Atualiza os campos fornecidos
        if (texto !== undefined) {
            frases[index].texto = texto.trim();
        }

        if (autor !== undefined) {
            frases[index].autor = autor.trim() || 'Desconhecido';
        }

        // Salva as alterações
        await fileService.writeJsonFile(frasesFilePath, frases);

        res.json(
            responseFormatter.success(frases[index], 'Frase atualizada com sucesso')
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Remove uma frase
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const remover = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const frases = await fileService.readJsonFile(frasesFilePath);
        const index = frases.findIndex(f => f.id === id);

        if (index === -1) {
            return res.status(404).json(
                responseFormatter.error(`Frase com ID ${id} não encontrada`, 404)
            );
        }

        // Remove a frase
        const fraseRemovida = frases.splice(index, 1)[0];

        // Salva as alterações
        await fileService.writeJsonFile(frasesFilePath, frases);

        res.json(
            responseFormatter.success(fraseRemovida, 'Frase removida com sucesso')
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obterTodas,
    obterAleatoria,
    obterPorId,
    criar,
    atualizar,
    remover
}; 