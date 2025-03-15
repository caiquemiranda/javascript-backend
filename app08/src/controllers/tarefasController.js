/**
 * Controlador para operações relacionadas a tarefas
 */
const tarefaModel = require('../models/tarefaModel');
const validador = require('../utils/validador');

// Controlador de tarefas
const tarefasController = {
    /**
     * Lista todas as tarefas, opcionalmente filtradas
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    listarTarefas: async (req, res, next) => {
        try {
            // Extrai os filtros da query string
            const filtros = {
                concluida: req.query.concluida === 'true' ? 1 : (req.query.concluida === 'false' ? 0 : undefined),
                categoria_id: req.query.categoria_id ? parseInt(req.query.categoria_id) : undefined,
                prioridade: req.query.prioridade ? parseInt(req.query.prioridade) : undefined,
                ordenar_por: req.query.ordenar_por
            };

            const tarefas = await tarefaModel.listarTodas(filtros);

            res.json({
                status: 'success',
                message: 'Tarefas recuperadas com sucesso',
                count: tarefas.length,
                data: tarefas
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtém uma tarefa pelo ID
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    obterTarefaPorId: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inválido'
                });
            }

            const tarefa = await tarefaModel.buscarPorId(id);

            if (!tarefa) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Tarefa não encontrada'
                });
            }

            res.json({
                status: 'success',
                message: 'Tarefa recuperada com sucesso',
                data: tarefa
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Busca tarefas por termo
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    buscarTarefas: async (req, res, next) => {
        try {
            const termo = req.query.termo;

            if (!termo) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Termo de busca não fornecido'
                });
            }

            const tarefas = await tarefaModel.buscarPorTermo(termo);

            res.json({
                status: 'success',
                message: `Tarefas encontradas para o termo "${termo}"`,
                count: tarefas.length,
                data: tarefas
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Cria uma nova tarefa
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    criarTarefa: async (req, res, next) => {
        try {
            // Valida os dados da tarefa
            const { valido, erros } = validador.validarTarefa(req.body);

            if (!valido) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Dados inválidos',
                    erros
                });
            }

            // Tenta criar a tarefa
            const novaTarefa = await tarefaModel.criar(req.body);

            res.status(201).json({
                status: 'success',
                message: 'Tarefa criada com sucesso',
                data: novaTarefa
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Atualiza uma tarefa existente
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    atualizarTarefa: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inválido'
                });
            }

            // Valida os dados da tarefa
            const { valido, erros } = validador.validarTarefaAtualizacao(req.body);

            if (!valido) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Dados inválidos',
                    erros
                });
            }

            // Tenta atualizar a tarefa
            try {
                const tarefaAtualizada = await tarefaModel.atualizar(id, req.body);

                res.json({
                    status: 'success',
                    message: 'Tarefa atualizada com sucesso',
                    data: tarefaAtualizada
                });
            } catch (error) {
                if (error.message.includes('não encontrada')) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Tarefa não encontrada'
                    });
                }
                throw error;
            }
        } catch (error) {
            next(error);
        }
    },

    /**
     * Remove uma tarefa
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    removerTarefa: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inválido'
                });
            }

            // Tenta obter a tarefa antes de remover (para retornar seus dados)
            const tarefa = await tarefaModel.buscarPorId(id);

            if (!tarefa) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Tarefa não encontrada'
                });
            }

            // Remove a tarefa
            await tarefaModel.remover(id);

            res.json({
                status: 'success',
                message: 'Tarefa removida com sucesso',
                data: tarefa
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Marca uma tarefa como concluída ou não concluída
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    marcarConclusao: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const { concluida } = req.body;

            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inválido'
                });
            }

            if (concluida === undefined) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Status de conclusão não fornecido'
                });
            }

            // Verifica se a tarefa existe
            const tarefaExistente = await tarefaModel.buscarPorId(id);

            if (!tarefaExistente) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Tarefa não encontrada'
                });
            }

            // Marca a conclusão da tarefa
            const tarefaAtualizada = await tarefaModel.marcarConclusao(id, Boolean(concluida));

            res.json({
                status: 'success',
                message: `Tarefa marcada como ${concluida ? 'concluída' : 'não concluída'} com sucesso`,
                data: tarefaAtualizada
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = tarefasController; 