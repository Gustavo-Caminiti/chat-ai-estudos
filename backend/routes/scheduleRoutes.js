const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Rota para adicionar a rotina de aulas
router.post('/schedule', scheduleController.addSchedule);

module.exports = router;