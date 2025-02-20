// Importando as dependências
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes'); // Importa as rotas de schedule

// Carregando variáveis de ambiente
dotenv.config();

// Criando a aplicação Express
const app = express();

// Middleware
app.use(cors());           // Permite acesso do frontend
app.use(express.json());   // Para entender JSON no corpo das requisições
app.use('/api/auth', authRoutes); //// Usando as rotas de autenticação
app.use(bodyParser.json()); // Para permitir requisições com JSON
// Use as rotas para o planejamento de aulas
app.use('/api', scheduleRoutes);
// Conectando ao banco de dados
console.log(process.env.DB_HOST);  // Deve exibir o valor de DB_HOST
console.log(process.env.DB_USER);  // Deve exibir o valor de DB_USER

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

  app.use(express.json());
app.use('/auth', authRoutes); // Defina as rotas de autenticação

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});



// Definindo a porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
