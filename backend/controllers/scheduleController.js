const db = require('../config/database');

exports.addSchedule = (req, res) => {
  const { user_id, subject, day_of_week, start_time, end_time } = req.body;

  if (!user_id || !subject || !day_of_week || !start_time || !end_time) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  const query = 'INSERT INTO schedule (user_id, subject, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [user_id, subject, day_of_week, start_time, end_time], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao adicionar a rotina de aulas', error: err });
    }

    res.status(201).json({ message: 'Rotina de aulas adicionada com sucesso' });
  });
};
