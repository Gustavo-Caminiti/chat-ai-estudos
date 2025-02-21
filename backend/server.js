// Importando as dependências
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Importando as rotas
const authRoutes = require('./routes/authRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); 
console.log("🔹 Rotas carregadas: Auth, Schedule, e Upload");

// Carregando variáveis de ambiente
dotenv.config();

// Criando a aplicação Express
const app = express();

// Middlewares globais
app.use(cors());           // Permite acesso do frontend
app.use(express.json());   // Permite o uso de JSON no corpo da requisição
app.use(bodyParser.json()); // Garante suporte a JSON no body


// Adicionando mensagens de depuração
console.log("🔹 Rotas carregadas: Auth e Schedule");

// Definição de rotas
app.use('/api/auth', authRoutes);  // Rotas de autenticação
app.use('/api', scheduleRoutes);   // Rotas da rotina de aulas
app.use('/api', uploadRoutes);  // Isso registra as rotas de upload para o prefixo "/api"

// Conectando ao banco de dados
console.log("🛠️ Verificando variáveis de ambiente:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Verificando a conexão
db.connect((err) => {
    if (err) {
        console.error("❌ Erro ao conectar ao MySQL:", err);
        return;
    }
    console.log("✅ Conectado ao MySQL!");
});

// Rota de teste
app.get('/', (req, res) => {
    res.send('✅ Servidor está funcionando!');
});

// Definição da porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
