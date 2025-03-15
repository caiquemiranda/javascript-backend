/**
 * Controlador de Produtos
 * Gerencia as operações da API para o recurso de Produtos
 */
const produtoModel = require('../models/produtoModel');
const validador = require('../utils/validador');

/**
 * Obtém todos os produtos
 * @param {object} req - Objeto de requisição Express
 * @param {object} res - Objeto de resposta Express
 */
const listarTodos = async (req, res) => {
    try {
        const produtos = await produtoModel.listarTodos();
        res.json({
            success: true,
            count: produtos.length,
            data: produtos
        });
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar produtos',
            message: error.message
        });
    }
};

/**
 * Obtém um produto pelo ID
 * @param {object} req - Objeto de requisição Express
 * @param {object} res - Objeto de resposta Express
 */
const buscarPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'O ID do produto deve ser um número'
            });
        }

        const produto = await produtoModel.buscarPorId(id);

        if (!produto) {
            return res.status(404).json({
                success: false,
                error: 'Produto não encontrado',
                message: `Não foi encontrado produto com ID ${id}`
            });
        }

        res.json({
            success: true,
            data: produto
        });
    } catch (error) {
        console.error(`Erro ao buscar produto ID ${req.params.id}:`, error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar produto',
            message: error.message
        });
    }
};

/**
 * Cria um novo produto
 * @param {object} req - Objeto de requisição Express
 * @param {object} res - Objeto de resposta Express
 */
const criar = async (req, res) => {
    try {
        // Normaliza os dados do produto
        const dadosProduto = validador.normalizarProduto(req.body);

        // Valida os dados do produto
        const resultadoValidacao = validador.validarProduto(dadosProduto);

        if (!resultadoValidacao.valido) {
            return res.status(400).json({
                success: false,
                error: 'Dados inválidos',
                message: 'Os dados do produto são inválidos',
                erros: resultadoValidacao.erros
            });
        }

        // Cria o produto
        const novoProduto = await produtoModel.criar(dadosProduto);

        res.status(201).json({
            success: true,
            message: 'Produto criado com sucesso',
            data: novoProduto
        });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao criar produto',
            message: error.message
        });
    }
};

/**
 * Atualiza um produto existente
 * @param {object} req - Objeto de requisição Express
 * @param {object} res - Objeto de resposta Express
 */
const atualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'O ID do produto deve ser um número'
            });
        }

        // Normaliza os dados do produto
        const dadosAtualizacao = validador.normalizarProduto(req.body);

        // Valida os dados do produto
        const resultadoValidacao = validador.validarProdutoAtualizacao(dadosAtualizacao);

        if (!resultadoValidacao.valido) {
            return res.status(400).json({
                success: false,
                error: 'Dados inválidos',
                message: 'Os dados do produto são inválidos',
                erros: resultadoValidacao.erros
            });
        }

        // Atualiza o produto
        const produtoAtualizado = await produtoModel.atualizar(id, dadosAtualizacao);

        if (!produtoAtualizado) {
            return res.status(404).json({
                success: false,
                error: 'Produto não encontrado',
                message: `Não foi encontrado produto com ID ${id}`
            });
        }

        res.json({
            success: true,
            message: 'Produto atualizado com sucesso',
            data: produtoAtualizado
        });
    } catch (error) {
        console.error(`Erro ao atualizar produto ID ${req.params.id}:`, error);
        res.status(500).json({
            success: false,
            error: 'Erro ao atualizar produto',
            message: error.message
        });
    }
};

/**
 * Remove um produto
 * @param {object} req - Objeto de requisição Express
 * @param {object} res - Objeto de resposta Express
 */
const remover = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'O ID do produto deve ser um número'
            });
        }

        // Verifica se o produto existe
        const produto = await produtoModel.buscarPorId(id);

        if (!produto) {
            return res.status(404).json({
                success: false,
                error: 'Produto não encontrado',
                message: `Não foi encontrado produto com ID ${id}`
            });
        }

        // Remove o produto
        await produtoModel.remover(id);

        res.json({
            success: true,
            message: 'Produto removido com sucesso',
            data: produto
        });
    } catch (error) {
        console.error(`Erro ao remover produto ID ${req.params.id}:`, error);
        res.status(500).json({
            success: false,
            error: 'Erro ao remover produto',
            message: error.message
        });
    }
};

/**
 * Busca produtos por termo
 * @param {object} req - Objeto de requisição Express
 * @param {object} res - Objeto de resposta Express
 */
const buscarPorTermo = async (req, res) => {
    try {
        const { termo } = req.query;

        if (!termo || termo.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Termo de busca inválido',
                message: 'O termo de busca não pode ser vazio'
            });
        }

        const produtos = await produtoModel.buscarPorTermo(termo);

        res.json({
            success: true,
            count: produtos.length,
            termo: termo,
            data: produtos
        });
    } catch (error) {
        console.error(`Erro ao buscar produtos com termo "${req.query.termo}":`, error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar produtos',
            message: error.message
        });
    }
};

module.exports = {
    listarTodos,
    buscarPorId,
    criar,
    atualizar,
    remover,
    buscarPorTermo
}; 