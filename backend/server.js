// Importando as dependências
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');

// Carregando variáveis de ambiente
dotenv.config();

// Criando a aplicação Express
const app = express();

// Middleware
app.use(cors());           // Permite acesso do frontend
app.use(express.json());   // Para entender JSON no corpo das requisições
app.use('/api/auth', authRoutes); //// Usando as rotas de autenticação

// Conectando ao banco de dados
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  // Verificando a conexão
  db.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao MySQL:', err);
      return;
    }
    console.log('Conectado ao MySQL!');
  });


// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

// Definindo a porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
