/**
 * Rotas para gerenciamento de arquivos
 */

const express = require('express');
const fileController = require('../controllers/fileController');
const {
    handleSingleImageUpload,
    handleMultipleImagesUpload,
    handleSingleDocumentUpload
} = require('../middleware/uploadMiddleware');
const router = express.Router();

/**
 * @route   POST /api/files/images/upload
 * @desc    Upload de uma única imagem
 * @access  Público
 */
router.post('/images/upload', handleSingleImageUpload, fileController.uploadImage);

/**
 * @route   POST /api/files/images/multiple
 * @desc    Upload de múltiplas imagens
 * @access  Público
 */
router.post('/images/multiple', handleMultipleImagesUpload, fileController.uploadMultipleImages);

/**
 * @route   POST /api/files/documents/upload
 * @desc    Upload de um documento
 * @access  Público
 */
router.post('/documents/upload', handleSingleDocumentUpload, fileController.uploadDocument);

/**
 * @route   GET /api/files/images
 * @desc    Listar todas as imagens
 * @access  Público
 */
router.get('/images', fileController.getAllImages);

/**
 * @route   GET /api/files/documents
 * @desc    Listar todos os documentos
 * @access  Público
 */
router.get('/documents', fileController.getAllDocuments);

/**
 * @route   DELETE /api/files/images/:filename
 * @desc    Excluir uma imagem
 * @access  Público
 */
router.delete('/images/:filename', fileController.deleteImage);

/**
 * @route   DELETE /api/files/documents/:filename
 * @desc    Excluir um documento
 * @access  Público
 */
router.delete('/documents/:filename', fileController.deleteDocument);

module.exports = router; 