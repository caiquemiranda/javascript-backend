/**
 * Controlador para gerenciamento de arquivos
 */

const path = require('path');
const fs = require('fs');
const config = require('../config/config');
const { removeFile, listImages, listDocuments, getFileInfo } = require('../utils/fileUtils');

/**
 * Controlador de arquivos
 */
const fileController = {
    /**
     * Upload de uma única imagem
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     */
    uploadImage: (req, res) => {
        try {
            // Verificar se o arquivo foi enviado
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Nenhuma imagem foi enviada'
                });
            }

            // Extrair informações do arquivo
            const { filename, originalname, mimetype, size, path: filePath } = req.file;

            // Formatar o tamanho para legibilidade
            const fileSize = size < 1024 * 1024
                ? `${(size / 1024).toFixed(2)} KB`
                : `${(size / (1024 * 1024)).toFixed(2)} MB`;

            // Criar URL para acesso ao arquivo
            const fileUrl = `/files/images/${filename}`;

            res.status(201).json({
                success: true,
                message: 'Imagem enviada com sucesso',
                file: {
                    name: filename,
                    originalName: originalname,
                    mimeType: mimetype,
                    size: fileSize,
                    path: filePath,
                    url: fileUrl
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao fazer upload da imagem',
                error: error.message
            });
        }
    },

    /**
     * Upload de múltiplas imagens
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     */
    uploadMultipleImages: (req, res) => {
        try {
            // Verificar se arquivos foram enviados
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Nenhuma imagem foi enviada'
                });
            }

            // Processar informações dos arquivos
            const files = req.files.map(file => {
                const fileSize = file.size < 1024 * 1024
                    ? `${(file.size / 1024).toFixed(2)} KB`
                    : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

                return {
                    name: file.filename,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: fileSize,
                    path: file.path,
                    url: `/files/images/${file.filename}`
                };
            });

            res.status(201).json({
                success: true,
                message: `${files.length} imagens enviadas com sucesso`,
                files
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao fazer upload das imagens',
                error: error.message
            });
        }
    },

    /**
     * Upload de um documento
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     */
    uploadDocument: (req, res) => {
        try {
            // Verificar se o arquivo foi enviado
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Nenhum documento foi enviado'
                });
            }

            // Extrair informações do arquivo
            const { filename, originalname, mimetype, size, path: filePath } = req.file;

            // Formatar o tamanho para legibilidade
            const fileSize = size < 1024 * 1024
                ? `${(size / 1024).toFixed(2)} KB`
                : `${(size / (1024 * 1024)).toFixed(2)} MB`;

            // Criar URL para acesso ao arquivo
            const fileUrl = `/files/documents/${filename}`;

            res.status(201).json({
                success: true,
                message: 'Documento enviado com sucesso',
                file: {
                    name: filename,
                    originalName: originalname,
                    mimeType: mimetype,
                    size: fileSize,
                    path: filePath,
                    url: fileUrl
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao fazer upload do documento',
                error: error.message
            });
        }
    },

    /**
     * Lista todas as imagens
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     */
    getAllImages: async (req, res) => {
        try {
            const images = await listImages();

            // Formatar tamanhos para legibilidade
            const formattedImages = images.map(image => {
                const size = image.size < 1024 * 1024
                    ? `${(image.size / 1024).toFixed(2)} KB`
                    : `${(image.size / (1024 * 1024)).toFixed(2)} MB`;

                return {
                    ...image,
                    readableSize: size
                };
            });

            res.json({
                success: true,
                count: formattedImages.length,
                images: formattedImages
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao listar imagens',
                error: error.message
            });
        }
    },

    /**
     * Lista todos os documentos
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     */
    getAllDocuments: async (req, res) => {
        try {
            const documents = await listDocuments();

            // Formatar tamanhos para legibilidade
            const formattedDocuments = documents.map(doc => {
                const size = doc.size < 1024 * 1024
                    ? `${(doc.size / 1024).toFixed(2)} KB`
                    : `${(doc.size / (1024 * 1024)).toFixed(2)} MB`;

                return {
                    ...doc,
                    readableSize: size
                };
            });

            res.json({
                success: true,
                count: formattedDocuments.length,
                documents: formattedDocuments
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao listar documentos',
                error: error.message
            });
        }
    },

    /**
     * Exclui uma imagem
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     */
    deleteImage: async (req, res) => {
        try {
            const { filename } = req.params;

            if (!filename) {
                return res.status(400).json({
                    success: false,
                    message: 'Nome do arquivo não fornecido'
                });
            }

            const filePath = path.join(config.upload.imagePath, filename);

            // Verificar se o arquivo existe
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: 'Arquivo não encontrado'
                });
            }

            // Remover o arquivo
            const removed = await removeFile(filePath);

            if (removed) {
                res.json({
                    success: true,
                    message: 'Imagem excluída com sucesso'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Erro ao excluir imagem'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao excluir imagem',
                error: error.message
            });
        }
    },

    /**
     * Exclui um documento
     * @param {Object} req - Objeto de requisição
     * @param {Object} res - Objeto de resposta
     */
    deleteDocument: async (req, res) => {
        try {
            const { filename } = req.params;

            if (!filename) {
                return res.status(400).json({
                    success: false,
                    message: 'Nome do arquivo não fornecido'
                });
            }

            const filePath = path.join(config.upload.documentPath, filename);

            // Verificar se o arquivo existe
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: 'Arquivo não encontrado'
                });
            }

            // Remover o arquivo
            const removed = await removeFile(filePath);

            if (removed) {
                res.json({
                    success: true,
                    message: 'Documento excluído com sucesso'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Erro ao excluir documento'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao excluir documento',
                error: error.message
            });
        }
    }
};

module.exports = fileController; 