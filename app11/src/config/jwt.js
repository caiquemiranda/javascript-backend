/**
 * Configurações do JWT (JSON Web Token)
 */
module.exports = {
    // Chave secreta para assinar os tokens
    secret: process.env.JWT_SECRET || 'sua-chave-secreta-super-segura',

    // Tempo de expiração do token (em segundos ou string no formato do módulo ms)
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',

    // Algoritmo de assinatura
    algorithm: 'HS256',

    // Opções adicionais para o token
    options: {
        // Emissor do token
        issuer: process.env.JWT_ISSUER || 'api-rest',

        // Audiência do token
        audience: process.env.JWT_AUDIENCE || 'api-clients'
    }
}; 