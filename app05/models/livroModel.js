const fs = require('fs').promises;
const path = require('path');

// Caminho para o arquivo JSON
const caminhoArquivo = path.join(__dirname, '../data/livros.json');

/**
 * Lê todos os livros do arquivo JSON
 * @returns {Promise<Array>} Array de livros
 */
async function obterTodos() {
    try {
        // Lê o conteúdo do arquivo
        const dados = await fs.readFile(caminhoArquivo, 'utf8');

        // Retorna os dados convertidos de JSON para objeto JavaScript
        return JSON.parse(dados);
    } catch (erro) {
        console.error('Erro ao ler o arquivo de livros:', erro);

        // Se o arquivo não existir, retorna um array vazio
        if (erro.code === 'ENOENT') {
            await fs.writeFile(caminhoArquivo, '[]', 'utf8');
            return [];
        }

        // Re-lança o erro para tratamento no controlador
        throw erro;
    }
}

/**
 * Salva todos os livros no arquivo JSON
 * @param {Array} livros Array de livros a serem salvos
 * @returns {Promise<void>}
 */
async function salvarTodos(livros) {
    try {
        // Converte o array de livros para JSON com formatação legível
        const dadosJSON = JSON.stringify(livros, null, 2);

        // Escreve no arquivo
        await fs.writeFile(caminhoArquivo, dadosJSON, 'utf8');
    } catch (erro) {
        console.error('Erro ao salvar o arquivo de livros:', erro);
        throw erro;
    }
}

/**
 * Obtém um livro pelo ID
 * @param {number} id ID do livro a ser buscado
 * @returns {Promise<Object|null>} Livro encontrado ou null
 */
async function obterPorId(id) {
    try {
        const livros = await obterTodos();

        // Converte o ID para número e busca o livro
        const idNumerico = Number(id);
        return livros.find(livro => livro.id === idNumerico) || null;
    } catch (erro) {
        console.error(`Erro ao buscar livro com ID ${id}:`, erro);
        throw erro;
    }
}

/**
 * Adiciona um novo livro
 * @param {Object} livroNovo Dados do novo livro (sem ID)
 * @returns {Promise<Object>} Livro adicionado com ID
 */
async function adicionar(livroNovo) {
    try {
        const livros = await obterTodos();

        // Encontra o maior ID atual e adiciona 1 para o novo livro
        const maxId = livros.length > 0
            ? Math.max(...livros.map(livro => livro.id))
            : 0;

        // Cria o novo livro com ID
        const livroComId = {
            id: maxId + 1,
            ...livroNovo
        };

        // Adiciona ao array e salva
        livros.push(livroComId);
        await salvarTodos(livros);

        return livroComId;
    } catch (erro) {
        console.error('Erro ao adicionar livro:', erro);
        throw erro;
    }
}

/**
 * Atualiza um livro existente
 * @param {number} id ID do livro a ser atualizado
 * @param {Object} dadosAtualizados Dados a serem atualizados
 * @returns {Promise<Object|null>} Livro atualizado ou null se não encontrado
 */
async function atualizar(id, dadosAtualizados) {
    try {
        const livros = await obterTodos();
        const idNumerico = Number(id);

        // Encontra o índice do livro no array
        const indice = livros.findIndex(livro => livro.id === idNumerico);

        // Se não encontrar, retorna null
        if (indice === -1) {
            return null;
        }

        // Cria uma cópia do livro original e mescla com os dados atualizados
        // preservando o ID original
        const livroAtualizado = {
            ...livros[indice],
            ...dadosAtualizados,
            id: idNumerico // Garantir que o ID não seja alterado
        };

        // Substitui o livro antigo pelo atualizado
        livros[indice] = livroAtualizado;

        // Salva os livros atualizados
        await salvarTodos(livros);

        return livroAtualizado;
    } catch (erro) {
        console.error(`Erro ao atualizar livro com ID ${id}:`, erro);
        throw erro;
    }
}

/**
 * Remove um livro pelo ID
 * @param {number} id ID do livro a ser removido
 * @returns {Promise<boolean>} true se removido, false se não encontrado
 */
async function remover(id) {
    try {
        const livros = await obterTodos();
        const idNumerico = Number(id);

        // Filtra o array mantendo apenas os livros com ID diferente
        const livrosRestantes = livros.filter(livro => livro.id !== idNumerico);

        // Se o tamanho do array não mudou, o livro não existia
        if (livrosRestantes.length === livros.length) {
            return false;
        }

        // Salva o array atualizado
        await salvarTodos(livrosRestantes);

        return true;
    } catch (erro) {
        console.error(`Erro ao remover livro com ID ${id}:`, erro);
        throw erro;
    }
}

/**
 * Busca livros por um termo em vários campos
 * @param {string} termo Termo de busca
 * @returns {Promise<Array>} Array de livros que correspondem à busca
 */
async function buscar(termo) {
    try {
        if (!termo) return [];

        const livros = await obterTodos();
        const termoBusca = termo.toLowerCase();

        // Filtra os livros que contêm o termo em qualquer campo de texto
        return livros.filter(livro =>
            livro.titulo.toLowerCase().includes(termoBusca) ||
            livro.autor.toLowerCase().includes(termoBusca) ||
            livro.genero.toLowerCase().includes(termoBusca)
        );
    } catch (erro) {
        console.error(`Erro ao buscar livros com termo "${termo}":`, erro);
        throw erro;
    }
}

module.exports = {
    obterTodos,
    obterPorId,
    adicionar,
    atualizar,
    remover,
    buscar
}; 