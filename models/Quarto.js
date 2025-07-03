const mongoose = require('mongoose');

const QuartoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  nome: { type: String, required: true },
  total: { type: Number, default: 0 },
  itens: [
  {
    descricao: String,
    qtd: Number,
    valorUnit: Number,
    hora: String, // <- Aqui está o campo que estava faltando
  }
]

}, { timestamps: true });

module.exports = mongoose.model('Quarto', QuartoSchema);
