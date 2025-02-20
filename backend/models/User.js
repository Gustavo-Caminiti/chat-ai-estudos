const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Função para criar um novo usuário
const createUser = (username, password, email, callback) => {
  // Hash da senha antes de armazená-la
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Erro ao hash da senha:', err);
      return callback(err, null);
    }

    // Criação do usuário no banco de dados com a senha criptografada
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.query(query, [username, hashedPassword, email], (err, result) => {
      if (err) {
        console.error('Erro ao criar usuário:', err);
        return callback(err, null);
      } else {
        callback(null, result);
      }
    });
  });
};

// Função para buscar um usuário pelo nome
const findUserByUsername = (username, callback) => {
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, result) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

// Função para verificar se a senha fornecida corresponde à senha no banco de dados
const verifyPassword = (storedPassword, providedPassword, callback) => {
  bcrypt.compare(providedPassword, storedPassword, (err, isMatch) => {
    if (err) {
      console.error('Erro ao comparar senhas:', err);
      return callback(err, null);
    }
    callback(null, isMatch);
  });
};

module.exports = { createUser, findUserByUsername, verifyPassword };
