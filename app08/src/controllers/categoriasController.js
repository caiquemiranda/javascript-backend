/**
 * Controlador para operações relacionadas a categorias
 */
const categoriaModel = require('../models/categoriaModel');
const validador = require('../utils/validador');

// Controlador de categorias
const categoriasController = {
    /**
     * Lista todas as categorias
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    listarCategorias: async (req, res, next) => {
        try {
            const categorias = await categoriaModel.listarTodas();

            res.json({
                status: 'success',
                message: 'Categorias recuperadas com sucesso',
                count: categorias.length,
                data: categorias
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtém uma categoria pelo ID
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    obterCategoriaPorId: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inválido'
                });
            }

            const categoria = await categoriaModel.buscarPorId(id);

            if (!categoria) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Categoria não encontrada'
                });
            }

            res.json({
                status: 'success',
                message: 'Categoria recuperada com sucesso',
                data: categoria
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Busca categorias por nome
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    buscarCategorias: async (req, res, next) => {
        try {
            const termo = req.query.termo;

            if (!termo) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Termo de busca não fornecido'
                });
            }

            const categorias = await categoriaModel.buscarPorNome(termo);

            res.json({
                status: 'success',
                message: `Categorias encontradas para o termo "${termo}"`,
                count: categorias.length,
                data: categorias
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Cria uma nova categoria
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    criarCategoria: async (req, res, next) => {
        try {
            // Valida os dados da categoria
            const { valido, erros } = validador.validarCategoria(req.body);

            if (!valido) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Dados inválidos',
                    erros
                });
            }

            // Tenta criar a categoria
            const novaCategoria = await categoriaModel.criar(req.body);

            res.status(201).json({
                status: 'success',
                message: 'Categoria criada com sucesso',
                data: novaCategoria
            });
        } catch (error) {
            // Verifica se é erro de chave única violada (nome único)
            if (error.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Já existe uma categoria com este nome'
                });
            }

            next(error);
        }
    },

    /**
     * Atualiza uma categoria existente
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    atualizarCategoria: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inválido'
                });
            }

            // Valida os dados da categoria
            const { valido, erros } = validador.validarCategoria(req.body);

            if (!valido) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Dados inválidos',
                    erros
                });
            }

            // Tenta atualizar a categoria
            try {
                const categoriaAtualizada = await categoriaModel.atualizar(id, req.body);

                res.json({
                    status: 'success',
                    message: 'Categoria atualizada com sucesso',
                    data: categoriaAtualizada
                });
            } catch (error) {
                if (error.message.includes('não encontrada')) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'Categoria não encontrada'
                    });
                }

                // Verifica se é erro de chave única violada (nome único)
                if (error.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Já existe uma categoria com este nome'
                    });
                }

                throw error;
            }
        } catch (error) {
            next(error);
        }
    },

    /**
     * Remove uma categoria
     * @param {Object} req Objeto de requisição
     * @param {Object} res Objeto de resposta
     * @param {Function} next Função next
     */
    removerCategoria: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inválido'
                });
            }

            // Tenta obter a categoria antes de remover (para retornar seus dados)
            const categoria = await categoriaModel.buscarPorId(id);

            if (!categoria) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Categoria não encontrada'
                });
            }

            // Remove a categoria
            await categoriaModel.remover(id);

            res.json({
                status: 'success',
                message: 'Categoria removida com sucesso',
                data: categoria
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = categoriasController; 