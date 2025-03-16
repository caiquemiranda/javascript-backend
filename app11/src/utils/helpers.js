/**
 * Funções utilitárias para a aplicação
 */

/**
 * Formata uma data para o formato brasileiro
 * @param {Date} date - Data a ser formatada
 * @returns {string} Data formatada
 */
const formatDate = (date) => {
    if (!date) return null;

    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Sanitiza um objeto, removendo campos nulos ou undefined
 * @param {Object} obj - Objeto a ser sanitizado
 * @returns {Object} Objeto sanitizado
 */
const sanitizeObject = (obj) => {
    const sanitized = {};

    Object.keys(obj).forEach(key => {
        if (obj[key] !== null && obj[key] !== undefined) {
            sanitized[key] = obj[key];
        }
    });

    return sanitized;
};

/**
 * Gera um código aleatório
 * @param {number} length - Comprimento do código
 * @returns {string} Código gerado
 */
const generateRandomCode = (length = 6) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }

    return code;
};

/**
 * Limita uma string a um número máximo de caracteres
 * @param {string} str - String a ser limitada
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} String limitada
 */
const truncateString = (str, maxLength = 100) => {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
};

/**
 * Converte uma string para slug
 * @param {string} text - Texto a ser convertido
 * @returns {string} Slug gerado
 */
const slugify = (text) => {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

module.exports = {
    formatDate,
    sanitizeObject,
    generateRandomCode,
    truncateString,
    slugify
}; 