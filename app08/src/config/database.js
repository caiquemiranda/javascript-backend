/**
 * Configuração da conexão com o banco de dados SQLite
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Caminho para o diretório de dados
const dbDir = path.join(__dirname, '../../data');

// Verifica se o diretório existe, caso contrário, cria
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('Diretório de dados criado com sucesso.');
}

// Caminho para o arquivo do banco de dados
const dbPath = path.join(dbDir, 'tarefas.sqlite');

// Cria uma nova instância de conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
    } else {
        console.log('Conexão estabelecida com o banco de dados SQLite.');

        // Habilita as chaves estrangeiras (importante para integridade referencial)
        db.run('PRAGMA foreign_keys = ON', (err) => {
            if (err) {
                console.error('Erro ao habilitar chaves estrangeiras:', err.message);
            }
        });
    }
});

// Exporta a conexão com o banco de dados
module.exports = db; 