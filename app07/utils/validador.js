/**
 * Utilitário para validação e normalização de dados
 */
const validador = {
    /**
     * Valida os dados de um produto
     * @param {Object} produto Dados do produto a validar
     * @returns {Object} Objeto com resultado da validação
     */
    validarProduto(produto) {
        const erros = [];

        // Validação do nome
        if (!produto.nome) {
            erros.push('O nome do produto é obrigatório');
        } else if (typeof produto.nome !== 'string') {
            erros.push('O nome do produto deve ser uma string');
        } else if (produto.nome.trim().length < 2) {
            erros.push('O nome do produto deve ter pelo menos 2 caracteres');
        } else if (produto.nome.trim().length > 100) {
            erros.push('O nome do produto deve ter no máximo 100 caracteres');
        }

        // Validação da descrição (opcional)
        if (produto.descricao !== undefined && produto.descricao !== null) {
            if (typeof produto.descricao !== 'string') {
                erros.push('A descrição do produto deve ser uma string');
            } else if (produto.descricao.trim().length > 500) {
                erros.push('A descrição do produto deve ter no máximo 500 caracteres');
            }
        }

        // Validação do preço
        if (produto.preco === undefined || produto.preco === null) {
            erros.push('O preço do produto é obrigatório');
        } else {
            const preco = Number(produto.preco);
            if (isNaN(preco)) {
                erros.push('O preço do produto deve ser um número');
            } else if (preco < 0) {
                erros.push('O preço do produto não pode ser negativo');
            } else if (preco > 999999.99) {
                erros.push('O preço do produto é muito alto');
            }
        }

        // Validação do estoque (opcional)
        if (produto.estoque !== undefined && produto.estoque !== null) {
            const estoque = Number(produto.estoque);
            if (isNaN(estoque)) {
                erros.push('O estoque do produto deve ser um número');
            } else if (!Number.isInteger(estoque)) {
                erros.push('O estoque do produto deve ser um número inteiro');
            } else if (estoque < 0) {
                erros.push('O estoque do produto não pode ser negativo');
            } else if (estoque > 999999) {
                erros.push('O valor do estoque é muito alto');
            }
        }

        // Validação da categoria (opcional)
        if (produto.categoria !== undefined && produto.categoria !== null) {
            if (typeof produto.categoria !== 'string') {
                erros.push('A categoria do produto deve ser uma string');
            } else if (produto.categoria.trim().length > 50) {
                erros.push('A categoria do produto deve ter no máximo 50 caracteres');
            }
        }

        return {
            valido: erros.length === 0,
            erros
        };
    },

    /**
     * Normaliza os dados de um produto
     * @param {Object} produto Dados do produto a normalizar
     * @returns {Object} Produto normalizado
     */
    normalizarProduto(produto) {
        const produtoNormalizado = {};

        // Normaliza o nome
        if (produto.nome !== undefined) {
            produtoNormalizado.nome = produto.nome.trim();
        }

        // Normaliza a descrição
        if (produto.descricao !== undefined) {
            produtoNormalizado.descricao = produto.descricao.trim();
        }

        // Normaliza o preço
        if (produto.preco !== undefined) {
            produtoNormalizado.preco = Number(produto.preco);
        }

        // Normaliza o estoque
        if (produto.estoque !== undefined) {
            produtoNormalizado.estoque = Number(produto.estoque);
        }

        // Normaliza a categoria
        if (produto.categoria !== undefined) {
            produtoNormalizado.categoria = produto.categoria.trim();
        }

        return produtoNormalizado;
    }
};

module.exports = validador; 