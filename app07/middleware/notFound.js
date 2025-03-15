/**
 * Middleware para tratar rotas não encontradas
 * @param {Object} req Objeto de requisição
 * @param {Object} res Objeto de resposta
 */
function notFound(req, res) {
    // Verifica se a requisição é para a API
    if (req.path.startsWith('/api')) {
        return res.status(404).json({
            status: 'error',
            message: `Rota não encontrada: ${req.method} ${req.path}`
        });
    }

    // Para requisições de página, redireciona para a página principal
    res.redirect('/');
}

module.exports = notFound; 