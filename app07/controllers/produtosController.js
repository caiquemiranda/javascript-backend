const produtoModel = require('../models/produtoModel');
const validador = require('../utils/validador');

/**
 * Controlador para operações relacionadas a produtos
 */
const produtosController = {
    /**
     * Lista todos os produtos
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     * @param {Function} next - Função next
     */
    listarProdutos: async (req, res, next) => {
        try {
            const produtos = await produtoModel.listarTodos();
            res.json({
                status: 'success',
                message: 'Produtos recuperados com sucesso',
                data: produtos
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtém um produto pelo ID
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     * @param {Function} next - Função next
     */
    obterProdutoPorId: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inválido'
                });
            }

            const produto = await produtoModel.obterPorId(id);

            if (!produto) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Produto não encontrado'
                });
            }

            res.json({
                status: 'success',
                message: 'Produto recuperado com sucesso',
                data: produto
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Busca produtos por termo
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     * @param {Function} next - Função next
     */
    buscarProdutos: async (req, res, next) => {
        try {
            const termo = req.query.termo;

            if (!termo) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Termo de busca não fornecido'
                });
            }

            const produtos = await produtoModel.buscar(termo);

            res.json({
                status: 'success',
                message: `Produtos encontrados para o termo "${termo}"`,
                data: produtos
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Cria um novo produto
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     * @param {Function} next - Função next
     */
    criarProduto: async (req, res, next) => {
        try {
            const dadosProduto = req.body;

            // Valida os dados do produto
            const { valido, erros } = validador.validarProduto(dadosProduto);

            if (!valido) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Dados de produto inválidos',
                    erros
                });
            }

            // Normaliza os dados
            const produtoNormalizado = validador.normalizarProduto(dadosProduto);

            // Cria o produto
            const novoProduto = await produtoModel.criar(produtoNormalizado);

            res.status(201).json({
                status: 'success',
                message: 'Produto criado com sucesso',
                data: novoProduto
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Atualiza um produto existente
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     * @param {Function} next - Função next
     */
    atualizarProduto: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const dadosProduto = req.body;

            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inválido'
                });
            }

            // Verifica se o produto existe
            const produtoExistente = await produtoModel.obterPorId(id);

            if (!produtoExistente) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Produto não encontrado'
                });
            }

            // Valida os dados do produto
            const { valido, erros } = validador.validarProduto(dadosProduto);

            if (!valido) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Dados de produto inválidos',
                    erros
                });
            }

            // Normaliza os dados
            const produtoNormalizado = validador.normalizarProduto(dadosProduto);

            // Atualiza o produto
            const produtoAtualizado = await produtoModel.atualizar(id, produtoNormalizado);

            res.json({
                status: 'success',
                message: 'Produto atualizado com sucesso',
                data: produtoAtualizado
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Remove um produto
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     * @param {Function} next - Função next
     */
    removerProduto: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID inválido'
                });
            }

            // Verifica se o produto existe
            const produtoExistente = await produtoModel.obterPorId(id);

            if (!produtoExistente) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Produto não encontrado'
                });
            }

            // Remove o produto
            await produtoModel.remover(id);

            res.json({
                status: 'success',
                message: 'Produto removido com sucesso'
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = produtosController; 