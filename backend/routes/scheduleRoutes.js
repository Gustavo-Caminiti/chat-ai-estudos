const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const authenticateToken = require('../middlewares/authMiddleware');

// Criar novo horário
router.post('/schedule', authenticateToken, scheduleController.addSchedule);

// Listar horários do usuário autenticado
router.get('/schedule', authenticateToken, scheduleController.getScheduleByUser);

// Atualizar um horário existente
router.put('/schedule/:id', authenticateToken, scheduleController.updateSchedule);

// Excluir um horário
router.delete('/schedule/:id', authenticateToken, scheduleController.deleteSchedule);

module.exports = router;
