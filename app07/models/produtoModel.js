const fs = require('fs').promises;
const path = require('path');

// Caminho para o arquivo de dados
const dataPath = path.join(__dirname, '../data/produtos.json');

/**
 * Modelo para operações relacionadas a produtos
 */
const produtoModel = {
    /**
     * Lê os dados do arquivo JSON
     * @returns {Promise<Array>} Array de produtos
     */
    async lerDados() {
        try {
            // Verifica se o diretório existe, se não, cria
            const dataDir = path.dirname(dataPath);
            try {
                await fs.access(dataDir);
            } catch (error) {
                await fs.mkdir(dataDir, { recursive: true });
            }

            // Verifica se o arquivo existe, se não, cria com array vazio
            try {
                await fs.access(dataPath);
            } catch (error) {
                await fs.writeFile(dataPath, JSON.stringify([], null, 2));
                return [];
            }

            // Lê o arquivo
            const data = await fs.readFile(dataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Erro ao ler dados:', error);
            throw new Error('Erro ao ler dados do arquivo');
        }
    },

    /**
     * Escreve dados no arquivo JSON
     * @param {Array} dados Array de produtos
     * @returns {Promise<void>}
     */
    async escreverDados(dados) {
        try {
            await fs.writeFile(dataPath, JSON.stringify(dados, null, 2));
        } catch (error) {
            console.error('Erro ao escrever dados:', error);
            throw new Error('Erro ao escrever dados no arquivo');
        }
    },

    /**
     * Lista todos os produtos
     * @returns {Promise<Array>} Array de produtos
     */
    async listarTodos() {
        return await this.lerDados();
    },

    /**
     * Obtém um produto pelo ID
     * @param {number} id ID do produto
     * @returns {Promise<Object|null>} Produto encontrado ou null
     */
    async obterPorId(id) {
        const produtos = await this.lerDados();
        return produtos.find(produto => produto.id === id) || null;
    },

    /**
     * Busca produtos por termo
     * @param {string} termo Termo de busca
     * @returns {Promise<Array>} Array de produtos encontrados
     */
    async buscar(termo) {
        const produtos = await this.lerDados();
        const termoBusca = termo.toLowerCase();

        return produtos.filter(produto => {
            return (
                (produto.nome && produto.nome.toLowerCase().includes(termoBusca)) ||
                (produto.descricao && produto.descricao.toLowerCase().includes(termoBusca)) ||
                (produto.categoria && produto.categoria.toLowerCase().includes(termoBusca))
            );
        });
    },

    /**
     * Cria um novo produto
     * @param {Object} produto Dados do produto
     * @returns {Promise<Object>} Produto criado
     */
    async criar(produto) {
        const produtos = await this.lerDados();

        // Gera um novo ID (maior ID atual + 1)
        const novoId = produtos.length > 0
            ? Math.max(...produtos.map(p => p.id)) + 1
            : 1;

        // Cria o novo produto com ID
        const novoProduto = {
            id: novoId,
            ...produto,
            dataCriacao: new Date().toISOString()
        };

        // Adiciona ao array e salva
        produtos.push(novoProduto);
        await this.escreverDados(produtos);

        return novoProduto;
    },

    /**
     * Atualiza um produto existente
     * @param {number} id ID do produto
     * @param {Object} dadosProduto Novos dados do produto
     * @returns {Promise<Object>} Produto atualizado
     */
    async atualizar(id, dadosProduto) {
        const produtos = await this.lerDados();
        const index = produtos.findIndex(produto => produto.id === id);

        if (index === -1) {
            throw new Error('Produto não encontrado');
        }

        // Atualiza o produto mantendo o ID e a data de criação
        const produtoAtualizado = {
            ...produtos[index],
            ...dadosProduto,
            id, // Garante que o ID não seja alterado
            dataAtualizacao: new Date().toISOString()
        };

        produtos[index] = produtoAtualizado;
        await this.escreverDados(produtos);

        return produtoAtualizado;
    },

    /**
     * Remove um produto
     * @param {number} id ID do produto
     * @returns {Promise<void>}
     */
    async remover(id) {
        const produtos = await this.lerDados();
        const novosProdutos = produtos.filter(produto => produto.id !== id);

        if (novosProdutos.length === produtos.length) {
            throw new Error('Produto não encontrado');
        }

        await this.escreverDados(novosProdutos);
    }
};

module.exports = produtoModel; 