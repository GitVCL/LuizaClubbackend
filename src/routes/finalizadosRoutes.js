// routes/finalizadosRoutes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Buscar comandas finalizadas
router.get('/comandas/:userId', async (req, res) => {
  try {
    const finalizadas = await prisma.comanda.findMany({
      where: {
        userId: req.params.userId,
        status: 'finalizada'
      },
      include: { itens: true }
    });
    res.json(finalizadas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar comandas finalizadas' });
  }
});

// Buscar quartos finalizados
router.get('/quartos/:userId', async (req, res) => {
  try {
    const finalizados = await prisma.quarto.findMany({
      where: {
        userId: req.params.userId,
        status: 'finalizado'
      },
      include: { itens: true }
    });
    res.json(finalizados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar quartos finalizados' });
  }
});

export default router;
