const db = require('../database/connection');
const { validateCategory } = require('../utils/validation');

/**
 * Obter todas as categorias
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await db.all(`
      SELECT c.*, COUNT(t.id) as task_count
      FROM categories c
      LEFT JOIN tasks t ON c.id = t.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

        res.json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obter uma categoria pelo ID
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await db.get(`
      SELECT c.*, COUNT(t.id) as task_count
      FROM categories c
      LEFT JOIN tasks t ON c.id = t.category_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [id]);

        if (!category) {
            const error = new Error('Categoria não encontrada');
            error.statusCode = 404;
            throw error;
        }

        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Criar uma nova categoria
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        // Validar dados da categoria
        const { isValid, errors } = validateCategory(req.body);

        if (!isValid) {
            const error = new Error('Dados de categoria inválidos');
            error.statusCode = 400;
            error.errors = errors;
            throw error;
        }

        // Verificar se já existe uma categoria com o mesmo nome
        const existingCategory = await db.get('SELECT id FROM categories WHERE name = ?', [name]);
        if (existingCategory) {
            const error = new Error('Já existe uma categoria com este nome');
            error.statusCode = 400;
            throw error;
        }

        // Inserir a categoria
        const result = await db.run(`
      INSERT INTO categories (name, description, created_at, updated_at)
      VALUES (?, ?, datetime('now'), datetime('now'))
    `, [name, description]);

        const categoryId = result.lastID;

        // Buscar a categoria criada
        const category = await db.get('SELECT * FROM categories WHERE id = ?', [categoryId]);

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Atualizar uma categoria existente
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Verificar se a categoria existe
        const categoryExists = await db.get('SELECT id FROM categories WHERE id = ?', [id]);
        if (!categoryExists) {
            const error = new Error('Categoria não encontrada');
            error.statusCode = 404;
            throw error;
        }

        // Validar dados da categoria
        const { isValid, errors } = validateCategory(req.body, true);

        if (!isValid) {
            const error = new Error('Dados de categoria inválidos');
            error.statusCode = 400;
            error.errors = errors;
            throw error;
        }

        // Verificar se já existe outra categoria com o mesmo nome
        if (name) {
            const existingCategory = await db.get('SELECT id FROM categories WHERE name = ? AND id != ?', [name, id]);
            if (existingCategory) {
                const error = new Error('Já existe outra categoria com este nome');
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

        if (description !== undefined) {
            updateFields.push('description = ?');
            updateParams.push(description);
        }

        updateFields.push('updated_at = datetime("now")');

        // Adicionar o ID da categoria aos parâmetros
        updateParams.push(id);

        // Atualizar a categoria
        await db.run(`
      UPDATE categories
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateParams);

        // Buscar a categoria atualizada
        const category = await db.get(`
      SELECT c.*, COUNT(t.id) as task_count
      FROM categories c
      LEFT JOIN tasks t ON c.id = t.category_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [id]);

        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Excluir uma categoria
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 * @param {Function} next - Função next
 */
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Verificar se a categoria existe
        const categoryExists = await db.get('SELECT id FROM categories WHERE id = ?', [id]);
        if (!categoryExists) {
            const error = new Error('Categoria não encontrada');
            error.statusCode = 404;
            throw error;
        }

        // Verificar se existem tarefas associadas a esta categoria
        const tasksCount = await db.get('SELECT COUNT(*) as count FROM tasks WHERE category_id = ?', [id]);

        if (tasksCount.count > 0) {
            const error = new Error('Não é possível excluir uma categoria que possui tarefas associadas');
            error.statusCode = 400;
            throw error;
        }

        // Excluir a categoria
        await db.run('DELETE FROM categories WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Categoria excluída com sucesso'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}; 