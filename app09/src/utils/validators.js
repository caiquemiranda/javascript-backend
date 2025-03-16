/**
 * Utilitários para validação de dados
 */

/**
 * Valida os dados de registro de um novo usuário
 * @param {Object} data - Dados do formulário de registro
 * @returns {Object} Objeto com resultado da validação
 */
const validateRegistration = (data) => {
    const errors = {};

    // Validar nome
    if (!data.name) {
        errors.name = 'O nome é obrigatório';
    } else if (typeof data.name !== 'string') {
        errors.name = 'O nome deve ser uma string';
    } else if (data.name.length < 3) {
        errors.name = 'O nome deve ter pelo menos 3 caracteres';
    } else if (data.name.length > 50) {
        errors.name = 'O nome deve ter no máximo 50 caracteres';
    }

    // Validar email
    if (!data.email) {
        errors.email = 'O email é obrigatório';
    } else if (typeof data.email !== 'string') {
        errors.email = 'O email deve ser uma string';
    } else if (!isValidEmail(data.email)) {
        errors.email = 'Email inválido';
    }

    // Validar senha
    if (!data.password) {
        errors.password = 'A senha é obrigatória';
    } else if (typeof data.password !== 'string') {
        errors.password = 'A senha deve ser uma string';
    } else if (data.password.length < 6) {
        errors.password = 'A senha deve ter pelo menos 6 caracteres';
    } else if (data.password.length > 100) {
        errors.password = 'A senha deve ter no máximo 100 caracteres';
    } else if (!/[A-Z]/.test(data.password)) {
        errors.password = 'A senha deve conter pelo menos uma letra maiúscula';
    } else if (!/[0-9]/.test(data.password)) {
        errors.password = 'A senha deve conter pelo menos um número';
    }

    // Validar confirmação de senha (se fornecida)
    if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Valida os dados de login
 * @param {Object} data - Dados do formulário de login
 * @returns {Object} Objeto com resultado da validação
 */
const validateLogin = (data) => {
    const errors = {};

    // Validar email
    if (!data.email) {
        errors.email = 'O email é obrigatório';
    } else if (typeof data.email !== 'string') {
        errors.email = 'O email deve ser uma string';
    } else if (!isValidEmail(data.email)) {
        errors.email = 'Email inválido';
    }

    // Validar senha
    if (!data.password) {
        errors.password = 'A senha é obrigatória';
    } else if (typeof data.password !== 'string') {
        errors.password = 'A senha deve ser uma string';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Valida os dados para atualização de usuário
 * @param {Object} data - Dados para atualização
 * @returns {Object} Objeto com resultado da validação
 */
const validateUserUpdate = (data) => {
    const errors = {};

    // Validar nome (se fornecido)
    if (data.name !== undefined) {
        if (typeof data.name !== 'string') {
            errors.name = 'O nome deve ser uma string';
        } else if (data.name.length < 3) {
            errors.name = 'O nome deve ter pelo menos 3 caracteres';
        } else if (data.name.length > 50) {
            errors.name = 'O nome deve ter no máximo 50 caracteres';
        }
    }

    // Validar email (se fornecido)
    if (data.email !== undefined) {
        if (typeof data.email !== 'string') {
            errors.email = 'O email deve ser uma string';
        } else if (!isValidEmail(data.email)) {
            errors.email = 'Email inválido';
        }
    }

    // Validar senha (se fornecida)
    if (data.password !== undefined) {
        if (typeof data.password !== 'string') {
            errors.password = 'A senha deve ser uma string';
        } else if (data.password.length < 6) {
            errors.password = 'A senha deve ter pelo menos 6 caracteres';
        } else if (data.password.length > 100) {
            errors.password = 'A senha deve ter no máximo 100 caracteres';
        } else if (!/[A-Z]/.test(data.password)) {
            errors.password = 'A senha deve conter pelo menos uma letra maiúscula';
        } else if (!/[0-9]/.test(data.password)) {
            errors.password = 'A senha deve conter pelo menos um número';
        }

        // Validar confirmação de senha (se fornecida)
        if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
            errors.confirmPassword = 'As senhas não coincidem';
        }
    }

    // Validar role (se fornecida)
    if (data.role !== undefined) {
        const validRoles = ['user', 'admin'];
        if (!validRoles.includes(data.role)) {
            errors.role = 'Role inválida. Deve ser "user" ou "admin"';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Verifica se um email é válido
 * @param {string} email - Email a ser verificado
 * @returns {boolean} Verdadeiro se o email for válido
 */
const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateUserUpdate,
    isValidEmail
}; 