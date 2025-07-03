const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  valor: { type: Number, required: true },
  unidades: { type: Number, required: true },
  variantes: { type: [String], default: [] }
});

module.exports = mongoose.model('Produto', ProdutoSchema);
