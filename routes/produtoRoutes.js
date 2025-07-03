const express = require('express');
const router = express.Router();
const Produto = require('../models/Produto');

// GET - buscar todos os produtos
router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar produtos.' });
  }
});

// POST - adicionar novo produto
router.post('/', async (req, res) => {
  try {
    const novoProduto = new Produto(req.body);
    await novoProduto.save();
    res.status(201).json(novoProduto);
  } catch (err) {
    console.error('Erro ao salvar produto:', err); // <-- ADICIONE ESSA LINHA
    res.status(400).json({ message: 'Erro ao adicionar produto.' });
  }
});


// DELETE - excluir produto
router.delete('/:id', async (req, res) => {
  try {
    await Produto.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produto excluído com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir produto.' });
  }
});

module.exports = router;
