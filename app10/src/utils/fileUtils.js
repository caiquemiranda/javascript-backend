/**
 * Utilitários para manipulação de arquivos
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/config');

/**
 * Remove um arquivo do sistema
 * @param {string} filePath - Caminho completo do arquivo
 * @returns {Promise<boolean>} Verdadeiro se o arquivo foi removido com sucesso
 */
const removeFile = async (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Erro ao remover arquivo ${filePath}:`, error);
        return false;
    }
};

/**
 * Lista todos os arquivos em um diretório
 * @param {string} dirPath - Caminho do diretório
 * @returns {Promise<Array>} Lista de arquivos no diretório
 */
const listFiles = async (dirPath) => {
    try {
        if (!fs.existsSync(dirPath)) {
            return [];
        }

        const files = await fs.promises.readdir(dirPath);
        return files.map(file => ({
            name: file,
            path: path.join(dirPath, file),
            url: `/files/${path.basename(dirPath)}/${file}`,
            size: fs.statSync(path.join(dirPath, file)).size,
            type: path.extname(file).slice(1),
            uploaded: fs.statSync(path.join(dirPath, file)).mtime
        }));
    } catch (error) {
        console.error(`Erro ao listar arquivos em ${dirPath}:`, error);
        return [];
    }
};

/**
 * Obtém informações de um arquivo
 * @param {string} filePath - Caminho completo do arquivo
 * @returns {Promise<Object|null>} Informações do arquivo ou null se não existir
 */
const getFileInfo = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            return null;
        }

        const stats = await fs.promises.stat(filePath);
        return {
            name: path.basename(filePath),
            path: filePath,
            size: stats.size,
            type: path.extname(filePath).slice(1),
            uploaded: stats.mtime
        };
    } catch (error) {
        console.error(`Erro ao obter informações do arquivo ${filePath}:`, error);
        return null;
    }
};

/**
 * Lista todas as imagens
 * @returns {Promise<Array>} Lista de imagens
 */
const listImages = async () => {
    return await listFiles(config.upload.imagePath);
};

/**
 * Lista todos os documentos
 * @returns {Promise<Array>} Lista de documentos
 */
const listDocuments = async () => {
    return await listFiles(config.upload.documentPath);
};

module.exports = {
    removeFile,
    listFiles,
    getFileInfo,
    listImages,
    listDocuments
}; 