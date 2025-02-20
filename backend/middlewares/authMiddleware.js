const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'chave-secreta';

// Middleware para verificar se o usuário está autenticado
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  jwt.verify(token.replace('Bearer ', ''), secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }

    req.user = user; // Adiciona os dados do usuário à requisição
    next();
  });
};

module.exports = authenticateToken;
