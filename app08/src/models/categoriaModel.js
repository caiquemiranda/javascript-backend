/**
 * Modelo para operações relacionadas a categorias
 */
const db = require('../config/database');
const { promisify } = require('util');

// Transforma funções de callback em promises
const dbAll = promisify(db.all.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbRun = promisify(db.run.bind(db));

// Modelo de categorias
const categoriaModel = {
    /**
     * Lista todas as categorias
     * @returns {Promise<Array>} Array de categorias
     */
    async listarTodas() {
        try {
            const query = `
                SELECT c.*, 
                       COUNT(t.id) as total_tarefas,
                       SUM(CASE WHEN t.concluida = 1 THEN 1 ELSE 0 END) as tarefas_concluidas
                FROM categorias c
                LEFT JOIN tarefas t ON c.id = t.categoria_id
                GROUP BY c.id
                ORDER BY c.nome
            `;

            return await dbAll(query);
        } catch (error) {
            console.error('Erro ao listar categorias:', error);
            throw new Error('Erro ao listar categorias: ' + error.message);
        }
    },

    /**
     * Busca uma categoria pelo ID
     * @param {number} id ID da categoria
     * @returns {Promise<Object|null>} Categoria encontrada ou null
     */
    async buscarPorId(id) {
        try {
            const query = `
                SELECT c.*, 
                       COUNT(t.id) as total_tarefas,
                       SUM(CASE WHEN t.concluida = 1 THEN 1 ELSE 0 END) as tarefas_concluidas
                FROM categorias c
                LEFT JOIN tarefas t ON c.id = t.categoria_id
                WHERE c.id = ?
                GROUP BY c.id
            `;

            return await dbGet(query, [id]);
        } catch (error) {
            console.error(`Erro ao buscar categoria ID ${id}:`, error);
            throw new Error(`Erro ao buscar categoria: ${error.message}`);
        }
    },

    /**
     * Cria uma nova categoria
     * @param {Object} categoria Dados da categoria
     * @returns {Promise<Object>} Categoria criada
     */
    async criar(categoria) {
        try {
            // Monta a query para inserir a categoria
            const colunas = Object.keys(categoria).join(', ');
            const placeholders = Object.keys(categoria).map(() => '?').join(', ');
            const valores = Object.values(categoria);

            const query = `INSERT INTO categorias (${colunas}) VALUES (${placeholders})`;

            // Insere a categoria
            const result = await dbRun(query, valores);
            const categoriaId = result.lastID;

            // Retorna a categoria completa
            return await this.buscarPorId(categoriaId);
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            throw new Error('Erro ao criar categoria: ' + error.message);
        }
    },

    /**
     * Atualiza uma categoria existente
     * @param {number} id ID da categoria
     * @param {Object} dadosCategoria Novos dados da categoria
     * @returns {Promise<Object>} Categoria atualizada
     */
    async atualizar(id, dadosCategoria) {
        try {
            // Verifica se a categoria existe
            const categoriaExistente = await this.buscarPorId(id);
            if (!categoriaExistente) {
                throw new Error('Categoria não encontrada');
            }

            // Adiciona a data de atualização
            dadosCategoria.updated_at = new Date().toISOString();

            // Monta a query para atualizar a categoria
            const setClause = Object.keys(dadosCategoria).map(key => `${key} = ?`).join(', ');
            const valores = [...Object.values(dadosCategoria), id];

            const query = `UPDATE categorias SET ${setClause} WHERE id = ?`;

            // Atualiza a categoria
            await dbRun(query, valores);

            // Retorna a categoria atualizada
            return await this.buscarPorId(id);
        } catch (error) {
            console.error(`Erro ao atualizar categoria ID ${id}:`, error);
            throw new Error('Erro ao atualizar categoria: ' + error.message);
        }
    },

    /**
     * Remove uma categoria
     * @param {number} id ID da categoria
     * @returns {Promise<boolean>} true se removida, false se não encontrada
     */
    async remover(id) {
        try {
            // Verifica se a categoria existe
            const categoria = await this.buscarPorId(id);
            if (!categoria) {
                return false;
            }

            // Remove a categoria (as tarefas associadas terão categoria_id definido como NULL devido à restrição ON DELETE SET NULL)
            await dbRun('DELETE FROM categorias WHERE id = ?', [id]);

            return true;
        } catch (error) {
            console.error(`Erro ao remover categoria ID ${id}:`, error);
            throw new Error('Erro ao remover categoria: ' + error.message);
        }
    },

    /**
     * Busca categorias por nome
     * @param {string} termo Termo para busca
     * @returns {Promise<Array>} Categorias encontradas
     */
    async buscarPorNome(termo) {
        try {
            const query = `
                SELECT c.*, 
                       COUNT(t.id) as total_tarefas,
                       SUM(CASE WHEN t.concluida = 1 THEN 1 ELSE 0 END) as tarefas_concluidas
                FROM categorias c
                LEFT JOIN tarefas t ON c.id = t.categoria_id
                WHERE c.nome LIKE ?
                GROUP BY c.id
                ORDER BY c.nome
            `;

            const params = [`%${termo}%`];
            return await dbAll(query, params);
        } catch (error) {
            console.error(`Erro ao buscar categorias com termo "${termo}":`, error);
            throw new Error('Erro ao buscar categorias: ' + error.message);
        }
    }
};

module.exports = categoriaModel; 