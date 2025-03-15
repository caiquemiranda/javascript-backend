/**
 * Controlador para gerenciamento de tarefas
 * Implementa a lógica de negócio para operações CRUD de tarefas
 */
const path = require('path');
const fileService = require('../services/fileService');
const responseFormatter = require('../utils/responseFormatter');

// Caminho para o arquivo de dados
const tarefasFilePath = path.join(__dirname, '../../data/tarefas.json');

// Inicializa o arquivo de tarefas se não existir
const initTarefasFile = async () => {
    const tarefas = await fileService.readJsonFile(tarefasFilePath);
    if (tarefas.length === 0) {
        const tarefasIniciais = [
            { id: 1, descricao: 'Estudar Node.js', concluida: false },
            { id: 2, descricao: 'Criar uma API REST', concluida: false },
            { id: 3, descricao: 'Testar a aplicação', concluida: false }
        ];
        await fileService.writeJsonFile(tarefasFilePath, tarefasIniciais);
    }
};

// Inicializa o arquivo ao carregar o controlador
initTarefasFile();

/**
 * Obtém todas as tarefas
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const obterTodas = async (req, res, next) => {
    try {
        const tarefas = await fileService.readJsonFile(tarefasFilePath);
        res.json(responseFormatter.success(tarefas, 'Tarefas obtidas com sucesso'));
    } catch (error) {
        next(error);
    }
};

/**
 * Obtém uma tarefa pelo ID
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const obterPorId = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const tarefas = await fileService.readJsonFile(tarefasFilePath);
        const tarefa = tarefas.find(t => t.id === id);

        if (!tarefa) {
            return res.status(404).json(
                responseFormatter.error(`Tarefa com ID ${id} não encontrada`, 404)
            );
        }

        res.json(responseFormatter.success(tarefa, 'Tarefa obtida com sucesso'));
    } catch (error) {
        next(error);
    }
};

/**
 * Cria uma nova tarefa
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const criar = async (req, res, next) => {
    try {
        const { descricao } = req.body;

        if (!descricao || descricao.trim() === '') {
            return res.status(400).json(
                responseFormatter.error('A descrição da tarefa é obrigatória', 400)
            );
        }

        const tarefas = await fileService.readJsonFile(tarefasFilePath);

        // Encontra o maior ID atual
        const maxId = tarefas.length > 0 ? Math.max(...tarefas.map(t => t.id)) : 0;

        // Cria a nova tarefa
        const novaTarefa = {
            id: maxId + 1,
            descricao: descricao.trim(),
            concluida: false
        };

        // Adiciona a nova tarefa e salva
        tarefas.push(novaTarefa);
        await fileService.writeJsonFile(tarefasFilePath, tarefas);

        res.status(201).json(
            responseFormatter.success(novaTarefa, 'Tarefa criada com sucesso', 201)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Atualiza uma tarefa existente
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const atualizar = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { descricao, concluida } = req.body;

        // Validação básica
        if (descricao !== undefined && descricao.trim() === '') {
            return res.status(400).json(
                responseFormatter.error('A descrição da tarefa não pode ser vazia', 400)
            );
        }

        const tarefas = await fileService.readJsonFile(tarefasFilePath);
        const index = tarefas.findIndex(t => t.id === id);

        if (index === -1) {
            return res.status(404).json(
                responseFormatter.error(`Tarefa com ID ${id} não encontrada`, 404)
            );
        }

        // Atualiza os campos fornecidos
        if (descricao !== undefined) {
            tarefas[index].descricao = descricao.trim();
        }

        if (concluida !== undefined) {
            tarefas[index].concluida = Boolean(concluida);
        }

        // Salva as alterações
        await fileService.writeJsonFile(tarefasFilePath, tarefas);

        res.json(
            responseFormatter.success(tarefas[index], 'Tarefa atualizada com sucesso')
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Remove uma tarefa
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
const remover = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const tarefas = await fileService.readJsonFile(tarefasFilePath);
        const index = tarefas.findIndex(t => t.id === id);

        if (index === -1) {
            return res.status(404).json(
                responseFormatter.error(`Tarefa com ID ${id} não encontrada`, 404)
            );
        }

        // Remove a tarefa
        const tarefaRemovida = tarefas.splice(index, 1)[0];

        // Salva as alterações
        await fileService.writeJsonFile(tarefasFilePath, tarefas);

        res.json(
            responseFormatter.success(tarefaRemovida, 'Tarefa removida com sucesso')
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obterTodas,
    obterPorId,
    criar,
    atualizar,
    remover
}; 