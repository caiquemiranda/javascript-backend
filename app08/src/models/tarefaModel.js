/**
 * Modelo para operações relacionadas a tarefas
 */
const db = require('../config/database');
const { promisify } = require('util');

// Transforma funções de callback em promises
const dbAll = promisify(db.all.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbRun = promisify(db.run.bind(db));

// Modelo de tarefas
const tarefaModel = {
    /**
     * Lista todas as tarefas, opcionalmente filtradas por estado de conclusão
     * @param {Object} filtros Objeto com filtros para a consulta
     * @returns {Promise<Array>} Array de tarefas
     */
    async listarTodas(filtros = {}) {
        try {
            let query = `
                SELECT t.*, c.nome as categoria_nome
                FROM tarefas t
                LEFT JOIN categorias c ON t.categoria_id = c.id
            `;

            const whereConditions = [];
            const params = [];

            // Adiciona filtro de conclusão, se especificado
            if (filtros.concluida !== undefined) {
                whereConditions.push('t.concluida = ?');
                params.push(filtros.concluida ? 1 : 0);
            }

            // Adiciona filtro de categoria, se especificado
            if (filtros.categoria_id) {
                whereConditions.push('t.categoria_id = ?');
                params.push(filtros.categoria_id);
            }

            // Adiciona filtro de prioridade, se especificado
            if (filtros.prioridade) {
                whereConditions.push('t.prioridade = ?');
                params.push(filtros.prioridade);
            }

            // Adiciona condições WHERE, se houver
            if (whereConditions.length > 0) {
                query += ' WHERE ' + whereConditions.join(' AND ');
            }

            // Adiciona ordenação
            query += ' ORDER BY ' + (filtros.ordenar_por || 't.prioridade DESC, t.data_vencimento ASC');

            // Executa a consulta
            const tarefas = await dbAll(query, params);

            // Para cada tarefa, busca suas etiquetas
            for (const tarefa of tarefas) {
                tarefa.etiquetas = await this.buscarEtiquetasDaTarefa(tarefa.id);
            }

            return tarefas;
        } catch (error) {
            console.error('Erro ao listar tarefas:', error);
            throw new Error('Erro ao listar tarefas: ' + error.message);
        }
    },

    /**
     * Busca uma tarefa pelo ID
     * @param {number} id ID da tarefa
     * @returns {Promise<Object|null>} Tarefa encontrada ou null
     */
    async buscarPorId(id) {
        try {
            const query = `
                SELECT t.*, c.nome as categoria_nome
                FROM tarefas t
                LEFT JOIN categorias c ON t.categoria_id = c.id
                WHERE t.id = ?
            `;

            const tarefa = await dbGet(query, [id]);

            if (!tarefa) {
                return null;
            }

            // Busca as etiquetas da tarefa
            tarefa.etiquetas = await this.buscarEtiquetasDaTarefa(id);

            return tarefa;
        } catch (error) {
            console.error(`Erro ao buscar tarefa ID ${id}:`, error);
            throw new Error(`Erro ao buscar tarefa: ${error.message}`);
        }
    },

    /**
     * Busca as etiquetas de uma tarefa
     * @param {number} tarefaId ID da tarefa
     * @returns {Promise<Array>} Array de etiquetas
     */
    async buscarEtiquetasDaTarefa(tarefaId) {
        try {
            const query = `
                SELECT e.*
                FROM etiquetas e
                JOIN tarefa_etiquetas te ON e.id = te.etiqueta_id
                WHERE te.tarefa_id = ?
            `;

            return await dbAll(query, [tarefaId]);
        } catch (error) {
            console.error(`Erro ao buscar etiquetas da tarefa ID ${tarefaId}:`, error);
            return []; // Em caso de erro, retorna array vazio
        }
    },

    /**
     * Cria uma nova tarefa
     * @param {Object} tarefa Dados da tarefa a criar
     * @returns {Promise<Object>} Tarefa criada
     */
    async criar(tarefa) {
        // Extrai as etiquetas para manipulação separada
        const etiquetas = tarefa.etiquetas || [];

        // Remove as etiquetas do objeto de tarefa para não salvar no banco
        delete tarefa.etiquetas;

        // Inicia uma transação para garantir integridade
        await dbRun('BEGIN TRANSACTION');

        try {
            // Monta a query para inserir a tarefa
            const colunas = Object.keys(tarefa).join(', ');
            const placeholders = Object.keys(tarefa).map(() => '?').join(', ');
            const valores = Object.values(tarefa);

            const query = `INSERT INTO tarefas (${colunas}) VALUES (${placeholders})`;

            // Insere a tarefa
            const result = await dbRun(query, valores);
            const tarefaId = result.lastID;

            // Adiciona as etiquetas à tarefa, se houver
            if (etiquetas.length > 0) {
                await this.atualizarEtiquetas(tarefaId, etiquetas);
            }

            // Confirma a transação
            await dbRun('COMMIT');

            // Retorna a tarefa completa
            return await this.buscarPorId(tarefaId);
        } catch (error) {
            // Em caso de erro, reverte a transação
            await dbRun('ROLLBACK');
            console.error('Erro ao criar tarefa:', error);
            throw new Error('Erro ao criar tarefa: ' + error.message);
        }
    },

    /**
     * Atualiza uma tarefa existente
     * @param {number} id ID da tarefa
     * @param {Object} dadosTarefa Novos dados da tarefa
     * @returns {Promise<Object>} Tarefa atualizada
     */
    async atualizar(id, dadosTarefa) {
        // Verifica se a tarefa existe
        const tarefaExistente = await this.buscarPorId(id);
        if (!tarefaExistente) {
            throw new Error('Tarefa não encontrada');
        }

        // Extrai as etiquetas para manipulação separada
        const etiquetas = dadosTarefa.etiquetas;

        // Remove as etiquetas do objeto de dados para não salvar no banco
        delete dadosTarefa.etiquetas;

        // Adiciona a data de atualização
        dadosTarefa.updated_at = new Date().toISOString();

        // Inicia uma transação para garantir integridade
        await dbRun('BEGIN TRANSACTION');

        try {
            // Se não há campos para atualizar, pula essa etapa
            if (Object.keys(dadosTarefa).length > 0) {
                // Monta a query para atualizar a tarefa
                const setClause = Object.keys(dadosTarefa).map(key => `${key} = ?`).join(', ');
                const valores = [...Object.values(dadosTarefa), id];

                const query = `UPDATE tarefas SET ${setClause} WHERE id = ?`;

                // Atualiza a tarefa
                await dbRun(query, valores);
            }

            // Atualiza as etiquetas, se fornecidas
            if (etiquetas !== undefined) {
                await this.atualizarEtiquetas(id, etiquetas || []);
            }

            // Confirma a transação
            await dbRun('COMMIT');

            // Retorna a tarefa atualizada
            return await this.buscarPorId(id);
        } catch (error) {
            // Em caso de erro, reverte a transação
            await dbRun('ROLLBACK');
            console.error(`Erro ao atualizar tarefa ID ${id}:`, error);
            throw new Error('Erro ao atualizar tarefa: ' + error.message);
        }
    },

    /**
     * Atualiza as etiquetas de uma tarefa
     * @param {number} tarefaId ID da tarefa
     * @param {Array} etiquetas Array de IDs de etiquetas
     * @returns {Promise<void>}
     */
    async atualizarEtiquetas(tarefaId, etiquetas) {
        try {
            // Remove todas as etiquetas atuais da tarefa
            await dbRun('DELETE FROM tarefa_etiquetas WHERE tarefa_id = ?', [tarefaId]);

            // Se não há novas etiquetas, termina aqui
            if (!etiquetas || etiquetas.length === 0) {
                return;
            }

            // Insere as novas relações
            for (const etiquetaId of etiquetas) {
                await dbRun(
                    'INSERT INTO tarefa_etiquetas (tarefa_id, etiqueta_id) VALUES (?, ?)',
                    [tarefaId, etiquetaId]
                );
            }
        } catch (error) {
            console.error(`Erro ao atualizar etiquetas da tarefa ID ${tarefaId}:`, error);
            throw new Error('Erro ao atualizar etiquetas: ' + error.message);
        }
    },

    /**
     * Remove uma tarefa
     * @param {number} id ID da tarefa
     * @returns {Promise<boolean>} true se removida, false se não encontrada
     */
    async remover(id) {
        try {
            // Verifica se a tarefa existe
            const tarefa = await this.buscarPorId(id);
            if (!tarefa) {
                return false;
            }

            // Remove a tarefa (as etiquetas associadas serão removidas automaticamente devido à restrição ON DELETE CASCADE)
            await dbRun('DELETE FROM tarefas WHERE id = ?', [id]);

            return true;
        } catch (error) {
            console.error(`Erro ao remover tarefa ID ${id}:`, error);
            throw new Error('Erro ao remover tarefa: ' + error.message);
        }
    },

    /**
     * Marca uma tarefa como concluída ou não concluída
     * @param {number} id ID da tarefa
     * @param {boolean} concluida Status de conclusão
     * @returns {Promise<Object>} Tarefa atualizada
     */
    async marcarConclusao(id, concluida) {
        try {
            const status = concluida ? 1 : 0;
            await dbRun(
                'UPDATE tarefas SET concluida = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [status, id]
            );

            return await this.buscarPorId(id);
        } catch (error) {
            console.error(`Erro ao marcar conclusão da tarefa ID ${id}:`, error);
            throw new Error('Erro ao marcar conclusão da tarefa: ' + error.message);
        }
    },

    /**
     * Busca tarefas por termo em título ou descrição
     * @param {string} termo Termo para busca
     * @returns {Promise<Array>} Tarefas encontradas
     */
    async buscarPorTermo(termo) {
        try {
            const query = `
                SELECT t.*, c.nome as categoria_nome
                FROM tarefas t
                LEFT JOIN categorias c ON t.categoria_id = c.id
                WHERE t.titulo LIKE ? OR t.descricao LIKE ?
                ORDER BY t.prioridade DESC, t.data_vencimento ASC
            `;

            const params = [`%${termo}%`, `%${termo}%`];
            const tarefas = await dbAll(query, params);

            // Para cada tarefa, busca suas etiquetas
            for (const tarefa of tarefas) {
                tarefa.etiquetas = await this.buscarEtiquetasDaTarefa(tarefa.id);
            }

            return tarefas;
        } catch (error) {
            console.error(`Erro ao buscar tarefas com termo "${termo}":`, error);
            throw new Error('Erro ao buscar tarefas: ' + error.message);
        }
    }
};

module.exports = tarefaModel; 