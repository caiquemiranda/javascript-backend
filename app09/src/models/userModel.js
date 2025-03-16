/**
 * Modelo de usuário para acesso ao banco de dados
 */

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const config = require('../config/config');
const { hashPassword } = require('../utils/authUtils');

// Configuração do banco de dados
let db;

/**
 * Inicializa a conexão com o banco de dados
 */
const initDatabase = async () => {
    // Garantir que o diretório data existe
    const dbDir = path.dirname(config.database.path);

    // Abrir conexão com o banco de dados
    db = await open({
        filename: config.database.path,
        driver: sqlite3.Database
    });

    // Criar tabela de usuários se não existir
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Adicionar usuário administrador padrão se não existir
    const adminExists = await db.get('SELECT * FROM users WHERE email = ?', ['admin@example.com']);
    if (!adminExists) {
        const hashedPassword = await hashPassword('Admin123');
        await db.run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Administrador', 'admin@example.com', hashedPassword, 'admin']
        );
        console.log('Usuário administrador padrão criado com sucesso.');
    }

    console.log('Banco de dados inicializado com sucesso.');
    return db;
};

/**
 * Busca todos os usuários do banco de dados
 * @returns {Promise<Array>} Lista de usuários
 */
const getAllUsers = async () => {
    return await db.all('SELECT id, name, email, role, created_at, updated_at FROM users');
};

/**
 * Busca um usuário pelo ID
 * @param {number} id - ID do usuário
 * @returns {Promise<Object|null>} Dados do usuário ou null se não encontrado
 */
const getUserById = async (id) => {
    return await db.get('SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?', [id]);
};

/**
 * Busca um usuário pelo email
 * @param {string} email - Email do usuário
 * @returns {Promise<Object|null>} Dados completos do usuário (incluindo senha) ou null se não encontrado
 */
const getUserByEmail = async (email) => {
    return await db.get('SELECT * FROM users WHERE email = ?', [email]);
};

/**
 * Cria um novo usuário no banco de dados
 * @param {Object} userData - Dados do usuário (name, email, password)
 * @returns {Promise<Object>} Dados do usuário criado
 */
const createUser = async (userData) => {
    const { name, email, password } = userData;
    const role = userData.role || 'user'; // Default role é 'user'

    // Hash da senha
    const hashedPassword = await hashPassword(password);

    // Inserir usuário
    const result = await db.run(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
    );

    // Retornar usuário criado
    return {
        id: result.lastID,
        name,
        email,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
};

/**
 * Atualiza os dados de um usuário
 * @param {number} id - ID do usuário
 * @param {Object} userData - Dados a serem atualizados
 * @returns {Promise<boolean>} Verdadeiro se a atualização foi bem-sucedida
 */
const updateUser = async (id, userData) => {
    // Preparar dados para atualização
    const updates = [];
    const values = [];

    if (userData.name !== undefined) {
        updates.push('name = ?');
        values.push(userData.name);
    }

    if (userData.email !== undefined) {
        updates.push('email = ?');
        values.push(userData.email);
    }

    if (userData.password !== undefined) {
        const hashedPassword = await hashPassword(userData.password);
        updates.push('password = ?');
        values.push(hashedPassword);
    }

    if (userData.role !== undefined) {
        updates.push('role = ?');
        values.push(userData.role);
    }

    // Adicionar updated_at
    updates.push('updated_at = CURRENT_TIMESTAMP');

    // Se não houver nada para atualizar
    if (updates.length === 1) {
        return false;
    }

    // Adicionar id para a cláusula WHERE
    values.push(id);

    // Executar atualização
    const result = await db.run(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
    );

    return result.changes > 0;
};

/**
 * Exclui um usuário do banco de dados
 * @param {number} id - ID do usuário
 * @returns {Promise<boolean>} Verdadeiro se o usuário foi excluído
 */
const deleteUser = async (id) => {
    const result = await db.run('DELETE FROM users WHERE id = ?', [id]);
    return result.changes > 0;
};

module.exports = {
    initDatabase,
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
}; 