// models/PendingUser.js
const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  code: String, // renomeado para combinar com o backend
  expiresAt: Date // usado na lógica do authRoutes
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);
