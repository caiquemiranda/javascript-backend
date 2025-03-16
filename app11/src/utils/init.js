const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Cria diretórios necessários para a aplicação
 */
const initializeDirectories = () => {
    const directories = [
        'logs',
        'uploads',
        'uploads/avatars',
        'uploads/temp'
    ];

    directories.forEach(dir => {
        const dirPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(dirPath)) {
            try {
                fs.mkdirSync(dirPath, { recursive: true });
                logger.info(`Diretório criado: ${dir}`);
            } catch (error) {
                logger.error(`Erro ao criar diretório ${dir}:`, error);
            }
        }
    });
};

/**
 * Inicializa recursos necessários para a aplicação
 */
const initialize = () => {
    try {
        // Criar diretórios necessários
        initializeDirectories();

        logger.info('Inicialização concluída');
    } catch (error) {
        logger.error('Erro durante a inicialização:', error);
        process.exit(1);
    }
};

module.exports = {
    initialize
}; 