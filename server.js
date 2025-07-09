import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './src/routes/authRoutes.js';
import comandaRoutes from './src/routes/comandaRoutes.js';
import quartosRoutes from './src/routes/quartosRoutes.js';
import finalizadosRoutes from './src/routes/finalizadosRoutes.js';
import cardapioRoutes from './src/routes/cardapioRoutes.js';
import relatorioRoutes from './src/routes/relatorioRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/comandas', comandaRoutes);
app.use('/api/quartos', quartosRoutes);
app.use('/api/finalizados', finalizadosRoutes);
app.use('/api/produtos', cardapioRoutes);
app.use('/api/relatorios', relatorioRoutes);

// Root simples para teste
app.get('/', (req, res) => {
  res.send('Luiza Club API rodando com sucesso!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
