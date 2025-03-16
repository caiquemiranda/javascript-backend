/**
 * Utilitários para autenticação e segurança
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Gera um hash de senha
 * @param {string} password - Senha em texto simples
 * @returns {Promise<string>} Hash da senha
 */
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

/**
 * Compara uma senha em texto simples com um hash para verificação
 * @param {string} password - Senha em texto simples
 * @param {string} hashedPassword - Hash da senha armazenada
 * @returns {Promise<boolean>} Verdadeiro se a senha corresponder ao hash
 */
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

/**
 * Gera um token JWT para o usuário
 * @param {Object} user - Dados do usuário para incluir no token
 * @returns {string} Token JWT gerado
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        config.jwt.secret,
        {
            expiresIn: config.jwt.expiresIn
        }
    );
};

/**
 * Verifica e decodifica um token JWT
 * @param {string} token - Token JWT a ser verificado
 * @returns {Object|null} Payload decodificado ou null se inválido
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.jwt.secret);
    } catch (error) {
        return null;
    }
};

/**
 * Remove informações sensíveis do objeto de usuário
 * @param {Object} user - Objeto de usuário completo
 * @returns {Object} Objeto de usuário sem dados sensíveis
 */
const sanitizeUser = (user) => {
    if (!user) return null;

    const sanitized = { ...user };

    // Remover a senha
    if (sanitized.password) delete sanitized.password;

    return sanitized;
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
    sanitizeUser
}; 