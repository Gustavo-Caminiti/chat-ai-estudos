const db = require('../config/database');

// Função para criar um novo usuário
const createUser = (username, password, email, callback) => {
  const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  db.query(query, [username, password, email], (err, result) => {
    if (err) {
      console.error('Erro ao criar usuário:', err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

// Função para buscar um usuário pelo nome
const findUserByUsername = (username, callback) => {
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, result) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

module.exports = { createUser, findUserByUsername };
