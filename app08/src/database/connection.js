const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

// Caminho para o arquivo do banco de dados
const dbPath = path.resolve(__dirname, '../../data/database.sqlite');

// Função para criar uma conexão com o banco de dados
const getConnection = async () => {
    try {
        // Abrir conexão com o banco de dados
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        // Configurar o banco de dados para retornar objetos em vez de arrays
        db.on('trace', (sql) => {
            console.debug(`[SQL] ${sql}`);
        });

        // Habilitar chaves estrangeiras
        await db.exec('PRAGMA foreign_keys = ON');

        return db;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message);
        throw error;
    }
};

// Singleton para manter uma única conexão com o banco de dados
let dbInstance = null;

// Inicializar a conexão com o banco de dados
const initializeDatabase = async () => {
    if (!dbInstance) {
        dbInstance = await getConnection();
    }
    return dbInstance;
};

// Métodos para operações no banco de dados
const db = {
    /**
     * Executa uma consulta SQL que retorna múltiplas linhas
     * @param {string} sql - Consulta SQL
     * @param {Array} params - Parâmetros da consulta
     * @returns {Promise<Array>} Resultado da consulta
     */
    all: async (sql, params = []) => {
        const connection = await initializeDatabase();
        return connection.all(sql, params);
    },

    /**
     * Executa uma consulta SQL que retorna uma única linha
     * @param {string} sql - Consulta SQL
     * @param {Array} params - Parâmetros da consulta
     * @returns {Promise<Object>} Resultado da consulta
     */
    get: async (sql, params = []) => {
        const connection = await initializeDatabase();
        return connection.get(sql, params);
    },

    /**
     * Executa uma consulta SQL que não retorna dados
     * @param {string} sql - Consulta SQL
     * @param {Array} params - Parâmetros da consulta
     * @returns {Promise<Object>} Resultado da execução
     */
    run: async (sql, params = []) => {
        const connection = await initializeDatabase();
        return connection.run(sql, params);
    },

    /**
     * Executa uma consulta SQL diretamente
     * @param {string} sql - Consulta SQL
     * @returns {Promise<void>}
     */
    exec: async (sql) => {
        const connection = await initializeDatabase();
        return connection.exec(sql);
    },

    /**
     * Inicia uma transação
     * @returns {Promise<void>}
     */
    beginTransaction: async () => {
        const connection = await initializeDatabase();
        return connection.exec('BEGIN TRANSACTION');
    },

    /**
     * Confirma uma transação
     * @returns {Promise<void>}
     */
    commit: async () => {
        const connection = await initializeDatabase();
        return connection.exec('COMMIT');
    },

    /**
     * Reverte uma transação
     * @returns {Promise<void>}
     */
    rollback: async () => {
        const connection = await initializeDatabase();
        return connection.exec('ROLLBACK');
    },

    /**
     * Verifica a conexão com o banco de dados
     * @returns {Promise<boolean>} Verdadeiro se a conexão estiver ativa
     */
    checkConnection: async () => {
        try {
            const connection = await initializeDatabase();
            await connection.get('SELECT 1');
            return true;
        } catch (error) {
            console.error('Erro ao verificar conexão com o banco de dados:', error.message);
            return false;
        }
    },

    /**
     * Fecha a conexão com o banco de dados
     * @returns {Promise<void>}
     */
    close: async () => {
        if (dbInstance) {
            await dbInstance.close();
            dbInstance = null;
        }
    }
};

module.exports = db; 