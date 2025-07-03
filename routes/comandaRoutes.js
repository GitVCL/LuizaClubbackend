const express = require('express');
const router = express.Router();
const Comanda = require('../models/Comanda');

// Criar comanda
router.post('/', async (req, res) => {
  try {
    const nova = new Comanda(req.body);
    const salva = await nova.save();
    res.status(201).json(salva);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar comanda' });
  }
});

// Buscar comandas de um usuário
router.get('/:userId', async (req, res) => {
  try {
    const lista = await Comanda.find({ userId: req.params.userId });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar comandas' });
  }
});

// Atualizar comanda
router.put('/:id', async (req, res) => {
  try {
    const atualizada = await Comanda.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizada);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar comanda' });
  }
});

// Deletar comanda
router.delete('/:id', async (req, res) => {
  try {
    await Comanda.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comanda deletada' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar comanda' });
  }
});

module.exports = router;
