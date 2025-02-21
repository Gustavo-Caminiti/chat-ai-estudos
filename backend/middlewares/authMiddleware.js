const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'chave-secreta';
const blacklist = require('../config/blacklist');  // Importa a blacklist

// Middleware para verificar se o usuário está autenticado
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  console.log('Token recebido:', token);

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  // Remove "Bearer " se estiver no início do token
  const formattedToken = token.replace('Bearer ', '');

  // Verifica se o token está na blacklist
  if (blacklist.has(formattedToken)) {
    return res.status(401).json({ message: 'Token inválido. Faça login novamente.' });
  }

  jwt.verify(formattedToken, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }

    req.user = user; // Adiciona os dados do usuário à requisição
    next();
  });
};

module.exports = authenticateToken;
