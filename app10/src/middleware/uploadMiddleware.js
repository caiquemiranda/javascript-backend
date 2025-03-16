/**
 * Middleware para upload de arquivos usando Multer
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

// Garantir que os diretórios de upload existam
const ensureDirectories = () => {
    [config.upload.imagePath, config.upload.documentPath].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

// Chamar a função para criar os diretórios
ensureDirectories();

// Configuração do armazenamento para imagens
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.upload.imagePath);
    },
    filename: (req, file, cb) => {
        // Gerar um nome de arquivo único com UUID, preservando a extensão original
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});

// Configuração do armazenamento para documentos
const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.upload.documentPath);
    },
    filename: (req, file, cb) => {
        // Gerar um nome de arquivo único com UUID, preservando a extensão original
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});

// Filtro para validar tipos de imagem
const imageFilter = (req, file, cb) => {
    if (config.upload.allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Tipo de arquivo não permitido. Tipos aceitos: ${config.upload.allowedImageTypes.join(', ')}`), false);
    }
};

// Filtro para validar tipos de documento
const documentFilter = (req, file, cb) => {
    if (config.upload.allowedDocumentTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Tipo de arquivo não permitido. Tipos aceitos: ${config.upload.allowedDocumentTypes.join(', ')}`), false);
    }
};

// Middleware para upload de uma única imagem
const uploadSingleImage = multer({
    storage: imageStorage,
    limits: {
        fileSize: config.upload.maxFileSize
    },
    fileFilter: imageFilter
}).single('image');

// Middleware para upload de múltiplas imagens
const uploadMultipleImages = multer({
    storage: imageStorage,
    limits: {
        fileSize: config.upload.maxFileSize
    },
    fileFilter: imageFilter
}).array('images', 5); // Máximo de 5 imagens

// Middleware para upload de um único documento
const uploadSingleDocument = multer({
    storage: documentStorage,
    limits: {
        fileSize: config.upload.maxFileSize
    },
    fileFilter: documentFilter
}).single('document');

// Wrapper para tratamento de erros no upload de imagem única
const handleSingleImageUpload = (req, res, next) => {
    uploadSingleImage(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Erro do Multer
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: `O arquivo excede o tamanho máximo permitido de ${config.upload.maxFileSize / (1024 * 1024)}MB`
                });
            }
            return res.status(400).json({
                success: false,
                message: `Erro no upload: ${err.message}`
            });
        } else if (err) {
            // Outro tipo de erro
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Se não houve erro, continua para o próximo middleware
        next();
    });
};

// Wrapper para tratamento de erros no upload de múltiplas imagens
const handleMultipleImagesUpload = (req, res, next) => {
    uploadMultipleImages(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Erro do Multer
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: `Um ou mais arquivos excedem o tamanho máximo permitido de ${config.upload.maxFileSize / (1024 * 1024)}MB`
                });
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({
                    success: false,
                    message: 'Número de arquivos excede o limite permitido (máximo 5)'
                });
            }
            return res.status(400).json({
                success: false,
                message: `Erro no upload: ${err.message}`
            });
        } else if (err) {
            // Outro tipo de erro
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Se não houve erro, continua para o próximo middleware
        next();
    });
};

// Wrapper para tratamento de erros no upload de documento
const handleSingleDocumentUpload = (req, res, next) => {
    uploadSingleDocument(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Erro do Multer
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: `O arquivo excede o tamanho máximo permitido de ${config.upload.maxFileSize / (1024 * 1024)}MB`
                });
            }
            return res.status(400).json({
                success: false,
                message: `Erro no upload: ${err.message}`
            });
        } else if (err) {
            // Outro tipo de erro
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Se não houve erro, continua para o próximo middleware
        next();
    });
};

module.exports = {
    handleSingleImageUpload,
    handleMultipleImagesUpload,
    handleSingleDocumentUpload
}; 