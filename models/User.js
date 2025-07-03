const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  // Tempos de sessão atuais
  studyTime: { type: Number, default: 0 },
  devTime: { type: Number, default: 0 },

  // Totais acumulados
  totalStudyTime: { type: Number, default: 0 },
  totalDevTime: { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
