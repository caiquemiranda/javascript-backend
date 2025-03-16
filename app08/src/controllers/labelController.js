const db = require('../database/connection');
const { validateLabel } = require('../utils/validation');

/**
 * Obter todas as etiquetas
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const getAllLabels = async (req, res, next) => {
    try {
        const labels = await db.all(`
      SELECT l.*, COUNT(tl.task_id) as task_count
      FROM labels l
      LEFT JOIN task_labels tl ON l.id = tl.label_id
      GROUP BY l.id
      ORDER BY l.name ASC
    `);

        res.json({
            success: true,
            count: labels.length,
            data: labels
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obter uma etiqueta pelo ID
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const getLabelById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const label = await db.get(`
      SELECT l.*, COUNT(tl.task_id) as task_count
      FROM labels l
      LEFT JOIN task_labels tl ON l.id = tl.label_id
      WHERE l.id = ?
      GROUP BY l.id
    `, [id]);

        if (!label) {
            const error = new Error('Etiqueta não encontrada');
            error.statusCode = 404;
            throw error;
        }

        res.json({
            success: true,
            data: label
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Criar uma nova etiqueta
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const createLabel = async (req, res, next) => {
    try {
        const { name, color } = req.body;

        // Validar dados da etiqueta
        const { isValid, errors } = validateLabel(req.body);

        if (!isValid) {
            const error = new Error('Dados de etiqueta inválidos');
            error.statusCode = 400;
            error.errors = errors;
            throw error;
        }

        // Verificar se já existe uma etiqueta com o mesmo nome
        const existingLabel = await db.get('SELECT id FROM labels WHERE name = ?', [name]);
        if (existingLabel) {
            const error = new Error('Já existe uma etiqueta com este nome');
            error.statusCode = 400;
            throw error;
        }

        // Inserir a etiqueta
        const result = await db.run(`
      INSERT INTO labels (name, color, created_at, updated_at)
      VALUES (?, ?, datetime('now'), datetime('now'))
    `, [name, color]);

        const labelId = result.lastID;

        // Buscar a etiqueta criada
        const label = await db.get('SELECT * FROM labels WHERE id = ?', [labelId]);

        res.status(201).json({
            success: true,
            data: label
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Atualizar uma etiqueta existente
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const updateLabel = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body;

        // Verificar se a etiqueta existe
        const labelExists = await db.get('SELECT id FROM labels WHERE id = ?', [id]);
        if (!labelExists) {
            const error = new Error('Etiqueta não encontrada');
            error.statusCode = 404;
            throw error;
        }

        // Validar dados da etiqueta
        const { isValid, errors } = validateLabel(req.body, true);

        if (!isValid) {
            const error = new Error('Dados de etiqueta inválidos');
            error.statusCode = 400;
            error.errors = errors;
            throw error;
        }

        // Verificar se já existe outra etiqueta com o mesmo nome
        if (name) {
            const existingLabel = await db.get('SELECT id FROM labels WHERE name = ? AND id != ?', [name, id]);
            if (existingLabel) {
                const error = new Error('Já existe outra etiqueta com este nome');
                error.statusCode = 400;
                throw error;
            }
        }

        // Construir a query de atualização dinamicamente
        let updateFields = [];
        let updateParams = [];

        if (name !== undefined) {
            updateFields.push('name = ?');
            updateParams.push(name);
        }

        if (color !== undefined) {
            updateFields.push('color = ?');
            updateParams.push(color);
        }

        updateFields.push('updated_at = datetime("now")');

        // Adicionar o ID da etiqueta aos parâmetros
        updateParams.push(id);

        // Atualizar a etiqueta
        await db.run(`
      UPDATE labels
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateParams);

        // Buscar a etiqueta atualizada
        const label = await db.get(`
      SELECT l.*, COUNT(tl.task_id) as task_count
      FROM labels l
      LEFT JOIN task_labels tl ON l.id = tl.label_id
      WHERE l.id = ?
      GROUP BY l.id
    `, [id]);

        res.json({
            success: true,
            data: label
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Excluir uma etiqueta
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const deleteLabel = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Verificar se a etiqueta existe
        const labelExists = await db.get('SELECT id FROM labels WHERE id = ?', [id]);
        if (!labelExists) {
            const error = new Error('Etiqueta não encontrada');
            error.statusCode = 404;
            throw error;
        }

        // Remover todas as associações com tarefas
        await db.run('DELETE FROM task_labels WHERE label_id = ?', [id]);

        // Excluir a etiqueta
        await db.run('DELETE FROM labels WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Etiqueta excluída com sucesso'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obter etiquetas de uma tarefa
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const getLabelsByTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;

        // Verificar se a tarefa existe
        const taskExists = await db.get('SELECT id FROM tasks WHERE id = ?', [taskId]);
        if (!taskExists) {
            const error = new Error('Tarefa não encontrada');
            error.statusCode = 404;
            throw error;
        }

        const labels = await db.all(`
      SELECT l.*
      FROM labels l
      JOIN task_labels tl ON l.id = tl.label_id
      WHERE tl.task_id = ?
      ORDER BY l.name ASC
    `, [taskId]);

        res.json({
            success: true,
            count: labels.length,
            data: labels
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllLabels,
    getLabelById,
    createLabel,
    updateLabel,
    deleteLabel,
    getLabelsByTask
}; 