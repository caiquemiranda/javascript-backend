/**
 * Utilitário de validação para dados de produto
 */

/**
 * Valida os dados de um produto ao criar
 * @param {Object} produto Dados do produto a validar
 * @returns {Object} Objeto com erros encontrados (vazio se nenhum erro)
 */
const validarProduto = (produto) => {
    const erros = [];

    // Validação do nome
    if (!produto.nome) {
        erros.push('O nome do produto é obrigatório');
    } else if (produto.nome.length < 3) {
        erros.push('O nome do produto deve ter pelo menos 3 caracteres');
    }

    // Validação do preço
    if (produto.preco === undefined || produto.preco === null) {
        erros.push('O preço do produto é obrigatório');
    } else if (isNaN(produto.preco) || produto.preco <= 0) {
        erros.push('O preço do produto deve ser um número maior que zero');
    }

    // Validação do estoque
    if (produto.estoque !== undefined && produto.estoque !== null) {
        if (isNaN(produto.estoque) || !Number.isInteger(Number(produto.estoque)) || produto.estoque < 0) {
            erros.push('O estoque do produto deve ser um número inteiro não negativo');
        }
    }

    // Validação da categoria
    if (produto.categoria && produto.categoria.length < 2) {
        erros.push('A categoria deve ter pelo menos 2 caracteres');
    }

    return {
        valido: erros.length === 0,
        erros
    };
};

/**
 * Valida os dados de um produto ao atualizar
 * Menos restritivo que a validação de criação
 * @param {Object} produto Dados do produto a validar
 * @returns {Object} Objeto com erros encontrados (vazio se nenhum erro)
 */
const validarProdutoAtualizacao = (produto) => {
    const erros = [];

    // Validação do nome (se fornecido)
    if (produto.nome !== undefined && produto.nome !== null) {
        if (produto.nome === '') {
            erros.push('O nome do produto não pode ser vazio');
        } else if (produto.nome.length < 3) {
            erros.push('O nome do produto deve ter pelo menos 3 caracteres');
        }
    }

    // Validação do preço (se fornecido)
    if (produto.preco !== undefined && produto.preco !== null) {
        if (isNaN(produto.preco) || produto.preco <= 0) {
            erros.push('O preço do produto deve ser um número maior que zero');
        }
    }

    // Validação do estoque (se fornecido)
    if (produto.estoque !== undefined && produto.estoque !== null) {
        if (isNaN(produto.estoque) || !Number.isInteger(Number(produto.estoque)) || produto.estoque < 0) {
            erros.push('O estoque do produto deve ser um número inteiro não negativo');
        }
    }

    // Validação da categoria (se fornecida)
    if (produto.categoria !== undefined && produto.categoria !== null && produto.categoria !== '') {
        if (produto.categoria.length < 2) {
            erros.push('A categoria deve ter pelo menos 2 caracteres');
        }
    }

    return {
        valido: erros.length === 0,
        erros
    };
};

/**
 * Normaliza os dados de um produto para garantir tipos corretos
 * @param {Object} produto Dados do produto a normalizar
 * @returns {Object} Produto com dados normalizados
 */
const normalizarProduto = (produto) => {
    const produtoNormalizado = { ...produto };

    // Converte preço para número
    if (produtoNormalizado.preco !== undefined) {
        produtoNormalizado.preco = Number(produtoNormalizado.preco);
    }

    // Converte estoque para número inteiro
    if (produtoNormalizado.estoque !== undefined) {
        produtoNormalizado.estoque = parseInt(produtoNormalizado.estoque, 10);
    }

    // Certifica que strings não tenham espaços extras
    if (produtoNormalizado.nome) {
        produtoNormalizado.nome = produtoNormalizado.nome.trim();
    }

    if (produtoNormalizado.descricao) {
        produtoNormalizado.descricao = produtoNormalizado.descricao.trim();
    }

    if (produtoNormalizado.categoria) {
        produtoNormalizado.categoria = produtoNormalizado.categoria.trim();
    }

    return produtoNormalizado;
};

module.exports = {
    validarProduto,
    validarProdutoAtualizacao,
    normalizarProduto
}; 