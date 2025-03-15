/**
 * Modelo de Produto
 * Responsável pelas operações CRUD no arquivo JSON
 */
const fs = require('fs').promises;
const path = require('path');

// Caminho para o arquivo JSON de produtos
const produtosFilePath = path.join(__dirname, '../../data/produtos.json');

/**
 * Inicializa o arquivo de produtos se não existir
 */
const inicializarArquivo = async () => {
    try {
        await fs.access(produtosFilePath);
        // Arquivo existe, não faz nada
    } catch (error) {
        // Arquivo não existe, cria com array vazio
        await fs.writeFile(produtosFilePath, JSON.stringify([], null, 2), 'utf8');
        console.log('Arquivo de produtos criado com sucesso!');
    }
};

/**
 * Lê todos os produtos do arquivo
 * @returns {Promise<Array>} Array com todos os produtos
 */
const listarTodos = async () => {
    await inicializarArquivo();
    const dados = await fs.readFile(produtosFilePath, 'utf8');
    return JSON.parse(dados);
};

/**
 * Busca um produto pelo ID
 * @param {number} id ID do produto
 * @returns {Promise<Object|null>} Produto encontrado ou null
 */
const buscarPorId = async (id) => {
    const produtos = await listarTodos();
    return produtos.find(produto => produto.id === id) || null;
};

/**
 * Cria um novo produto
 * @param {Object} produto Dados do produto (sem ID)
 * @returns {Promise<Object>} Produto criado com ID
 */
const criar = async (produto) => {
    const produtos = await listarTodos();

    // Gera um novo ID (maior ID atual + 1)
    const novoId = produtos.length > 0
        ? Math.max(...produtos.map(p => p.id)) + 1
        : 1;

    // Adiciona data de cadastro e ID ao produto
    const novoProduto = {
        id: novoId,
        ...produto,
        dataCadastro: new Date().toISOString()
    };

    // Adiciona ao array e salva
    produtos.push(novoProduto);
    await fs.writeFile(produtosFilePath, JSON.stringify(produtos, null, 2), 'utf8');

    return novoProduto;
};

/**
 * Atualiza um produto existente
 * @param {number} id ID do produto a atualizar
 * @param {Object} dadosAtualizados Dados atualizados do produto
 * @returns {Promise<Object|null>} Produto atualizado ou null se não encontrado
 */
const atualizar = async (id, dadosAtualizados) => {
    const produtos = await listarTodos();
    const index = produtos.findIndex(produto => produto.id === id);

    // Se produto não existe, retorna null
    if (index === -1) {
        return null;
    }

    // Mantém o ID e a data de cadastro originais
    const produtoAtualizado = {
        ...produtos[index],
        ...dadosAtualizados,
        id, // Garante que o ID não será alterado
        dataAtualizacao: new Date().toISOString() // Adiciona data de atualização
    };

    // Substitui o produto no array
    produtos[index] = produtoAtualizado;

    // Salva o arquivo atualizado
    await fs.writeFile(produtosFilePath, JSON.stringify(produtos, null, 2), 'utf8');

    return produtoAtualizado;
};

/**
 * Remove um produto pelo ID
 * @param {number} id ID do produto a remover
 * @returns {Promise<boolean>} true se removido, false se não encontrado
 */
const remover = async (id) => {
    const produtos = await listarTodos();
    const produtosAtualizados = produtos.filter(produto => produto.id !== id);

    // Se o tamanho é o mesmo, o produto não existia
    if (produtosAtualizados.length === produtos.length) {
        return false;
    }

    // Salva o arquivo atualizado
    await fs.writeFile(produtosFilePath, JSON.stringify(produtosAtualizados, null, 2), 'utf8');

    return true;
};

/**
 * Busca produtos por termo em nome, descrição ou categoria
 * @param {string} termo Termo para busca
 * @returns {Promise<Array>} Produtos encontrados
 */
const buscarPorTermo = async (termo) => {
    const produtos = await listarTodos();
    const termoBusca = termo.toLowerCase();

    return produtos.filter(produto =>
        produto.nome.toLowerCase().includes(termoBusca) ||
        (produto.descricao && produto.descricao.toLowerCase().includes(termoBusca)) ||
        (produto.categoria && produto.categoria.toLowerCase().includes(termoBusca))
    );
};

module.exports = {
    listarTodos,
    buscarPorId,
    criar,
    atualizar,
    remover,
    buscarPorTermo
}; 