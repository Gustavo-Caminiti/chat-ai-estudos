const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();
const secretKey = process.env.JWT_SECRET || 'chave-secreta';

// Rota de registro de usuário (já existente)
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  // Hash da senha antes de salvar
  const hashedPassword = await bcrypt.hash(password, 10);

  User.createUser(username, hashedPassword, email, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao registrar usuário.', error: err });
    }
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  });
});

// Rota para login (NOVA)
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }

  User.findUserByUsername(username, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar usuário.', error: err });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

    const user = result[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao comparar senhas.', error: err });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
      }

      // Criando o token JWT
      const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login bem-sucedido!', token });
    });
  });
});

// Rota protegida para buscar perfil do usuário
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Acesso autorizado!', user: req.user });
});

module.exports = router;
