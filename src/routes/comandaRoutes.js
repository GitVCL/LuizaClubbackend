// routes/comandaRoutes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Criar comanda
router.post('/', async (req, res) => {
  try {
    const { nome, dono, total, status, userId, itens } = req.body;

    const novaComanda = await prisma.comanda.create({
      data: {
        nome,
        dono,
        total,
        status,
        userId,
        criadaEm: new Date(),
        itens // ← salva diretamente o JSON (sem relação com tabela)
      }
    });

    res.status(201).json(novaComanda);
  } catch (err) {
    console.error('Erro detalhado ao criar comanda:', err);
    res.status(500).json({ error: err.message });
  }
});

// Buscar comandas de um usuário
router.get('/:userId', async (req, res) => {
  try {
    const lista = await prisma.comanda.findMany({
      where: { userId: req.params.userId },
      orderBy: { criadaEm: 'desc' } // organiza da mais nova para a mais antiga
    });
    res.json(lista);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar comandas' });
  }
});

// Atualizar comanda (substitui os itens JSON)
// Atualizar comanda (encerrar, etc)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, itens, total, dono, status, encerradaEm } = req.body;

    const comandaAtualizada = await prisma.comanda.update({
      where: { id },
      data: {
        nome,
        itens,
        total,
        dono,
        status,
        encerradaEm, // <-- ESSENCIAL
      }
    });

    res.json(comandaAtualizada);
  } catch (err) {
    console.error('Erro ao atualizar comanda:', err);
    res.status(500).json({ error: 'Erro ao atualizar comanda' });
  }
});


// Deletar comanda
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.comanda.delete({ where: { id } });
    res.json({ message: 'Comanda deletada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar comanda' });
  }
});

export default router;
