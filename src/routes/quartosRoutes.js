// routes/quartosRoutes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Criar um quarto (card)
router.post('/', async (req, res) => {
  try {
    const { nome, tempo, formaPagamento, quarto, userId } = req.body;

    if (!userId || !nome || !tempo) {
      return res.status(400).json({ error: 'Campos obrigatórios: userId, nome e tempo.' });
    }

    const novo = await prisma.quarto.create({
      data: {
        nome,
        tempo, // Ex.: '25 minutos', '40 minutos', '1 hora', 'tempo livre'
        formaPagamento: formaPagamento || null,
        quarto: quarto || null,
        valor: 0,
        observacoes: '',
        multa: 0,
        taxa: 0,
        itens: {},
        status: 'ativo',
        userId
      }
    });

    res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao criar quarto:', err);
    res.status(500).json({ error: 'Erro ao criar quarto' });
  }
});

// Listar quartos por usuário
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const lista = await prisma.quarto.findMany({
      where: { userId },
      orderBy: { criadaEm: 'desc' }
    });
    res.json(lista);
  } catch (err) {
    console.error('Erro ao listar quartos:', err);
    res.status(500).json({ error: 'Erro ao listar quartos' });
  }
});

// Finalizar quarto (encerrar)
router.patch('/:id/finalizar', async (req, res) => {
  try {
    const { id } = req.params;

    const existente = await prisma.quarto.findUnique({ where: { id } });
    if (!existente) return res.status(404).json({ error: 'Quarto não encontrado' });

    const atualizado = await prisma.quarto.update({
      where: { id },
      data: { status: 'finalizado', encerradoEm: new Date() }
    });

    res.json(atualizado);
  } catch (err) {
    console.error('Erro ao finalizar quarto:', err);
    res.status(500).json({ error: 'Erro ao finalizar quarto' });
  }
});

export default router;