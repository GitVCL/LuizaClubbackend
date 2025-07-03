const mongoose = require('mongoose');

const ComandaSchema = new mongoose.Schema({
  nome: String,
  itens: Array,
  total: Number,
  dono: String,
  userId: String,
  status: { type: String, default: 'aberta' },
  encerradaEm: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Comanda', ComandaSchema);
