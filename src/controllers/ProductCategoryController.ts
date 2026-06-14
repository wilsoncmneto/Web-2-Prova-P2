// @ts-nocheck
const { Router } = require('express');
const { Op } = require('sequelize');
const { ProductCategory } = require('../models');
const PaginationService = require('../services/PaginationService');
const {
  normalizeText,
  sendValidationError,
  schemas,
  validateYupSchema,
} = require('../utils/validation');

const router = Router();

router.get('/categorias', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { limit: lim, offset } = PaginationService.paginate(page, limit);

    const { rows, count } = await ProductCategory.findAndCountAll({
      limit: lim,
      offset,
      order: [['id', 'ASC']],
    });

    return res.status(200).json(PaginationService.formatResponse(rows, count, page, lim));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao listar categorias' });
  }
});

router.get('/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ProductCategory.findOne({ where: { id: Number(id) } });

    if (!category) {
      return res.status(404).json({ message: 'Categoria nao encontrada' });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar categoria' });
  }
});

router.post('/categorias', async (req, res) => {
  try {
    const errors = await validateYupSchema(schemas.nameCreate, req.body);
    if (errors.length > 0) return sendValidationError(res, errors);

    const name = normalizeText(req.body.name);

    const categoryExists = await ProductCategory.findOne({ where: { name } });
    if (categoryExists) {
      return res.status(409).json({ message: 'Ja existe uma categoria cadastrada com este nome.' });
    }

    const category = await ProductCategory.create({ name });

    return res.status(201).json({
      message: 'Categoria criada com sucesso',
      data: category,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Erro ao criar categoria' });
  }
});

router.put('/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ProductCategory.findOne({ where: { id: Number(id) } });

    if (!category) {
      return res.status(404).json({ message: 'Categoria nao encontrada' });
    }

    const errors = await validateYupSchema(schemas.nameUpdate, req.body);
    if (errors.length > 0) return sendValidationError(res, errors);

    const updateData = {};

    if ('name' in req.body) {
      const name = normalizeText(req.body.name);

      const categoryExists = await ProductCategory.findOne({
        where: {
          name,
          id: { [Op.ne]: Number(id) },
        },
      });

      if (categoryExists) {
        return res.status(409).json({ message: 'Ja existe outra categoria cadastrada com este nome.' });
      }

      updateData.name = name;
    }

    await category.update(updateData);

    return res.status(200).json({
      message: 'Categoria atualizada com sucesso',
      data: category,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Erro ao atualizar categoria' });
  }
});

router.delete('/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ProductCategory.findOne({ where: { id: Number(id) } });

    if (!category) {
      return res.status(404).json({ message: 'Categoria nao encontrada' });
    }

    await category.destroy();

    return res.status(200).json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao deletar categoria' });
  }
});

module.exports = router;
