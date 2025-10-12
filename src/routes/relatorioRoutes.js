// routes/relatorioRoutes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Utilitário para períodos fixos
function getRange(tipo) {
  const agora = new Date();
  const inicio = new Date(agora);

  switch (tipo) {
    case 'dia':
      inicio.setHours(0, 0, 0, 0);
      break;
    case 'semana':
      const diaDaSemana = inicio.getDay();
      inicio.setDate(inicio.getDate() - (diaDaSemana === 0 ? 6 : diaDaSemana - 1));
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

// 🔹 Relatório por período padrão (dia, semana, mês, ano)
async function buscarRelatorio(userId, tipo) {
  const { inicio, fim } = getRange(tipo);

  const comandas = await prisma.comanda.findMany({
    where: {
      userId,
      status: 'finalizada',
      encerradaEm: { gte: inicio, lte: fim }
    }
  });

  return { comandas };
}

// 🔹 Rota: /api/relatorio/periodo?inicio=...&fim=...&userId=...
router.get('/periodo', async (req, res) => {
  try {
    const { inicio, fim, userId } = req.query;

    if (!inicio || !fim || !userId) {
      return res.status(400).json({ error: 'Parâmetros "inicio", "fim" e "userId" são obrigatórios.' });
    }

    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);

    const comandas = await prisma.comanda.findMany({
      where: {
        userId,
        status: 'finalizada',
        encerradaEm: { gte: inicioDate, lte: fimDate }
      }
    });

    res.json(comandas);

  } catch (err) {
    console.error('Erro ao buscar finalizados por período:', err);
    res.status(500).json({ error: 'Erro ao buscar finalizados por período', detalhes: err.message });
  }
});

// 🔹 Relatórios padrão
router.get('/dia/:userId', async (req, res) => {
  try {
    const data = await buscarRelatorio(req.params.userId, 'dia');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro no relatório diário', detalhes: err.message });
  }
});

router.get('/semana/:userId', async (req, res) => {
  try {
    const data = await buscarRelatorio(req.params.userId, 'semana');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro no relatório semanal' });
  }
});

router.get('/mes/:userId', async (req, res) => {
  try {
    const data = await buscarRelatorio(req.params.userId, 'mes');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro no relatório mensal' });
  }
});

router.get('/ano/:userId', async (req, res) => {
  try {
    const data = await buscarRelatorio(req.params.userId, 'ano');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro no relatório anual' });
  }
});

// 🔹 Rota padrão (ano por padrão)
router.get('/:userId', async (req, res) => {
  try {
    const data = await buscarRelatorio(req.params.userId, 'ano');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados do relatório' });
  }
});

export default router;
