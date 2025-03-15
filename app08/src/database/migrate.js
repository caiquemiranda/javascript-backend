/**
 * Script de migração para criar as tabelas no banco de dados SQLite
 */
const db = require('../config/database');
const fs = require('fs');
const path = require('path');

// Função para executar cada migração em ordem
const runMigrations = async () => {
    console.log('Iniciando migrações do banco de dados...');

    // Cria a tabela de categorias se não existir
    const createCategoriesTable = `
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            descricao TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // Cria a tabela de tarefas se não existir
    const createTasksTable = `
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descricao TEXT,
            concluida INTEGER DEFAULT 0,
            data_vencimento TEXT,
            prioridade INTEGER DEFAULT 1,
            categoria_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (categoria_id) REFERENCES categorias (id)
              ON DELETE SET NULL ON UPDATE CASCADE
        )
    `;

    // Cria a tabela de etiquetas se não existir
    const createTagsTable = `
        CREATE TABLE IF NOT EXISTS etiquetas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            cor TEXT DEFAULT '#3498db',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // Cria a tabela de relacionamento entre tarefas e etiquetas
    const createTaskTagsTable = `
        CREATE TABLE IF NOT EXISTS tarefa_etiquetas (
            tarefa_id INTEGER NOT NULL,
            etiqueta_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (tarefa_id, etiqueta_id),
            FOREIGN KEY (tarefa_id) REFERENCES tarefas (id) 
              ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (etiqueta_id) REFERENCES etiquetas (id)
              ON DELETE CASCADE ON UPDATE CASCADE
        )
    `;

    // Função para executar cada migração em ordem
    const runMigration = (query, name) => {
        return new Promise((resolve, reject) => {
            console.log(`Executando migração: ${name}...`);
            db.run(query, (err) => {
                if (err) {
                    console.error(`Erro na migração ${name}:`, err.message);
                    reject(err);
                } else {
                    console.log(`Migração ${name} concluída com sucesso.`);
                    resolve();
                }
            });
        });
    };

    try {
        // Executa as migrações em ordem
        await runMigration(createCategoriesTable, 'categorias');
        await runMigration(createTasksTable, 'tarefas');
        await runMigration(createTagsTable, 'etiquetas');
        await runMigration(createTaskTagsTable, 'tarefa_etiquetas');

        console.log('Todas as migrações foram concluídas com sucesso!');
    } catch (error) {
        console.error('Erro ao executar migrações:', error.message);
        process.exit(1);
    } finally {
        // Fecha a conexão com o banco de dados
        db.close();
    }
};

// Executa as migrações
runMigrations(); 