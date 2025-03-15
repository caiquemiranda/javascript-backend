/**
 * Serviço para manipulação de arquivos
 * Fornece métodos para leitura e escrita de arquivos
 */
const fs = require('fs').promises;
const path = require('path');

/**
 * Lê o conteúdo de um arquivo
 * @param {string} filePath - Caminho do arquivo a ser lido
 * @returns {Promise<string>} - Conteúdo do arquivo
 */
const readFile = async (filePath) => {
    try {
        return await fs.readFile(filePath, 'utf8');
    } catch (error) {
        console.error(`Erro ao ler o arquivo ${filePath}:`, error);

        // Se o arquivo não existir, retorna null
        if (error.code === 'ENOENT') {
            return null;
        }

        throw error;
    }
};

/**
 * Lê um arquivo JSON e converte para objeto JavaScript
 * @param {string} filePath - Caminho do arquivo JSON
 * @returns {Promise<Object|Array>} - Objeto ou array JavaScript
 */
const readJsonFile = async (filePath) => {
    try {
        const data = await readFile(filePath);

        // Se o arquivo não existir, retorna um array vazio
        if (data === null) {
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        console.error(`Erro ao ler o arquivo JSON ${filePath}:`, error);

        // Se houver erro de parsing, retorna um array vazio
        if (error instanceof SyntaxError) {
            return [];
        }

        throw error;
    }
};

/**
 * Escreve dados em um arquivo
 * @param {string} filePath - Caminho do arquivo a ser escrito
 * @param {string} data - Dados a serem escritos
 * @returns {Promise<void>}
 */
const writeFile = async (filePath, data) => {
    try {
        // Garante que o diretório existe
        const directory = path.dirname(filePath);
        await fs.mkdir(directory, { recursive: true });

        // Escreve no arquivo
        await fs.writeFile(filePath, data, 'utf8');
    } catch (error) {
        console.error(`Erro ao escrever no arquivo ${filePath}:`, error);
        throw error;
    }
};

/**
 * Escreve um objeto JavaScript em um arquivo JSON
 * @param {string} filePath - Caminho do arquivo JSON
 * @param {Object|Array} data - Dados a serem escritos
 * @returns {Promise<void>}
 */
const writeJsonFile = async (filePath, data) => {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await writeFile(filePath, jsonData);
    } catch (error) {
        console.error(`Erro ao escrever no arquivo JSON ${filePath}:`, error);
        throw error;
    }
};

module.exports = {
    readFile,
    readJsonFile,
    writeFile,
    writeJsonFile
}; 