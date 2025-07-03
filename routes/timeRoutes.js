const express = require('express');
const User = require('../models/User');

const router = express.Router();

// 👉 ROTA PARA SALVAR TEMPOS DE CRONÔMETRO (normal)
router.post('/save-time', async (req, res) => {
  const { userId, studyTime, leisureTime, devTime } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    user.studyTime = studyTime;
    user.leisureTime = leisureTime;
    user.devTime = devTime;

    await user.save();
    res.status(200).json({ message: 'Tempo salvo com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao salvar o tempo.', error: err.message });
  }
});

// 👉 ROTA PARA BUSCAR OS TEMPOS SALVOS
router.get('/get-time/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    res.status(200).json({
      studyTime: user.studyTime || 0,
      leisureTime: user.leisureTime || 0,
      devTime: user.devTime || 0,
      totalStudyTime: user.totalStudyTime || 0,
      totalLeisureTime: user.totalLeisureTime || 0,
      totalDevTime: user.totalDevTime || 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar o tempo.', error: err.message });
  }
});

// 👉 ROTA PARA ZERAR UM CRONÔMETRO E ACUMULAR NO TOTAL
router.post('/reset-time', async (req, res) => {
  const { userId, tipo } = req.body;  // tipo = 'study', 'leisure' ou 'dev'

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    // Determina qual campo atualizar
    if (tipo === 'study') {
      user.totalStudyTime += user.studyTime;
      user.studyTime = 0;
    } else if (tipo === 'leisure') {
      user.totalLeisureTime += user.leisureTime;
      user.leisureTime = 0;
    } else if (tipo === 'dev') {
      user.totalDevTime += user.devTime;
      user.devTime = 0;
    } else {
      return res.status(400).json({ message: 'Tipo inválido.' });
    }

    await user.save();
    res.status(200).json({ message: `Tempo de ${tipo} zerado e acumulado com sucesso!` });

  } catch (err) {
    res.status(500).json({ message: 'Erro ao resetar o tempo.', error: err.message });
  }
});

module.exports = router;
