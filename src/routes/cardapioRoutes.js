// routes/cardapioRoutes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Criar novo produto
router.post('/', async (req, res) => {
  try {
    const { nome, valor, unidades, variantes, comissionado, userId } = req.body;

    const novo = await prisma.produto.create({
      data: {
        nome,
        valor,
        unidades,
        variantes,
        comissionado: !!comissionado,
        userId
      }
    });

    res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});
// Buscar todos os produtos
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    console.log('Recebida requisição GET /api/produtos com userId:', userId);
    const filter = userId ? { where: { userId: String(userId) } } : {};
    const lista = await prisma.produto.findMany(filter);
    console.log('Produtos encontrados:', lista.length);
    res.json(lista);
  } catch (err) {
    console.error('ERRO NO BACKEND AO BUSCAR PRODUTOS:', err);
    res.status(500).json({ 
      error: 'Erro ao buscar produtos', 
      details: err.message || 'Sem mensagem de erro'
    });
  }
});

// Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, valor, unidades, variantes, comissionado } = req.body;

    const atualizado = await prisma.produto.update({
      where: { id },
      data: {
        nome,
        valor: parseFloat(valor),
        unidades: parseInt(unidades),
        variantes,
        comissionado: !!comissionado
      }
    });

    res.json(atualizado);
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// Deletar um produto
router.delete('/:id', async (req, res) => {
  try {
      const id = req.params.id;
    await prisma.produto.delete({ where: { id } });
    res.json({ message: 'Produto excluído com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir produto' });
  }
});

export default router;
