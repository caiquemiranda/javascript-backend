const { Sequelize } = require('sequelize');
const config = require('../config/database');
const User = require('../models/User');
const logger = require('../utils/logger');

// Criar instância do Sequelize com configuração do ambiente atual
const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

// Inicializar modelos
const models = {
    User: User.init(sequelize)
};

// Testar conexão com o banco de dados
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Conexão com o banco de dados estabelecida com sucesso');
    } catch (error) {
        logger.error('Erro ao conectar com o banco de dados:', error);
        throw error;
    }
};

module.exports = {
    sequelize,
    models,
    testConnection
}; 