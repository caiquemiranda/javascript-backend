/**
 * Controlador para gerenciamento de livros
 * Implementa a lógica de negócio para operações CRUD de livros
 */
const path = require('path');
const fileService = require('../services/fileService');
const responseFormatter = require('../utils/responseFormatter');

// Caminho para o arquivo de dados
const livrosFilePath = path.join(__dirname, '../../data/livros.json');

// Inicializa o arquivo de livros se não existir
const initLivrosFile = async () => {
    const livros = await fileService.readJsonFile(livrosFilePath);
    if (livros.length === 0) {
        const livrosIniciais = [
            {
                id: 1,
                titulo: 'Dom Quixote',
                autor: 'Miguel de Cervantes',
                ano: 1605,
                genero: 'Romance',
                paginas: 863
            },
            {
                id: 2,
                titulo: '1984',
                autor: 'George Orwell',
                ano: 1949,
                genero: 'Ficção Científica',
                paginas: 328
            },
            {
                id: 3,
                titulo: 'Cem Anos de Solidão',
                autor: 'Gabriel García Márquez',
                ano: 1967,
                genero: 'Realismo Mágico',
                paginas: 417
            },
            {
                id: 4,
                titulo: 'O Pequeno Príncipe',
                autor: 'Antoine de Saint-Exupéry',
                ano: 1943,
                genero: 'Fábula',
                paginas: 96
            },
            {
                id: 5,
                titulo: 'Crime e Castigo',
                autor: 'Fiódor Dostoiévski',
                ano: 1866,
                genero: 'Romance Psicológico',
                paginas: 551
            }
        ];
        await fileService.writeJsonFile(livrosFilePath, livrosIniciais);
    }
};

// Inicializa o arquivo ao carregar o controlador
initLivrosFile();

/**
 * Obtém todos os livros
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const obterTodos = async (req, res, next) => {
    try {
        const livros = await fileService.readJsonFile(livrosFilePath);
        res.json(responseFormatter.success(livros, 'Livros obtidos com sucesso'));
    } catch (error) {
        next(error);
    }
};

/**
 * Obtém um livro pelo ID
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const obterPorId = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const livros = await fileService.readJsonFile(livrosFilePath);
        const livro = livros.find(l => l.id === id);

        if (!livro) {
            return res.status(404).json(
                responseFormatter.error(`Livro com ID ${id} não encontrado`, 404)
            );
        }

        res.json(responseFormatter.success(livro, 'Livro obtido com sucesso'));
    } catch (error) {
        next(error);
    }
};

/**
 * Busca livros por termo
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const buscarPorTermo = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json(
                responseFormatter.error('Termo de busca obrigatório', 400)
            );
        }

        const livros = await fileService.readJsonFile(livrosFilePath);
        const termo = q.toLowerCase();

        const resultados = livros.filter(livro =>
            livro.titulo.toLowerCase().includes(termo) ||
            livro.autor.toLowerCase().includes(termo) ||
            livro.genero.toLowerCase().includes(termo)
        );

        res.json(responseFormatter.success(
            resultados,
            `${resultados.length} livro(s) encontrado(s) para o termo "${q}"`
        ));
    } catch (error) {
        next(error);
    }
};

/**
 * Cria um novo livro
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const criar = async (req, res, next) => {
    try {
        const { titulo, autor, ano, genero, paginas } = req.body;

        // Validação básica
        const erros = [];

        if (!titulo || titulo.trim() === '') {
            erros.push('O título do livro é obrigatório');
        }

        if (!autor || autor.trim() === '') {
            erros.push('O autor do livro é obrigatório');
        }

        if (erros.length > 0) {
            return res.status(400).json(
                responseFormatter.error('Dados inválidos', 400, erros)
            );
        }

        const livros = await fileService.readJsonFile(livrosFilePath);

        // Encontra o maior ID atual
        const maxId = livros.length > 0 ? Math.max(...livros.map(l => l.id)) : 0;

        // Cria o novo livro
        const novoLivro = {
            id: maxId + 1,
            titulo: titulo.trim(),
            autor: autor.trim(),
            ano: ano ? parseInt(ano) : null,
            genero: genero ? genero.trim() : null,
            paginas: paginas ? parseInt(paginas) : null
        };

        // Adiciona o novo livro e salva
        livros.push(novoLivro);
        await fileService.writeJsonFile(livrosFilePath, livros);

        res.status(201).json(
            responseFormatter.success(novoLivro, 'Livro criado com sucesso', 201)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Atualiza um livro existente
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const atualizar = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { titulo, autor, ano, genero, paginas } = req.body;

        // Validação básica
        if (titulo !== undefined && titulo.trim() === '') {
            return res.status(400).json(
                responseFormatter.error('O título do livro não pode ser vazio', 400)
            );
        }

        if (autor !== undefined && autor.trim() === '') {
            return res.status(400).json(
                responseFormatter.error('O autor do livro não pode ser vazio', 400)
            );
        }

        const livros = await fileService.readJsonFile(livrosFilePath);
        const index = livros.findIndex(l => l.id === id);

        if (index === -1) {
            return res.status(404).json(
                responseFormatter.error(`Livro com ID ${id} não encontrado`, 404)
            );
        }

        // Atualiza os campos fornecidos
        const livroAtualizado = { ...livros[index] };

        if (titulo !== undefined) {
            livroAtualizado.titulo = titulo.trim();
        }

        if (autor !== undefined) {
            livroAtualizado.autor = autor.trim();
        }

        if (ano !== undefined) {
            livroAtualizado.ano = ano ? parseInt(ano) : null;
        }

        if (genero !== undefined) {
            livroAtualizado.genero = genero ? genero.trim() : null;
        }

        if (paginas !== undefined) {
            livroAtualizado.paginas = paginas ? parseInt(paginas) : null;
        }

        // Atualiza o livro no array
        livros[index] = livroAtualizado;

        // Salva as alterações
        await fileService.writeJsonFile(livrosFilePath, livros);

        res.json(
            responseFormatter.success(livroAtualizado, 'Livro atualizado com sucesso')
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Remove um livro
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const remover = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const livros = await fileService.readJsonFile(livrosFilePath);
        const index = livros.findIndex(l => l.id === id);

        if (index === -1) {
            return res.status(404).json(
                responseFormatter.error(`Livro com ID ${id} não encontrado`, 404)
            );
        }

        // Remove o livro
        const livroRemovido = livros.splice(index, 1)[0];

        // Salva as alterações
        await fileService.writeJsonFile(livrosFilePath, livros);

        res.json(
            responseFormatter.success(livroRemovido, 'Livro removido com sucesso')
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obterTodos,
    obterPorId,
    buscarPorTermo,
    criar,
    atualizar,
    remover
}; 