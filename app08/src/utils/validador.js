/**
 * Utilitário para validação de dados
 */

const validador = {
    /**
     * Valida os dados de uma tarefa
     * @param {Object} dados Dados da tarefa a serem validados
     * @returns {Object} Objeto com resultado da validação
     */
    validarTarefa: (dados) => {
        const erros = [];

        // Valida título
        if (!dados.titulo) {
            erros.push('O título da tarefa é obrigatório');
        } else if (dados.titulo.length < 3) {
            erros.push('O título deve ter pelo menos 3 caracteres');
        } else if (dados.titulo.length > 100) {
            erros.push('O título deve ter no máximo 100 caracteres');
        }

        // Valida categoria (se fornecida)
        if (dados.categoria_id !== undefined && dados.categoria_id !== null) {
            if (isNaN(parseInt(dados.categoria_id)) || parseInt(dados.categoria_id) <= 0) {
                erros.push('ID de categoria inválido');
            }
        }

        // Valida prioridade (se fornecida)
        if (dados.prioridade !== undefined) {
            const prioridadesValidas = [1, 2, 3];
            if (!prioridadesValidas.includes(parseInt(dados.prioridade))) {
                erros.push('Prioridade inválida. Utilize: 1 (Baixa), 2 (Média) ou 3 (Alta)');
            }
        }

        // Valida data de vencimento (se fornecida)
        if (dados.data_vencimento) {
            const dataVencimento = new Date(dados.data_vencimento);
            if (isNaN(dataVencimento.getTime())) {
                erros.push('Data de vencimento inválida. Utilize o formato YYYY-MM-DD');
            }
        }

        // Valida etiquetas (se fornecidas)
        if (dados.etiquetas) {
            if (!Array.isArray(dados.etiquetas)) {
                erros.push('Etiquetas devem ser fornecidas como um array de IDs');
            } else {
                for (const etiquetaId of dados.etiquetas) {
                    if (isNaN(parseInt(etiquetaId)) || parseInt(etiquetaId) <= 0) {
                        erros.push(`ID de etiqueta inválido: ${etiquetaId}`);
                    }
                }
            }
        }

        return {
            valido: erros.length === 0,
            erros
        };
    },

    /**
     * Valida os dados de uma categoria
     * @param {Object} dados Dados da categoria a serem validados
     * @returns {Object} Objeto com resultado da validação
     */
    validarCategoria: (dados) => {
        const erros = [];

        // Valida nome
        if (!dados.nome) {
            erros.push('O nome da categoria é obrigatório');
        } else if (dados.nome.length < 3) {
            erros.push('O nome deve ter pelo menos 3 caracteres');
        } else if (dados.nome.length > 50) {
            erros.push('O nome deve ter no máximo 50 caracteres');
        }

        // Valida cor (se fornecida)
        if (dados.cor && !/^#[0-9A-F]{6}$/i.test(dados.cor)) {
            erros.push('Cor inválida. Utilize o formato hexadecimal (ex: #FF5733)');
        }

        return {
            valido: erros.length === 0,
            erros
        };
    },

    /**
     * Valida os dados de uma etiqueta
     * @param {Object} dados Dados da etiqueta a serem validados
     * @returns {Object} Objeto com resultado da validação
     */
    validarEtiqueta: (dados) => {
        const erros = [];

        // Valida nome
        if (!dados.nome) {
            erros.push('O nome da etiqueta é obrigatório');
        } else if (dados.nome.length < 2) {
            erros.push('O nome deve ter pelo menos 2 caracteres');
        } else if (dados.nome.length > 30) {
            erros.push('O nome deve ter no máximo 30 caracteres');
        }

        // Valida cor (se fornecida)
        if (dados.cor && !/^#[0-9A-F]{6}$/i.test(dados.cor)) {
            erros.push('Cor inválida. Utilize o formato hexadecimal (ex: #FF5733)');
        }

        return {
            valido: erros.length === 0,
            erros
        };
    },

    /**
     * Normaliza uma string para uso em pesquisas (remove acentos, etc.)
     * @param {string} str String a ser normalizada
     * @returns {string} String normalizada
     */
    normalizarString: (str) => {
        if (!str) return '';
        return str.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }
};

module.exports = validador; 