const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const progressRoutes = require('./routes/progressRoutes');
const timeRoutes = require('./routes/timeRoutes');
const comandaRoutes = require('./routes/comandaRoutes'); // ✅ aqui
const quartoRoutes = require('./routes/quartoRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const finalizadosRoutes = require('./routes/finalizadosRoutes');


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/quartos', quartoRoutes);
app.use('/api/time', timeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/comandas', comandaRoutes); // ✅ aqui
app.use('/api/produtos', produtoRoutes);
app.use('/api/finalizados', finalizadosRoutes);




const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB');
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => console.error('❌ Erro ao conectar no MongoDB:', err));
