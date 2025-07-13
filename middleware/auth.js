const jwt = require('jsonwebtoken');

module.exports = function verificarToken(request, response, next) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return response.status(401).json({msg: "Token não fornecido"});
    }

    try {
        const usuario = jwt.verify(token, process.env.JWT_SECRET);
        request.usuario = usuario;
        next();

    } catch (err) {
        return response.status(403).json({msg: "Token inválido ou expirado."});
    }
}
