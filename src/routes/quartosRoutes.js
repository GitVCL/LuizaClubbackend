// routes/quartosRoutes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Log básico para verificar que as rotas estão sendo atingidas
router.use((req, res, next) => {
  console.log('[quartosRoutes]', req.method, req.originalUrl);
  next();
});

function valorPorTempo(tempo) {
  switch (tempo) {
    case '1 hora': return 100;
    case '1 hora gringo': return 150;
    case 'pernoite': return 300;
    case '25 minutos':
    case '40 minutos': return 50;
    default: return 0;
  }
}

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
      data: { status: 'finalizado', encerradoEm: new Date(), valor: valorPorTempo(existente.tempo) }
    });

    res.json(atualizado);
  } catch (err) {
    console.error('Erro ao finalizar quarto:', err);
    res.status(500).json({ error: 'Erro ao finalizar quarto' });
  }
});

// Cancelar quarto finalizado (zera faturamento)
router.patch('/:id/cancelar', async (req, res) => {
  try {
    const { id } = req.params;
    const idTrim = typeof id === 'string' ? id.trim() : id;
    console.log('[PATCH cancelar] recebida', { id: idTrim });

    // Localiza de forma robusta (similar ao DELETE):
    const existente = await prisma.quarto.findUnique({ where: { id: idTrim } });

    if (!existente) return res.status(404).json({ error: 'Quarto não encontrado' });
    if (existente.status !== 'finalizado') {
      return res.status(400).json({ error: 'Apenas quartos finalizados podem ser cancelados.' });
    }

    const novaObs = `${(existente.observacoes || '').trim()} cancelado`.trim();
    const atualizado = await prisma.quarto.update({
      where: { id: existente.id },
      data: { valor: 0, observacoes: novaObs }
    });

    res.json({ message: 'Quarto cancelado (faturamento zerado)', quarto: atualizado });
  } catch (err) {
    console.error('Erro ao cancelar quarto:', err);
    res.status(500).json({ error: 'Erro ao cancelar quarto' });
  }
});

// Excluir quarto (cancelar hospedagem)
router.delete('/:id', async (req, res) => {
  try {
    let { id } = req.params;
    id = typeof id === 'string' ? id.trim() : id;
    const { userId, quarto } = req.query;
    console.log('[DELETE /api/quartos/:id] recebida', { id, userId, quarto });

    // Tenta localizar o quarto de forma robusta:
    // 1) Se userId vier, usa findFirst com ambos para evitar contexto errado
    // 2) Senão, tenta findUnique apenas por id
    // 3) Se ainda não achar e vier "quarto" (número/nome do quarto), tenta por ele
    let existente = null;
    if (userId) {
      existente = await prisma.quarto.findFirst({ where: { id, userId } });
    }
    if (!existente && id) {
      existente = await prisma.quarto.findUnique({ where: { id } });
    }
    if (!existente && quarto && userId) {
      existente = await prisma.quarto.findFirst({ where: { quarto: String(quarto), userId } });
    }

    if (!existente) {
      console.warn('Quarto não encontrado para critérios', { id, userId, quarto });
      return res.status(404).json({ error: 'Quarto não encontrado' });
    }

    // Não permitir excluir quartos ativos
    if (existente.status === 'ativo') {
      console.warn('Tentativa de excluir quarto ativo', existente.id);
      return res.status(400).json({ error: 'Não é permitido excluir quarto ativo. Finalize primeiro.' });
    }

    await prisma.quarto.delete({ where: { id: existente.id } });
    console.log('Quarto excluído com sucesso:', existente.id);
    res.json({ message: 'Quarto excluído com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir quarto:', err);
    res.status(500).json({ error: 'Erro ao excluir quarto' });
  }
});

export default router;
