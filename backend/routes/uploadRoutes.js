const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse'); // Importação corrigida para 'pdf-parse'
const router = express.Router();
const db = require('../config/database');

// Middleware para verificar o token JWT e adicionar user_id no req (caso não tenha)
const authenticateUser = (req, res, next) => {
  // Simulei o comportamento de verificar o token JWT (se houver)
  // Aqui você faria algo como jwt.verify para autenticar o usuário
  if (req.headers['authorization']) {
    // Exemplo fictício de como você poderia verificar o token JWT
    const userId = "123"; // Isso viria de um JWT decodificado, por exemplo
    req.user = { id: userId };  // Adiciona o user_id à requisição
    next();  // Continua para a rota
  } else {
    res.status(401).json({ message: 'Token de autenticação não encontrado' });
  }
};

// Configuração do Multer para armazenar os arquivos no diretório 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = Date.now() + fileExtension; // Gera um nome único para o arquivo
    cb(null, fileName);
  }
});

const upload = multer({ storage });

// Rota para upload de arquivo com autenticação
router.post('/upload', authenticateUser, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo enviado' });
  }

  console.log('Arquivo recebido:', req.file);

  const filePath = req.file.path;
  const fileExtension = path.extname(filePath).toLowerCase();
  const user_id = req.user.id; // Aqui pegamos o user_id que foi adicionado no middleware de autenticação

  let fileContent = '';

  if (fileExtension === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    pdfParse(dataBuffer).then(function(data) {
      fileContent = data.text;
      
      // Armazenar no banco de dados
      const query = 'INSERT INTO file_contents (user_id, file_name, file_type, content) VALUES (?, ?, ?, ?)';
      db.query(query, [user_id, req.file.filename, 'pdf', fileContent], (err, result) => {
        if (err) {
          console.error("Erro ao salvar no banco de dados:", err);
          return res.status(500).json({ message: 'Erro ao salvar o conteúdo no banco', error: err });
        }
        res.status(200).json({ message: 'Arquivo carregado e conteúdo salvo com sucesso!', filePath: req.file.path });
      });
    }).catch((err) => {
      console.error("Erro ao processar o PDF:", err);
      res.status(500).json({ message: 'Erro ao processar o PDF', error: err });
    });
  } else if (fileExtension === '.txt') {
    fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Armazenar no banco de dados
    const query = 'INSERT INTO file_contents (user_id, file_name, file_type, content) VALUES (?, ?, ?, ?)';
    db.query(query, [user_id, req.file.filename, 'txt', fileContent], (err, result) => {
      if (err) {
        console.error("Erro ao salvar no banco de dados:", err);
        console.error("Erro ao salvar no banco de dados:", err.code);  // Exibe o código do erro
    console.error("Detalhes do erro:", err.sqlMessage);  // Exibe a mensagem do erro
        return res.status(500).json({ message: 'Erro ao salvar o conteúdo no banco', error: err });
      }
      res.status(200).json({ message: 'Arquivo carregado e conteúdo salvo com sucesso!', filePath: req.file.path });
    });
  } else {
    return res.status(400).json({ message: 'Tipo de arquivo não suportado. Envie um PDF ou TXT.' });
  }
});

module.exports = router;
