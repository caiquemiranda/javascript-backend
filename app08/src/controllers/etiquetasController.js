/**
 * Controlador para operações relacionadas a etiquetas
 */
const etiquetaModel = require('../models/etiquetaModel');
const validador = require('../utils/validador');

// Controlador de etiquetas
const etiquetasController = {
    /**
     * Lista todas as etiquetas
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    listarEtiquetas: async (req, res, next) => {
        try {
            const etiquetas = await etiquetaModel.listarTodas();

            res.json({
                status: 'success',
                message: 'Etiquetas recuperadas com sucesso',
                count: etiquetas.length,
                data: etiquetas
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtém uma etiqueta pelo ID
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    obterEtiquetaPorId: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inválido'
                });
            }

            const etiqueta = await etiquetaModel.buscarPorId(id);

            if (!etiqueta) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Etiqueta não encontrada'
                });
            }

            res.json({
                status: 'success',
                message: 'Etiqueta recuperada com sucesso',
                data: etiqueta
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Busca etiquetas por nome
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    buscarEtiquetas: async (req, res, next) => {
        try {
            const termo = req.query.termo;

            if (!termo) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Termo de busca não fornecido'
                });
            }

            const etiquetas = await etiquetaModel.buscarPorNome(termo);

            res.json({
                status: 'success',
                message: `Etiquetas encontradas para o termo "${termo}"`,
                count: etiquetas.length,
                data: etiquetas
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Cria uma nova etiqueta
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    criarEtiqueta: async (req, res, next) => {
        try {
            // Valida os dados da etiqueta
            const { valido, erros } = validador.validarEtiqueta(req.body);

            if (!valido) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Dados inválidos',
                    erros
                });
            }

            // Tenta criar a etiqueta
            const novaEtiqueta = await etiquetaModel.criar(req.body);

            res.status(201).json({
                status: 'success',
                message: 'Etiqueta criada com sucesso',
                data: novaEtiqueta
            });
        } catch (error) {
            // Verifica se é erro de chave única violada (nome único)
            if (error.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Já existe uma etiqueta com este nome'
                });
            }

            next(error);
        }
    },

    /**
     * Atualiza uma etiqueta existente
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    atualizarEtiqueta: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inválido'
                });
            }

            // Valida os dados da etiqueta
            const { valido, erros } = validador.validarEtiqueta(req.body);

            if (!valido) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Dados inválidos',
                    erros
                });
            }

            // Tenta atualizar a etiqueta
            try {
                const etiquetaAtualizada = await etiquetaModel.atualizar(id, req.body);

                res.json({
                    status: 'success',
                    message: 'Etiqueta atualizada com sucesso',
                    data: etiquetaAtualizada
                });
            } catch (error) {
                if (error.message.includes('não encontrada')) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Etiqueta não encontrada'
                    });
                }

                // Verifica se é erro de chave única violada (nome único)
                if (error.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Já existe uma etiqueta com este nome'
                    });
                }

                throw error;
            }
        } catch (error) {
            next(error);
        }
    },

    /**
     * Remove uma etiqueta
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    removerEtiqueta: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inválido'
                });
            }

            // Tenta obter a etiqueta antes de remover (para retornar seus dados)
            const etiqueta = await etiquetaModel.buscarPorId(id);

            if (!etiqueta) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Etiqueta não encontrada'
                });
            }

            // Remove a etiqueta
            await etiquetaModel.remover(id);

            res.json({
                status: 'success',
                message: 'Etiqueta removida com sucesso',
                data: etiqueta
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtém tarefas por etiqueta
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    obterTarefasPorEtiqueta: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inválido'
                });
            }

            // Verifica se a etiqueta existe
            const etiqueta = await etiquetaModel.buscarPorId(id);

            if (!etiqueta) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Etiqueta não encontrada'
                });
            }

            // Busca as tarefas da etiqueta
            const tarefas = await etiquetaModel.buscarTarefasPorEtiqueta(id);

            res.json({
                status: 'success',
                message: `Tarefas com a etiqueta "${etiqueta.nome}" recuperadas com sucesso`,
                count: tarefas.length,
                etiqueta: etiqueta,
                data: tarefas
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = etiquetasController; 