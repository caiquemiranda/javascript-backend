/**
 * Script para criar as tabelas do banco de dados
 */
const fs = require('fs');
const path = require('path');
const db = require('./connection');

const migrate = async () => {
    try {
        console.log('Iniciando migração do banco de dados...');

        // Garantir que o diretório data existe
        const dataDir = path.resolve(__dirname, '../../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
            console.log('Diretório data criado com sucesso.');
        }

        // Iniciar transação
        await db.beginTransaction();

        // Criar tabela de categorias
        await db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
        console.log('Tabela categories criada com sucesso.');

        // Criar tabela de tarefas
        await db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        due_date TEXT,
        priority TEXT NOT NULL,
        status TEXT NOT NULL,
        category_id INTEGER,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
      )
    `);
        console.log('Tabela tasks criada com sucesso.');

        // Criar tabela de etiquetas
        await db.exec(`
      CREATE TABLE IF NOT EXISTS labels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        color TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
        console.log('Tabela labels criada com sucesso.');

        // Criar tabela de relacionamento entre tarefas e etiquetas
        await db.exec(`
      CREATE TABLE IF NOT EXISTS task_labels (
        task_id INTEGER NOT NULL,
        label_id INTEGER NOT NULL,
        PRIMARY KEY (task_id, label_id),
        FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
        FOREIGN KEY (label_id) REFERENCES labels (id) ON DELETE CASCADE
      )
    `);
        console.log('Tabela task_labels criada com sucesso.');

        // Confirmar transação
        await db.commit();

        console.log('Migração concluída com sucesso!');
    } catch (error) {
        // Reverter transação em caso de erro
        await db.rollback();
        console.error('Erro durante a migração:', error.message);
        throw error;
    } finally {
        // Fechar conexão com o banco de dados
        await db.close();
    }
};

// Executar migração
migrate().catch(error => {
    console.error('Falha na migração:', error);
    process.exit(1);
}); 