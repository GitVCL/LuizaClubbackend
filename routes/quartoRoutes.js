const express = require('express');
const router = express.Router();
const Quarto = require('../models/Quarto');

// Criar quarto
router.post('/', async (req, res) => {
  try {
    const novo = new Quarto(req.body);
    const salvo = await novo.save();
    res.status(201).json(salvo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar quarto' });
  }
});

// Buscar todos os quartos do usuário
router.get('/:userId', async (req, res) => {
  try {
    const lista = await Quarto.find({ userId: req.params.userId });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar quartos' });
  }
});

// Atualizar quarto
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await Quarto.findByIdAndUpdate(
      req.params.id,
      {
        nome: req.body.nome,
        total: req.body.total,
        itens: req.body.itens,
      },
      { new: true }
    );
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar quarto' });
  }
});

// Deletar um quarto
router.delete('/:id', async (req, res) => {
  try {
    await Quarto.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar quarto' });
  }
});

module.exports = router;
