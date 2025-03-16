const logger = require('../utils/logger');

/**
 * Middleware para verificar se o usuário tem a role necessária
 * @param {string|string[]} roles - Role ou array de roles permitidas
 */
const checkRole = (roles) => {
    return (req, res, next) => {
        try {
            // Verificar se o usuário existe na requisição
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuário não autenticado'
                });
            }

            // Converter roles para array se for string
            const allowedRoles = Array.isArray(roles) ? roles : [roles];

            // Verificar se o usuário tem alguma das roles permitidas
            if (!allowedRoles.includes(req.user.role)) {
                logger.warn(`Acesso negado para usuário ${req.user.id} com role ${req.user.role}`);
                return res.status(403).json({
                    success: false,
                    message: 'Acesso negado. Você não tem permissão para acessar este recurso'
                });
            }

            next();
        } catch (error) {
            logger.error('Erro no middleware de verificação de role:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    };
};

module.exports = checkRole; 