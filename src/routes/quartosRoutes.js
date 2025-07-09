// routes/quartosRoutes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Criar novo quarto
router.post('/', async (req, res) => {
  try {
    const { nome, tempo, valor, observacoes, multa, taxa, itens, userId } = req.body;

   const novoQuarto = await prisma.quarto.create({
  data: {
    nome,
    tempo,
    valor,
    observacoes,
    multa,
    taxa,
    itens, // ← salva como JSON
    userId,
    status: 'ativo' // ← ISSO FALTAVA
  }
});

    res.status(201).json(novoQuarto);
  } catch (err) {
    console.error('Erro detalhado ao criar quarto:', err);
    res.status(500).json({ error: 'Erro ao criar quarto' });
  }
});

// Buscar quartos ativos de um usuário
// Buscar quartos ativos de um usuário
router.get('/:userId', async (req, res) => {
  try {
    const quartos = await prisma.quarto.findMany({
      where: {
        userId: req.params.userId,
        status: 'ativo'
      },
      orderBy: { criadaEm: 'desc' } // opcional
    });
    res.json(quartos);
  } catch (err) {
    console.error('Erro ao buscar quartos:', err);
    res.status(500).json({ error: 'Erro ao buscar quartos' });
  }
});

// Atualizar quarto (itens, valor, dono...)
// Atualizar quarto
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await prisma.quarto.update({
      where: { id: req.params.id },
      data: {
        nome: req.body.nome,
        tempo: req.body.tempo,
        valor: req.body.valorTotal,
        observacoes: req.body.observacao,
        multa: req.body.multa,
        taxa: req.body.taxa,
        status: req.body.status,
        itens: req.body.itens
      }
    });
    res.json(atualizado);
  } catch (err) {
    console.error('Erro ao atualizar quarto:', err);
    res.status(500).json({ error: 'Erro ao atualizar quarto' });
  }
});


// Excluir quarto e seus itens
router.delete('/:id', async (req, res) => {
  try {
    await prisma.quarto.delete({ where: { id: req.params.id } });
    res.json({ message: 'Quarto excluído' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir quarto' });
  }
});

export default router;
