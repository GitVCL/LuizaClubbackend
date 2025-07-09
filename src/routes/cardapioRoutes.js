// routes/cardapioRoutes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Criar novo produto
router.post('/', async (req, res) => {
  try {
    const { nome, valor, unidades, variantes, userId } = req.body;

    const novo = await prisma.produto.create({
      data: {
        nome,
        valor,
        unidades,
        variantes,
        userId
      }
    });

    res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});
// Buscar todos os produtos
router.get('/', async (req, res) => {
  try {
    const lista = await prisma.produto.findMany();
    res.json(lista);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Deletar um produto
router.delete('/:id', async (req, res) => {
  try {
      const id = req.params.id;
    await prisma.produto.delete({ where: { id } });
    res.json({ message: 'Produto excluído com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir produto' });
  }
});

export default router;
