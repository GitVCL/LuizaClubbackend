// ✅ authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const LoginCode = require('../models/LoginCode');
const sendEmail = require('../utils/emailService');

const router = express.Router();

const codigosPossiveis = ["54684","21672","28971"];

// REGISTRO: Enviar código por e-mail
router.post('/register/send-code', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já registrado!' });
    }

    const code = codigosPossiveis[Math.floor(Math.random() * codigosPossiveis.length)];
    const hashedPassword = await bcrypt.hash(password, 10);

    await PendingUser.findOneAndUpdate(
      { email },
      { username, email, password: hashedPassword, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      { upsert: true }
    );

    await sendEmail(email, 'Código de Verificação', `Seu código de verificação: <strong>${code}</strong>`);
    res.status(200).json({ message: 'Código enviado ao e-mail!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao enviar código.' });
  }
});

// REGISTRO: Verificar código e criar conta
router.post('/register/verify-code', async (req, res) => {
  const { email, code } = req.body;

  try {
    const pending = await PendingUser.findOne({ email });
    if (!pending || pending.code !== code) {
      return res.status(400).json({ message: 'Código inválido ou expirado.' });
    }

    if (pending.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Código expirado.' });
    }

    const newUser = new User({ username: pending.username, email: pending.email, password: pending.password });
    await newUser.save();
    await PendingUser.deleteOne({ email });

    res.status(201).json({ message: 'Conta criada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao verificar código.' });
  }
});

// LOGIN: Verificar senha
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Usuário ou senha inválidos!' });
    }

    res.status(200).json({ message: 'Login válido. Código será enviado.', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Erro no login.' });
  }
});

// LOGIN: Enviar código
router.post('/login/send-code', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    const code = codigosPossiveis[Math.floor(Math.random() * codigosPossiveis.length)];
    await LoginCode.findOneAndUpdate(
      { email },
      { code, createdAt: new Date() },
      { upsert: true }
    );

    await sendEmail(email, 'Código de Login', `Seu código de login: <strong>${code}</strong>`);
    res.status(200).json({ message: 'Código de login enviado!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao enviar código.' });
  }
});

// LOGIN: Verificar código
router.post('/login/verify-code', async (req, res) => {
  const { email, code } = req.body;

  try {
    const registro = await LoginCode.findOne({ email });
    if (!registro || registro.code !== code) {
      return res.status(400).json({ message: 'Código inválido ou expirado.' });
    }

    const user = await User.findOne({ email });
    await LoginCode.deleteOne({ email });

    res.status(200).json({ message: 'Login autorizado com sucesso!', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao verificar código.' });
  }
});

module.exports = router;
