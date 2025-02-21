const db = require('../config/database');  // Certifique-se de que a conexão com o banco de dados esteja correta.

exports.addSchedule = (req, res) => {
  // Extração dos dados do corpo da requisição
  const { user_id, subject, day_of_week, start_time, end_time } = req.body;

  // Verificando se todos os campos necessários foram enviados
  if (!user_id || !subject || !day_of_week || !start_time || !end_time) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  // Query SQL para inserir a rotina de aulas no banco de dados
  const query = 'INSERT INTO schedule (user_id, subject, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [user_id, subject, day_of_week, start_time, end_time], (err, result) => {
    if (err) {
      // Se houver erro, retornamos um erro 500
      return res.status(500).json({ message: 'Erro ao adicionar a rotina de aulas', error: err });
    }

    // Se a rotina for adicionada com sucesso, retornamos uma mensagem de sucesso
    res.status(201).json({ message: 'Rotina de aulas adicionada com sucesso' });
  });
};


exports.getScheduleByUser = (req, res) => {
    const user_id = req.user.id; // Pegando o ID do usuário autenticado
  
    const query = 'SELECT * FROM schedule WHERE user_id = ? ORDER BY day_of_week, start_time';
    db.query(query, [user_id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar a rotina de aulas', error: err });
      }
  
      res.status(200).json({ schedule: results });
    });
  };
  
  exports.getSchedules = (req, res) => {
    const query = 'SELECT * FROM schedule WHERE user_id = ?';
  
    db.query(query, [req.user.id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar horários', error: err });
      }
  
      res.status(200).json(results);
    });
  };
  
  exports.updateSchedule = (req, res) => {
    const { id } = req.params;
    const { subject, day_of_week, start_time, end_time } = req.body;
  
    if (!subject || !day_of_week || !start_time || !end_time) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
  
    const query = `UPDATE schedule SET subject = ?, day_of_week = ?, start_time = ?, end_time = ? WHERE id = ? AND user_id = ?`;
    
    db.query(query, [subject, day_of_week, start_time, end_time, id, req.user.id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao atualizar a rotina de aulas', error: err });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Horário não encontrado ou não pertence ao usuário' });
      }
  
      res.status(200).json({ message: 'Horário atualizado com sucesso' });
    });
  };
  
  exports.deleteSchedule = (req, res) => {
    const { id } = req.params;
  
    const query = `DELETE FROM schedule WHERE id = ? AND user_id = ?`;
  
    db.query(query, [id, req.user.id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao excluir a rotina de aulas', error: err });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Horário não encontrado ou não pertence ao usuário' });
      }
  
      res.status(200).json({ message: 'Horário removido com sucesso' });
    });
  };
  