// routes/comandaRoutes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { gerarComandaPDF } from '../../utils/pdfService.js';

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

// Buscar comandas de um usuário com filtros opcionais
// Query params: status, dataInicio, dataFim, nome
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, dataInicio, dataFim, nome } = req.query;

    const where = { userId };

    if (status) {
      where.status = status;
    }

    if (status === 'finalizada' && (dataInicio || dataFim)) {
      where.encerradaEm = {};
      if (dataInicio) {
        where.encerradaEm.gte = new Date(`${dataInicio}T00:00:00`);
      }
      if (dataFim) {
        where.encerradaEm.lte = new Date(`${dataFim}T23:59:59`);
      }
    }

    if (nome && nome.trim()) {
      const busca = nome.trim().toLowerCase();
      where.OR = [
        { dono: { contains: busca, mode: 'insensitive' } },
        { nome: { contains: busca, mode: 'insensitive' } }
      ];
    }

    const orderBy = status === 'finalizada'
      ? { encerradaEm: 'desc' }
      : { criadaEm: 'desc' };

    const lista = await prisma.comanda.findMany({ where, orderBy });
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

// 🖨️ IMPRIMIR COMANDA EM PDF
router.get('/pdf/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const comanda = await prisma.comanda.findUnique({
      where: { id }
    });

    if (!comanda) {
      return res.status(404).json({ error: 'Comanda não encontrada' });
    }

    const pdfBuffer = await gerarComandaPDF(comanda);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="comanda-${comanda.nome}-${id}.pdf"`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error('Erro ao gerar PDF:', err);
    res.status(500).json({ error: 'Erro ao gerar PDF da comanda' });
  }
});

export default router;
