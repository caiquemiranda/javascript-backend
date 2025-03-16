/**
 * Script para testar a conexão com o banco de dados
 * Execute com: node src/scripts/testDatabase.js
 */
require('dotenv').config();
const { testConnection } = require('../database');
const logger = require('../utils/logger');

async function main() {
    try {
        logger.info('Testando conexão com o banco de dados...');
        await testConnection();
        logger.info('Conexão com o banco de dados estabelecida com sucesso!');
        process.exit(0);
    } catch (error) {
        logger.error('Erro ao conectar com o banco de dados:', error);
        process.exit(1);
    }
}

main(); 