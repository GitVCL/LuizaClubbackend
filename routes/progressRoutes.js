const express = require('express');
const User = require('../models/User');

const router = express.Router();

// 👉 ROTA PARA BUSCAR TEMPOS DE UM USUÁRIO
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({
      studyTime: user.studyTime,
      leisureTime: user.leisureTime,
      devTime: user.devTime,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar progresso.' });
  }
});

// 👉 ROTA PARA SALVAR TEMPOS
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { studyTime, leisureTime, devTime } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.studyTime = studyTime;
    user.leisureTime = leisureTime;
    user.devTime = devTime;

    await user.save();

    res.status(200).json({ message: 'Progresso salvo com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao salvar progresso.' });
  }
});

module.exports = router;
