/**
 * Validação de dados para tarefas
 * @param {Object} data - Dados da tarefa
 * @param {boolean} isUpdate - Indica se é uma atualização (campos opcionais)
 * @returns {Object} Objeto com resultado da validação
 */
const validateTask = (data, isUpdate = false) => {
    const errors = {};

    // Validar título
    if (!isUpdate || data.title !== undefined) {
        if (!data.title) {
            errors.title = 'O título é obrigatório';
        } else if (typeof data.title !== 'string') {
            errors.title = 'O título deve ser uma string';
        } else if (data.title.length < 3) {
            errors.title = 'O título deve ter pelo menos 3 caracteres';
        } else if (data.title.length > 100) {
            errors.title = 'O título deve ter no máximo 100 caracteres';
        }
    }

    // Validar descrição (opcional)
    if (data.description !== undefined) {
        if (typeof data.description !== 'string') {
            errors.description = 'A descrição deve ser uma string';
        } else if (data.description.length > 500) {
            errors.description = 'A descrição deve ter no máximo 500 caracteres';
        }
    }

    // Validar data de vencimento (opcional)
    if (data.due_date !== undefined && data.due_date !== null) {
        if (isNaN(Date.parse(data.due_date))) {
            errors.due_date = 'A data de vencimento deve ser uma data válida';
        }
    }

    // Validar prioridade
    if (!isUpdate || data.priority !== undefined) {
        const validPriorities = ['baixa', 'média', 'alta'];
        if (!data.priority) {
            errors.priority = 'A prioridade é obrigatória';
        } else if (!validPriorities.includes(data.priority.toLowerCase())) {
            errors.priority = 'A prioridade deve ser baixa, média ou alta';
        }
    }

    // Validar status
    if (!isUpdate || data.status !== undefined) {
        const validStatuses = ['pendente', 'em andamento', 'concluída'];
        if (!data.status) {
            errors.status = 'O status é obrigatório';
        } else if (!validStatuses.includes(data.status.toLowerCase())) {
            errors.status = 'O status deve ser pendente, em andamento ou concluída';
        }
    }

    // Validar categoria (opcional)
    if (data.category_id !== undefined && data.category_id !== null) {
        if (isNaN(Number(data.category_id))) {
            errors.category_id = 'O ID da categoria deve ser um número';
        }
    }

    // Validar etiquetas (opcional)
    if (data.labels !== undefined) {
        if (!Array.isArray(data.labels)) {
            errors.labels = 'As etiquetas devem ser um array';
        } else {
            for (let i = 0; i < data.labels.length; i++) {
                if (isNaN(Number(data.labels[i]))) {
                    errors.labels = 'Todos os IDs de etiquetas devem ser números';
                    break;
                }
            }
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validação de dados para categorias
 * @param {Object} data - Dados da categoria
 * @param {boolean} isUpdate - Indica se é uma atualização (campos opcionais)
 * @returns {Object} Objeto com resultado da validação
 */
const validateCategory = (data, isUpdate = false) => {
    const errors = {};

    // Validar nome
    if (!isUpdate || data.name !== undefined) {
        if (!data.name) {
            errors.name = 'O nome é obrigatório';
        } else if (typeof data.name !== 'string') {
            errors.name = 'O nome deve ser uma string';
        } else if (data.name.length < 3) {
            errors.name = 'O nome deve ter pelo menos 3 caracteres';
        } else if (data.name.length > 50) {
            errors.name = 'O nome deve ter no máximo 50 caracteres';
        }
    }

    // Validar descrição (opcional)
    if (data.description !== undefined) {
        if (typeof data.description !== 'string') {
            errors.description = 'A descrição deve ser uma string';
        } else if (data.description.length > 200) {
            errors.description = 'A descrição deve ter no máximo 200 caracteres';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validação de dados para etiquetas
 * @param {Object} data - Dados da etiqueta
 * @param {boolean} isUpdate - Indica se é uma atualização (campos opcionais)
 * @returns {Object} Objeto com resultado da validação
 */
const validateLabel = (data, isUpdate = false) => {
    const errors = {};

    // Validar nome
    if (!isUpdate || data.name !== undefined) {
        if (!data.name) {
            errors.name = 'O nome é obrigatório';
        } else if (typeof data.name !== 'string') {
            errors.name = 'O nome deve ser uma string';
        } else if (data.name.length < 2) {
            errors.name = 'O nome deve ter pelo menos 2 caracteres';
        } else if (data.name.length > 30) {
            errors.name = 'O nome deve ter no máximo 30 caracteres';
        }
    }

    // Validar cor (opcional)
    if (!isUpdate || data.color !== undefined) {
        if (!data.color) {
            errors.color = 'A cor é obrigatória';
        } else if (typeof data.color !== 'string') {
            errors.color = 'A cor deve ser uma string';
        } else {
            // Validar formato de cor hexadecimal
            const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            if (!hexColorRegex.test(data.color)) {
                errors.color = 'A cor deve estar no formato hexadecimal (ex: #FF0000)';
            }
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

module.exports = {
    validateTask,
    validateCategory,
    validateLabel
}; 