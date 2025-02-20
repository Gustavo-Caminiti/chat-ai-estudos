const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Rota de cadastro
router.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  // Verifica se o usuário já existe
  User.findUserByUsername(username, (err, result) => {
    if (result.length > 0) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Criptografa a senha antes de salvar
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao criptografar senha' });
      }

      // Cria o novo usuário
      User.createUser(username, hashedPassword, email, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao criar usuário' });
        }
        res.status(201).json({ message: 'Usuário criado com sucesso' });
      });
    });
  });
});

// Rota de login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findUserByUsername(username, (err, result) => {
    if (result.length === 0) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const user = result[0];

    // Verifica a senha
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao comparar senha' });
      }
      if (!isMatch) {
        return res.status(400).json({ message: 'Senha incorreta' });
      }

      // Gera o token JWT
      const token = jwt.sign({ id: user.id }, 'secrectkey', { expiresIn: '1h' });
      res.status(200).json({ message: 'Login bem-sucedido', token });
    });
  });
});

module.exports = router;
