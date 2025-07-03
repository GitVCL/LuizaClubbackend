const mongoose = require('mongoose');

const loginCodeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 25 }, // expira em 10 minutos
});

module.exports = mongoose.model('LoginCode', loginCodeSchema);

