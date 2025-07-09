// routes/relatorioRoutes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

function getRange(tipo) {
  const agora = new Date();
  const inicio = new Date(agora);

  switch (tipo) {
    case 'dia':
      inicio.setHours(0, 0, 0, 0);
      break;
    case 'semana':
      const diaDaSemana = inicio.getDay();
      inicio.setDate(inicio.getDate() - diaDaSemana);
      inicio.setHours(0, 0, 0, 0);
      break;
    case 'mes':
      inicio.setDate(1);
      inicio.setHours(0, 0, 0, 0);
      break;
    case 'ano':
      inicio.setMonth(0, 1);
      inicio.setHours(0, 0, 0, 0);
      break;
  }

  return { inicio, fim: agora };
}

async function buscarRelatorio(userId, tipo) {
  const { inicio, fim } = getRange(tipo);

  const comandas = await prisma.comanda.findMany({
    where: {
      userId,
      status: 'finalizada',
      encerradaEm: { gte: inicio, lte: fim }
    }
  });

  const quartos = await prisma.quarto.findMany({
    where: {
      userId,
      status: 'finalizado',
      encerradoEm: { gte: inicio, lte: fim } // CORRIGIDO AQUI ✅
    }
  });

  return { comandas, quartos };
}

// Rota base (todos finalizados)
router.get('/:userId', async (req, res) => {
  try {
    const data = await buscarRelatorio(req.params.userId, 'ano');
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dados do relatório' });
  }
});

// Por dia
router.get('/dia/:userId', async (req, res) => {
  try {
    const data = await buscarRelatorio(req.params.userId, 'dia');
    res.json(data);
  } catch (err) {
    console.error('Erro no relatório diário:', err);
    res.status(500).json({ error: 'Erro no relatório diário', detalhes: err.message });
  }
});

// Por semana
router.get('/semana/:userId', async (req, res) => {
  try {
    const data = await buscarRelatorio(req.params.userId, 'semana');
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no relatório semanal' });
  }
});

// Por mês
router.get('/mes/:userId', async (req, res) => {
  try {
    const data = await buscarRelatorio(req.params.userId, 'mes');
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no relatório mensal' });
  }
});

// Por ano
router.get('/ano/:userId', async (req, res) => {
  try {
    const data = await buscarRelatorio(req.params.userId, 'ano');
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no relatório anual' });
  }
});

export default router;
