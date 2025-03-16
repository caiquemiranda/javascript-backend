/**
 * Configuração do JWT (JSON Web Token)
 */
require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET || 'sua_chave_secreta_muito_segura_para_jwt',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',

    // Opções adicionais para o token
    options: {
        algorithm: 'HS256', // Algoritmo de assinatura
        issuer: 'auth-api', // Emissor do token
        audience: 'app-client' // Público-alvo do token
    }
}; 