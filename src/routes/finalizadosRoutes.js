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


// Buscar finalizados por período
router.get('/periodo', async (req, res) => {
  const { inicio, fim, userId } = req.query;

  if (!inicio || !fim || !userId) {
    return res.status(400).json({ error: 'Parâmetros ausentes' });
  }

  try {
    const finalizados = await prisma.comanda.findMany({
      where: {
        userId: userId,
        status: 'finalizada',
          encerradaEm: {
        gte: new Date(inicio),
        lte: new Date(fim + 'T23:59:59')
      }
      }
    });

    res.json(finalizados);
  } catch (err) {
    console.error('Erro ao buscar finalizados por período:', err);
    res.status(500).json({ error: 'Erro ao buscar finalizados por período' });
  }
});

export default router;
