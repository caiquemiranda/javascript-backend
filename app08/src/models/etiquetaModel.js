/**
 * Modelo para operações relacionadas a etiquetas
 */
const db = require('../config/database');
const { promisify } = require('util');

// Transforma funções de callback em promises
const dbAll = promisify(db.all.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbRun = promisify(db.run.bind(db));

// Modelo de etiquetas
const etiquetaModel = {
    /**
     * Lista todas as etiquetas
     * @returns {Promise<Array>} Array de etiquetas
     */
    async listarTodas() {
        try {
            const query = `
                SELECT e.*, COUNT(te.tarefa_id) as total_tarefas
                FROM etiquetas e
                LEFT JOIN tarefa_etiquetas te ON e.id = te.etiqueta_id
                GROUP BY e.id
                ORDER BY e.nome
            `;

            return await dbAll(query);
        } catch (error) {
            console.error('Erro ao listar etiquetas:', error);
            throw new Error('Erro ao listar etiquetas: ' + error.message);
        }
    },

    /**
     * Busca uma etiqueta pelo ID
     * @param {number} id ID da etiqueta
     * @returns {Promise<Object|null>} Etiqueta encontrada ou null
     */
    async buscarPorId(id) {
        try {
            const query = `
                SELECT e.*, COUNT(te.tarefa_id) as total_tarefas
                FROM etiquetas e
                LEFT JOIN tarefa_etiquetas te ON e.id = te.etiqueta_id
                WHERE e.id = ?
                GROUP BY e.id
            `;

            return await dbGet(query, [id]);
        } catch (error) {
            console.error(`Erro ao buscar etiqueta ID ${id}:`, error);
            throw new Error(`Erro ao buscar etiqueta: ${error.message}`);
        }
    },

    /**
     * Cria uma nova etiqueta
     * @param {Object} etiqueta Dados da etiqueta
     * @returns {Promise<Object>} Etiqueta criada
     */
    async criar(etiqueta) {
        try {
            // Define a cor padrão se não for fornecida
            if (!etiqueta.cor) {
                etiqueta.cor = '#3498db';
            }

            // Monta a query para inserir a etiqueta
            const colunas = Object.keys(etiqueta).join(', ');
            const placeholders = Object.keys(etiqueta).map(() => '?').join(', ');
            const valores = Object.values(etiqueta);

            const query = `INSERT INTO etiquetas (${colunas}) VALUES (${placeholders})`;

            // Insere a etiqueta
            const result = await dbRun(query, valores);
            const etiquetaId = result.lastID;

            // Retorna a etiqueta completa
            return await this.buscarPorId(etiquetaId);
        } catch (error) {
            console.error('Erro ao criar etiqueta:', error);
            throw new Error('Erro ao criar etiqueta: ' + error.message);
        }
    },

    /**
     * Atualiza uma etiqueta existente
     * @param {number} id ID da etiqueta
     * @param {Object} dadosEtiqueta Novos dados da etiqueta
     * @returns {Promise<Object>} Etiqueta atualizada
     */
    async atualizar(id, dadosEtiqueta) {
        try {
            // Verifica se a etiqueta existe
            const etiquetaExistente = await this.buscarPorId(id);
            if (!etiquetaExistente) {
                throw new Error('Etiqueta não encontrada');
            }

            // Monta a query para atualizar a etiqueta
            const setClause = Object.keys(dadosEtiqueta).map(key => `${key} = ?`).join(', ');
            const valores = [...Object.values(dadosEtiqueta), id];

            const query = `UPDATE etiquetas SET ${setClause} WHERE id = ?`;

            // Atualiza a etiqueta
            await dbRun(query, valores);

            // Retorna a etiqueta atualizada
            return await this.buscarPorId(id);
        } catch (error) {
            console.error(`Erro ao atualizar etiqueta ID ${id}:`, error);
            throw new Error('Erro ao atualizar etiqueta: ' + error.message);
        }
    },

    /**
     * Remove uma etiqueta
     * @param {number} id ID da etiqueta
     * @returns {Promise<boolean>} true se removida, false se não encontrada
     */
    async remover(id) {
        try {
            // Verifica se a etiqueta existe
            const etiqueta = await this.buscarPorId(id);
            if (!etiqueta) {
                return false;
            }

            // Remove a etiqueta (as relações na tabela tarefa_etiquetas serão removidas devido à restrição ON DELETE CASCADE)
            await dbRun('DELETE FROM etiquetas WHERE id = ?', [id]);

            return true;
        } catch (error) {
            console.error(`Erro ao remover etiqueta ID ${id}:`, error);
            throw new Error('Erro ao remover etiqueta: ' + error.message);
        }
    },

    /**
     * Busca etiquetas por nome
     * @param {string} termo Termo para busca
     * @returns {Promise<Array>} Etiquetas encontradas
     */
    async buscarPorNome(termo) {
        try {
            const query = `
                SELECT e.*, COUNT(te.tarefa_id) as total_tarefas
                FROM etiquetas e
                LEFT JOIN tarefa_etiquetas te ON e.id = te.etiqueta_id
                WHERE e.nome LIKE ?
                GROUP BY e.id
                ORDER BY e.nome
            `;

            const params = [`%${termo}%`];
            return await dbAll(query, params);
        } catch (error) {
            console.error(`Erro ao buscar etiquetas com termo "${termo}":`, error);
            throw new Error('Erro ao buscar etiquetas: ' + error.message);
        }
    },

    /**
     * Busca tarefas associadas a uma etiqueta
     * @param {number} etiquetaId ID da etiqueta
     * @returns {Promise<Array>} Tarefas associadas à etiqueta
     */
    async buscarTarefasPorEtiqueta(etiquetaId) {
        try {
            const query = `
                SELECT t.*, c.nome as categoria_nome
                FROM tarefas t
                JOIN tarefa_etiquetas te ON t.id = te.tarefa_id
                LEFT JOIN categorias c ON t.categoria_id = c.id
                WHERE te.etiqueta_id = ?
                ORDER BY t.prioridade DESC, t.data_vencimento ASC
            `;

            return await dbAll(query, [etiquetaId]);
        } catch (error) {
            console.error(`Erro ao buscar tarefas da etiqueta ID ${etiquetaId}:`, error);
            throw new Error('Erro ao buscar tarefas da etiqueta: ' + error.message);
        }
    }
};

module.exports = etiquetaModel; 