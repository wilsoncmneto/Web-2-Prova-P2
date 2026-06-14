// @ts-nocheck
'use strict';

const { Router } = require('express');
const crypto = require('crypto');
const { User, Situation } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');
const MailService = require('../services/MailService');
const { generateAuthToken } = require('../utils/authToken');
const { comparePassword, hashPassword } = require('../utils/password');
const {
  normalizeEmail,
  normalizeText,
  sanitizeUser,
  schemas,
  sendValidationError,
  validateYupSchema,
} = require('../utils/validation');

const router = Router();

function buildRecoverPasswordUrl(baseUrl, email, recoverPassword) {
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}email=${encodeURIComponent(email)}&key=${encodeURIComponent(
    recoverPassword
  )}`;
}

async function findUserByRecoverPassword(email, recoverPassword) {
  return User.findOne({
    where: {
      email: normalizeEmail(email),
      recoverPassword: normalizeText(recoverPassword),
    },
  });
}

router.post('/login', async (req, res) => {
  try {
    const errors = await validateYupSchema(schemas.login, req.body);
    if (errors.length > 0) return sendValidationError(res, errors);

    const email = normalizeEmail(req.body.email);

    const user = await User.findOne({
      where: { email },
      include: [{ model: Situation, as: 'situation' }],
    });

    if (!user || !comparePassword(req.body.password, user.password)) {
      return res.status(401).json({ message: 'Email ou senha invalidos.' });
    }

    const token = generateAuthToken({
      id: user.id,
      email: user.email,
    });

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao realizar login' });
  }
});

async function recoverPasswordHandler(req, res) {
  try {
    const errors = await validateYupSchema(schemas.recoverPassword, req.body);
    if (errors.length > 0) return sendValidationError(res, errors);

    const email = normalizeEmail(req.body.email);
    const urlRecoverPassword = normalizeText(req.body.urlRecoverPassword);
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario nao encontrado.' });
    }

    const recoverPassword = crypto.randomBytes(32).toString('hex');

    await user.update({ recoverPassword });

    const recoverPasswordUrl = buildRecoverPasswordUrl(urlRecoverPassword, email, recoverPassword);

    await MailService.sendRecoverPasswordEmail({
      to: email,
      name: user.name,
      recoverPasswordUrl,
    });

    return res.status(200).json({
      message: 'Email enviado, verifique sua caixa de entrada.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao recuperar senha' });
  }
}

router.post('/recuperar-senha', recoverPasswordHandler);
router.post('/recover-password', recoverPasswordHandler);

async function validateRecoverPasswordHandler(req, res) {
  try {
    const errors = await validateYupSchema(schemas.validateRecoverPassword, req.body);
    if (errors.length > 0) return sendValidationError(res, errors);

    const user = await findUserByRecoverPassword(req.body.email, req.body.recoverPassword);

    if (!user) {
      return res.status(404).json({ message: 'A chave de recuperar senha e invalida.' });
    }

    return res.status(200).json({
      message: 'A chave de recuperar senha e valida.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao validar chave de recuperacao' });
  }
}

router.post('/validar-recuperar-senha', validateRecoverPasswordHandler);
router.post('/validate-recover-password', validateRecoverPasswordHandler);

async function updatePasswordHandler(req, res) {
  try {
    const errors = await validateYupSchema(schemas.resetPassword, req.body);
    if (errors.length > 0) return sendValidationError(res, errors);

    const user = await findUserByRecoverPassword(req.body.email, req.body.recoverPassword);

    if (!user) {
      return res.status(404).json({ message: 'A chave de recuperar senha e invalida.' });
    }

    await user.update({
      password: hashPassword(req.body.password),
      recoverPassword: null,
    });

    return res.status(200).json({
      message: 'Senha atualizada com sucesso',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar senha' });
  }
}

router.put('/atualizar-senha', updatePasswordHandler);
router.put('/update-password', updatePasswordHandler);
router.post('/redefinir-senha', updatePasswordHandler);

router.get('/validar-token', authMiddleware, (req, res) => {
  return res.status(200).json({
    message: 'Token valido.',
    user: req.user,
  });
});

module.exports = router;
