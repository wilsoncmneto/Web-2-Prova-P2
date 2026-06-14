// @ts-nocheck
const { Router } = require('express');
const { Op } = require('sequelize');
const { User, Situation } = require('../models');
const PaginationService = require('../services/PaginationService');
const { hashPassword } = require('../utils/password');
const {
  normalizeText,
  normalizeEmail,
  sendValidationError,
  sanitizeUser,
  schemas,
  validateYupSchema,
} = require('../utils/validation');

const router = Router();

router.post('/novo-usuario', async (req, res) => {
  try {
    const errors = await validateYupSchema(schemas.publicUserCreate, req.body);
    if (errors.length > 0) return sendValidationError(res, errors);

    const email = normalizeEmail(req.body.email);
    const emailExists = await User.findOne({ where: { email } });

    if (emailExists) {
      return res.status(409).json({
        message: 'Ja existe um usuario cadastrado com este email.',
      });
    }

    const activeSituation = await Situation.findOne({ where: { nameSituation: 'Ativo' } });

    if (!activeSituation) {
      return res.status(404).json({ message: 'Situacao Ativo nao encontrada.' });
    }

    const user = await User.create({
      name: normalizeText(req.body.name),
      email,
      password: hashPassword(req.body.password),
      recoverPassword: null,
      situationId: activeSituation.id,
    });

    return res.status(201).json({
      message: 'Usuario criado com sucesso',
      data: sanitizeUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Erro ao criar usuario' });
  }
});

router.get('/usuarios', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { limit: lim, offset } = PaginationService.paginate(page, limit);

    const { rows, count } = await User.findAndCountAll({
      attributes: { exclude: ['password', 'recoverPassword'] },
      include: [{ model: Situation, as: 'situation' }],
      limit: lim,
      offset,
      order: [['id', 'ASC']],
    });

    return res.status(200).json(PaginationService.formatResponse(rows, count, page, lim));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao listar usuarios' });
  }
});

router.get('/usuarios-situacoes', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'recoverPassword'] },
      include: [{ model: Situation, as: 'situation' }],
      order: [['id', 'ASC']],
    });

    return res.status(200).json({
      message: 'Usuarios e situacoes recuperados com sucesso',
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao listar usuarios e situacoes' });
  }
});

router.get('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id: Number(id) },
      attributes: { exclude: ['password', 'recoverPassword'] },
      include: [{ model: Situation, as: 'situation' }],
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario nao encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar usuario' });
  }
});

router.post('/usuarios', async (req, res) => {
  try {
    const errors = await validateYupSchema(schemas.userCreate, req.body);
    if (errors.length > 0) return sendValidationError(res, errors);

    const email = normalizeEmail(req.body.email);
    const emailExists = await User.findOne({ where: { email } });

    if (emailExists) {
      return res.status(409).json({
        message: 'Ja existe um usuario cadastrado com este email.',
      });
    }

    const situation = await Situation.findByPk(Number(req.body.situationId));
    if (!situation) {
      return res.status(404).json({ message: 'Situacao informada nao existe.' });
    }

    const user = await User.create({
      name: normalizeText(req.body.name),
      email,
      password: hashPassword(req.body.password),
      recoverPassword: req.body.recoverPassword ? normalizeText(req.body.recoverPassword) : null,
      situationId: Number(req.body.situationId),
    });

    return res.status(201).json({
      message: 'Usuario criado com sucesso',
      data: sanitizeUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Erro ao criar usuario' });
  }
});

router.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id: Number(id) } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario nao encontrado' });
    }

    const errors = await validateYupSchema(schemas.userUpdate, req.body);
    if (errors.length > 0) return sendValidationError(res, errors);

    const updateData = {};

    if ('name' in req.body) updateData.name = normalizeText(req.body.name);

    if ('email' in req.body) {
      const email = normalizeEmail(req.body.email);
      const emailExists = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: Number(id) },
        },
      });

      if (emailExists) {
        return res.status(409).json({
          message: 'Ja existe outro usuario cadastrado com este email.',
        });
      }

      updateData.email = email;
    }

    if ('password' in req.body) updateData.password = hashPassword(req.body.password);
    if ('recoverPassword' in req.body) {
      updateData.recoverPassword = req.body.recoverPassword
        ? normalizeText(req.body.recoverPassword)
        : null;
    }

    if ('situationId' in req.body) {
      const situation = await Situation.findByPk(Number(req.body.situationId));
      if (!situation) {
        return res.status(404).json({ message: 'Situacao informada nao existe.' });
      }
      updateData.situationId = Number(req.body.situationId);
    }

    await user.update(updateData);

    return res.status(200).json({
      message: 'Usuario atualizado com sucesso',
      data: sanitizeUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Erro ao atualizar usuario' });
  }
});

router.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id: Number(id) } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario nao encontrado' });
    }

    await user.destroy();

    return res.status(200).json({ message: 'Usuario deletado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao deletar usuario' });
  }
});

module.exports = router;
