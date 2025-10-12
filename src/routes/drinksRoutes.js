// routes/drinksRoutes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

function calcularComissao(quantidade, meta) {
  const extra = Math.max(0, (quantidade || 0) - (meta || 20));
  return extra * 5;
}

// Criar registro de drinks para um período/semana
router.post('/', async (req, res) => {
  try {
    const { funcionaria, quantidade = 0, meta = 20, periodoInicio, periodoFim, userId, itens } = req.body;

    if (!funcionaria || !periodoInicio || !periodoFim || !userId) {
      return res.status(400).json({ error: 'Campos obrigatórios: funcionaria, periodoInicio, periodoFim, userId' });
    }

    const comissao = calcularComissao(quantidade, meta);

    const novo = await prisma.drinks.create({
      data: {
        funcionaria,
        quantidade,
        meta,
        periodoInicio: new Date(periodoInicio),
        periodoFim: new Date(periodoFim),
        comissao,
        itens: itens ?? [],
        userId
      }
    });

    res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao criar registro de drinks:', err);
    res.status(500).json({ error: 'Erro ao criar registro de drinks' });
  }
});

// Listar registros por usuário, opcionalmente filtrando por período
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { inicio, fim } = req.query;

    const where = { userId };
    if (inicio && fim) {
      where.periodoInicio = { gte: new Date(inicio) };
      where.periodoFim = { lte: new Date(fim) };
    }

    const lista = await prisma.drinks.findMany({
      where,
      orderBy: { periodoInicio: 'desc' }
    });

    res.json(lista);
  } catch (err) {
    console.error('Erro ao buscar drinks:', err);
    res.status(500).json({ error: 'Erro ao buscar drinks' });
  }
});

// Atualizar registro (nome, meta, quantidade, período) e recalcular comissão
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { funcionaria, quantidade, meta, periodoInicio, periodoFim, itens } = req.body;

    const existente = await prisma.drinks.findUnique({ where: { id } });
    if (!existente) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }

    const novaQuantidade = typeof quantidade === 'number' ? quantidade : existente.quantidade;
    const novaMeta = typeof meta === 'number' ? meta : existente.meta;
    const comissao = calcularComissao(novaQuantidade, novaMeta);

    const atualizado = await prisma.drinks.update({
      where: { id },
      data: {
        funcionaria: funcionaria ?? existente.funcionaria,
        quantidade: novaQuantidade,
        meta: novaMeta,
        periodoInicio: periodoInicio ? new Date(periodoInicio) : existente.periodoInicio,
        periodoFim: periodoFim ? new Date(periodoFim) : existente.periodoFim,
        comissao,
        itens: itens ?? existente.itens
      }
    });

    res.json(atualizado);
  } catch (err) {
    console.error('Erro ao atualizar drinks:', err);
    res.status(500).json({ error: 'Erro ao atualizar drinks' });
  }
});

// Incrementar 1 drink
router.patch('/:id/add', async (req, res) => {
  try {
    const { id } = req.params;
    const existente = await prisma.drinks.findUnique({ where: { id } });
    if (!existente) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }

    const quantidade = existente.quantidade + 1;
    const comissao = calcularComissao(quantidade, existente.meta);

    const atualizado = await prisma.drinks.update({
      where: { id },
      data: { quantidade, comissao }
    });

    res.json(atualizado);
  } catch (err) {
    console.error('Erro ao adicionar drink:', err);
    res.status(500).json({ error: 'Erro ao adicionar drink' });
  }
});

// Remover 1 drink (não deixa abaixo de 0)
router.patch('/:id/remove', async (req, res) => {
  try {
    const { id } = req.params;
    const existente = await prisma.drinks.findUnique({ where: { id } });
    if (!existente) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }

    const quantidade = Math.max(0, existente.quantidade - 1);
    const comissao = calcularComissao(quantidade, existente.meta);

    const atualizado = await prisma.drinks.update({
      where: { id },
      data: { quantidade, comissao }
    });

    res.json(atualizado);
  } catch (err) {
    console.error('Erro ao remover drink:', err);
    res.status(500).json({ error: 'Erro ao remover drink' });
  }
});

// Deletar registro
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.drinks.delete({ where: { id } });
    res.json({ message: 'Registro removido com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar registro de drinks:', err);
    res.status(500).json({ error: 'Erro ao deletar registro de drinks' });
  }
});

export default router;