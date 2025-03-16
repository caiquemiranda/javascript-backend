const db = require('../database/connection');
const { validateTask } = require('../utils/validation');

/**
 * Obter todas as tarefas
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const getAllTasks = async (req, res, next) => {
    try {
        const { priority, status, search } = req.query;

        let query = `
      SELECT t.*, c.name as category_name 
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;

        const params = [];

        if (priority) {
            query += ` AND t.priority = ?`;
            params.push(priority);
        }

        if (status) {
            query += ` AND t.status = ?`;
            params.push(status);
        }

        if (search) {
            query += ` AND (t.title LIKE ? OR t.description LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ` ORDER BY t.created_at DESC`;

        const tasks = await db.all(query, params);

        // Para cada tarefa, buscar suas etiquetas
        for (const task of tasks) {
            const labels = await db.all(`
        SELECT l.* FROM labels l
        JOIN task_labels tl ON l.id = tl.label_id
        WHERE tl.task_id = ?
      `, [task.id]);

            task.labels = labels;
        }

        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obter uma tarefa pelo ID
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const getTaskById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await db.get(`
      SELECT t.*, c.name as category_name 
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `, [id]);

        if (!task) {
            const error = new Error('Tarefa não encontrada');
            error.statusCode = 404;
            throw error;
        }

        // Buscar etiquetas da tarefa
        const labels = await db.all(`
      SELECT l.* FROM labels l
      JOIN task_labels tl ON l.id = tl.label_id
      WHERE tl.task_id = ?
    `, [id]);

        task.labels = labels;

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Criar uma nova tarefa
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const createTask = async (req, res, next) => {
    try {
        const { title, description, due_date, priority, status, category_id, labels } = req.body;

        // Validar dados da tarefa
        const { isValid, errors } = validateTask(req.body);

        if (!isValid) {
            const error = new Error('Dados de tarefa inválidos');
            error.statusCode = 400;
            error.errors = errors;
            throw error;
        }

        // Verificar se a categoria existe, se fornecida
        if (category_id) {
            const categoryExists = await db.get('SELECT id FROM categories WHERE id = ?', [category_id]);
            if (!categoryExists) {
                const error = new Error('Categoria não encontrada');
                error.statusCode = 404;
                throw error;
            }
        }

        // Inserir a tarefa
        const result = await db.run(`
      INSERT INTO tasks (title, description, due_date, priority, status, category_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `, [title, description, due_date, priority, status, category_id]);

        const taskId = result.lastID;

        // Adicionar etiquetas, se fornecidas
        if (labels && Array.isArray(labels) && labels.length > 0) {
            for (const labelId of labels) {
                // Verificar se a etiqueta existe
                const labelExists = await db.get('SELECT id FROM labels WHERE id = ?', [labelId]);
                if (labelExists) {
                    await db.run(`
            INSERT INTO task_labels (task_id, label_id)
            VALUES (?, ?)
          `, [taskId, labelId]);
                }
            }
        }

        // Buscar a tarefa criada com suas etiquetas
        const task = await db.get(`
      SELECT t.*, c.name as category_name 
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `, [taskId]);

        const taskLabels = await db.all(`
      SELECT l.* FROM labels l
      JOIN task_labels tl ON l.id = tl.label_id
      WHERE tl.task_id = ?
    `, [taskId]);

        task.labels = taskLabels;

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Atualizar uma tarefa existente
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, due_date, priority, status, category_id } = req.body;

        // Verificar se a tarefa existe
        const taskExists = await db.get('SELECT id FROM tasks WHERE id = ?', [id]);
        if (!taskExists) {
            const error = new Error('Tarefa não encontrada');
            error.statusCode = 404;
            throw error;
        }

        // Validar dados da tarefa
        const { isValid, errors } = validateTask(req.body, true);

        if (!isValid) {
            const error = new Error('Dados de tarefa inválidos');
            error.statusCode = 400;
            error.errors = errors;
            throw error;
        }

        // Verificar se a categoria existe, se fornecida
        if (category_id) {
            const categoryExists = await db.get('SELECT id FROM categories WHERE id = ?', [category_id]);
            if (!categoryExists) {
                const error = new Error('Categoria não encontrada');
                error.statusCode = 404;
                throw error;
            }
        }

        // Construir a query de atualização dinamicamente
        let updateFields = [];
        let updateParams = [];

        if (title !== undefined) {
            updateFields.push('title = ?');
            updateParams.push(title);
        }

        if (description !== undefined) {
            updateFields.push('description = ?');
            updateParams.push(description);
        }

        if (due_date !== undefined) {
            updateFields.push('due_date = ?');
            updateParams.push(due_date);
        }

        if (priority !== undefined) {
            updateFields.push('priority = ?');
            updateParams.push(priority);
        }

        if (status !== undefined) {
            updateFields.push('status = ?');
            updateParams.push(status);
        }

        if (category_id !== undefined) {
            updateFields.push('category_id = ?');
            updateParams.push(category_id);
        }

        updateFields.push('updated_at = datetime("now")');

        // Adicionar o ID da tarefa aos parâmetros
        updateParams.push(id);

        // Atualizar a tarefa
        await db.run(`
      UPDATE tasks
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateParams);

        // Buscar a tarefa atualizada com suas etiquetas
        const task = await db.get(`
      SELECT t.*, c.name as category_name 
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `, [id]);

        const labels = await db.all(`
      SELECT l.* FROM labels l
      JOIN task_labels tl ON l.id = tl.label_id
      WHERE tl.task_id = ?
    `, [id]);

        task.labels = labels;

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Excluir uma tarefa
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Verificar se a tarefa existe
        const taskExists = await db.get('SELECT id FROM tasks WHERE id = ?', [id]);
        if (!taskExists) {
            const error = new Error('Tarefa não encontrada');
            error.statusCode = 404;
            throw error;
        }

        // Excluir as relações com etiquetas
        await db.run('DELETE FROM task_labels WHERE task_id = ?', [id]);

        // Excluir a tarefa
        await db.run('DELETE FROM tasks WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Tarefa excluída com sucesso'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obter tarefas por categoria
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const getTasksByCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;

        // Verificar se a categoria existe
        const categoryExists = await db.get('SELECT id FROM categories WHERE id = ?', [categoryId]);
        if (!categoryExists) {
            const error = new Error('Categoria não encontrada');
            error.statusCode = 404;
            throw error;
        }

        const tasks = await db.all(`
      SELECT t.*, c.name as category_name 
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.category_id = ?
      ORDER BY t.created_at DESC
    `, [categoryId]);

        // Para cada tarefa, buscar suas etiquetas
        for (const task of tasks) {
            const labels = await db.all(`
        SELECT l.* FROM labels l
        JOIN task_labels tl ON l.id = tl.label_id
        WHERE tl.task_id = ?
      `, [task.id]);

            task.labels = labels;
        }

        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obter tarefas por etiqueta
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const getTasksByLabel = async (req, res, next) => {
    try {
        const { labelId } = req.params;

        // Verificar se a etiqueta existe
        const labelExists = await db.get('SELECT id FROM labels WHERE id = ?', [labelId]);
        if (!labelExists) {
            const error = new Error('Etiqueta não encontrada');
            error.statusCode = 404;
            throw error;
        }

        const tasks = await db.all(`
      SELECT t.*, c.name as category_name 
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      JOIN task_labels tl ON t.id = tl.task_id
      WHERE tl.label_id = ?
      ORDER BY t.created_at DESC
    `, [labelId]);

        // Para cada tarefa, buscar suas etiquetas
        for (const task of tasks) {
            const labels = await db.all(`
        SELECT l.* FROM labels l
        JOIN task_labels tl ON l.id = tl.label_id
        WHERE tl.task_id = ?
      `, [task.id]);

            task.labels = labels;
        }

        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Adicionar uma etiqueta a uma tarefa
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const addLabelToTask = async (req, res, next) => {
    try {
        const { taskId, labelId } = req.params;

        // Verificar se a tarefa existe
        const taskExists = await db.get('SELECT id FROM tasks WHERE id = ?', [taskId]);
        if (!taskExists) {
            const error = new Error('Tarefa não encontrada');
            error.statusCode = 404;
            throw error;
        }

        // Verificar se a etiqueta existe
        const labelExists = await db.get('SELECT id FROM labels WHERE id = ?', [labelId]);
        if (!labelExists) {
            const error = new Error('Etiqueta não encontrada');
            error.statusCode = 404;
            throw error;
        }

        // Verificar se a relação já existe
        const relationExists = await db.get(`
      SELECT * FROM task_labels 
      WHERE task_id = ? AND label_id = ?
    `, [taskId, labelId]);

        if (relationExists) {
            return res.json({
                success: true,
                message: 'Etiqueta já associada a esta tarefa'
            });
        }

        // Adicionar a etiqueta à tarefa
        await db.run(`
      INSERT INTO task_labels (task_id, label_id)
      VALUES (?, ?)
    `, [taskId, labelId]);

        // Atualizar o timestamp da tarefa
        await db.run(`
      UPDATE tasks
      SET updated_at = datetime('now')
      WHERE id = ?
    `, [taskId]);

        // Buscar a tarefa atualizada com suas etiquetas
        const task = await db.get(`
      SELECT t.*, c.name as category_name 
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `, [taskId]);

        const labels = await db.all(`
      SELECT l.* FROM labels l
      JOIN task_labels tl ON l.id = tl.label_id
      WHERE tl.task_id = ?
    `, [taskId]);

        task.labels = labels;

        res.json({
            success: true,
            message: 'Etiqueta adicionada com sucesso',
            data: task
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Remover uma etiqueta de uma tarefa
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const removeLabelFromTask = async (req, res, next) => {
    try {
        const { taskId, labelId } = req.params;

        // Verificar se a tarefa existe
        const taskExists = await db.get('SELECT id FROM tasks WHERE id = ?', [taskId]);
        if (!taskExists) {
            const error = new Error('Tarefa não encontrada');
            error.statusCode = 404;
            throw error;
        }

        // Verificar se a etiqueta existe
        const labelExists = await db.get('SELECT id FROM labels WHERE id = ?', [labelId]);
        if (!labelExists) {
            const error = new Error('Etiqueta não encontrada');
            error.statusCode = 404;
            throw error;
        }

        // Verificar se a relação existe
        const relationExists = await db.get(`
      SELECT * FROM task_labels 
      WHERE task_id = ? AND label_id = ?
    `, [taskId, labelId]);

        if (!relationExists) {
            const error = new Error('Etiqueta não está associada a esta tarefa');
            error.statusCode = 404;
            throw error;
        }

        // Remover a etiqueta da tarefa
        await db.run(`
      DELETE FROM task_labels 
      WHERE task_id = ? AND label_id = ?
    `, [taskId, labelId]);

        // Atualizar o timestamp da tarefa
        await db.run(`
      UPDATE tasks
      SET updated_at = datetime('now')
      WHERE id = ?
    `, [taskId]);

        // Buscar a tarefa atualizada com suas etiquetas
        const task = await db.get(`
      SELECT t.*, c.name as category_name 
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?
    `, [taskId]);

        const labels = await db.all(`
      SELECT l.* FROM labels l
      JOIN task_labels tl ON l.id = tl.label_id
      WHERE tl.task_id = ?
    `, [taskId]);

        task.labels = labels;

        res.json({
            success: true,
            message: 'Etiqueta removida com sucesso',
            data: task
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByCategory,
    getTasksByLabel,
    addLabelToTask,
    removeLabelFromTask
}; 