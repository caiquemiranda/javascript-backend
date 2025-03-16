const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const logger = require('../utils/logger');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Cria a instância do Sequelize com a configuração adequada para o ambiente
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

// Função para testar a conexão com o banco de dados
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        logger.info('Conexão com o banco de dados estabelecida com sucesso');
        return true;
    } catch (error) {
        logger.error('Erro ao conectar ao banco de dados:', error);
        return false;
    }
};

// Importação e inicialização de modelos
const models = {
    User: require('../models/User')(sequelize, Sequelize.DataTypes),
    // Role: require('../models/Role')(sequelize, Sequelize.DataTypes),
    // Outros modelos...
};

// Configuração de associações entre modelos
Object.values(models)
    .filter(model => typeof model.associate === 'function')
    .forEach(model => model.associate(models));

module.exports = {
    sequelize,
    Sequelize,
    models,
    testConnection,
}; 