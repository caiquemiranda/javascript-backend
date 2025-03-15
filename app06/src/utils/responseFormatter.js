/**
 * Utilitário para formatação de respostas da API
 * Padroniza o formato das respostas enviadas ao cliente
 */

/**
 * Formata uma resposta de sucesso
 * @param {Object} data - Dados a serem incluídos na resposta
 * @param {string} message - Mensagem de sucesso
 * @param {number} statusCode - Código de status HTTP (default: 200)
 * @returns {Object} - Objeto formatado para resposta
 */
const success = (data = null, message = 'Operação realizada com sucesso', statusCode = 200) => {
    return {
        success: true,
        message,
        statusCode,
        data,
        timestamp: new Date().toISOString()
    };
};

/**
 * Formata uma resposta de erro
 * @param {string} message - Mensagem de erro
 * @param {number} statusCode - Código de status HTTP (default: 400)
 * @param {Object} errors - Detalhes adicionais sobre o erro
 * @returns {Object} - Objeto formatado para resposta
 */
const error = (message = 'Ocorreu um erro', statusCode = 400, errors = null) => {
    return {
        success: false,
        message,
        statusCode,
        errors,
        timestamp: new Date().toISOString()
    };
};

module.exports = {
    success,
    error
}; 