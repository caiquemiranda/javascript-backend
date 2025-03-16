/**
 * Configurações do sistema
 */

// Importação de dependências
require('dotenv').config();

// Configuração principal
const config = {
    // Configuração do servidor
    server: {
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || 'development'
    },

    // Configuração de upload
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'),  // 5MB por padrão
        allowedImageTypes: (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/gif').split(','),
        allowedDocumentTypes: (process.env.ALLOWED_DOCUMENT_TYPES || 'application/pdf').split(','),
        imagePath: './uploads/images',
        documentPath: './uploads/documents'
    },

    // Outras configurações
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    },

    // Configuração de logs
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
    }
};

module.exports = config; 