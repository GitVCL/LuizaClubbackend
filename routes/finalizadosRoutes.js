const express = require('express');
const router = express.Router();
const Finalizado = require('../models/Finalizados');

// Criar finalizado (ao encerrar uma comanda)
router.post('/', async (req, res) => {
  try {
    const novoFinalizado = new Finalizado(req.body);
    const salvo = await novoFinalizado.save();
    res.status(201).json(salvo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar comanda finalizada' });
  }
});

// Buscar finalizados por usuário
router.get('/:userId', async (req, res) => {
  try {
    const lista = await Finalizado.find({ userId: req.params.userId });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar finalizados' });
  }
});

module.exports = router;
