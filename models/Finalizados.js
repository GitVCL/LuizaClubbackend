// models/Finalizado.js
const mongoose = require('mongoose');

const FinalizadoSchema = new mongoose.Schema({
  nome: String,
  itens: Array,
  total: Number,
  dono: String,
  tipo: String, // precisa existir
  userId: String,
}, { timestamps: true }); // 👈 ESSA LINHA É FUNDAMENTAL

module.exports = mongoose.model('Finalizado', FinalizadoSchema);
