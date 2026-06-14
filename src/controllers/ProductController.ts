// @ts-nocheck
const { Router } = require('express');
const { Op } = require('sequelize');
const { Product, ProductCategory, ProductSituation } = require('../models');
const PaginationService = require('../services/PaginationService');
const slugify = require('../utils/slugify');
const {
  normalizeText,
  sendValidationError,
  schemas,
  validateYupSchema,
} = require('../utils/validation');

const router = Router();

router.get('/produtos', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { limit: lim, offset } = PaginationService.paginate(page, limit);

    const { rows, count } = await Product.findAndCountAll({
      include: [
        { model: ProductCategory, as: 'category' },
        { model: ProductSituation, as: 'situation' },
      ],
      limit: lim,
      offset,
      order: [['id', 'ASC']],
    });

    return res.status(200).json(PaginationService.formatResponse(rows, count, page, lim));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao listar produtos' });
  }
});

router.get('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id: Number(id) },
      include: [
        { model: ProductCategory, as: 'category' },
        { model: ProductSituation, as: 'situation' },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: 'Produto nao encontrado' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar produto' });
  }
});

router.post('/produtos', async (req, res) => {
  try {
    const errors = await validateYupSchema(schemas.productCreate, req.body);
    if (errors.length > 0) return sendValidationError(res, errors);

    const name = normalizeText(req.body.name);
    const slug = req.body.slug ? slugify(req.body.slug) : slugify(name);

    if (!slug) {
      return sendValidationError(res, [
        { field: 'slug', message: 'Nao foi possivel gerar um slug valido para o produto.' },
      ]);
    }

    const productExists = await Product.findOne({ where: { slug } });
    if (productExists) {
      return res.status(409).json({ message: 'Ja existe um produto cadastrado com este slug.' });
    }

    const productSituation = await ProductSituation.findByPk(Number(req.body.productSituationId));
    if (!productSituation) {
      return res.status(404).json({ message: 'Situacao de produto informada nao existe.' });
    }

    const productCategory = await ProductCategory.findByPk(Number(req.body.productCategoryId));
    if (!productCategory) {
      return res.status(404).json({ message: 'Categoria informada nao existe.' });
    }

    const product = await Product.create({
      name,
      slug,
      description: normalizeText(req.body.description),
      price: Number(req.body.price),
      productSituationId: Number(req.body.productSituationId),
      productCategoryId: Number(req.body.productCategoryId),
    });

    return res.status(201).json({
      message: 'Produto criado com sucesso',
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Erro ao criar produto' });
  }
});

router.put('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ where: { id: Number(id) } });

    if (!product) {
      return res.status(404).json({ message: 'Produto nao encontrado' });
    }

    const errors = await validateYupSchema(schemas.productUpdate, req.body);
    if (errors.length > 0) return sendValidationError(res, errors);

    const updateData = {};

    if ('name' in req.body) updateData.name = normalizeText(req.body.name);

    if ('slug' in req.body || 'name' in req.body) {
      const slug = req.body.slug ? slugify(req.body.slug) : slugify(updateData.name || product.name);

      if (!slug) {
        return sendValidationError(res, [
          { field: 'slug', message: 'Nao foi possivel gerar um slug valido para o produto.' },
        ]);
      }

      const productExists = await Product.findOne({
        where: {
          slug,
          id: { [Op.ne]: Number(id) },
        },
      });

      if (productExists) {
        return res.status(409).json({ message: 'Ja existe outro produto cadastrado com este slug.' });
      }

      updateData.slug = slug;
    }

    if ('description' in req.body) updateData.description = normalizeText(req.body.description);
    if ('price' in req.body) updateData.price = Number(req.body.price);

    if ('productSituationId' in req.body) {
      const productSituation = await ProductSituation.findByPk(Number(req.body.productSituationId));
      if (!productSituation) {
        return res.status(404).json({ message: 'Situacao de produto informada nao existe.' });
      }
      updateData.productSituationId = Number(req.body.productSituationId);
    }

    if ('productCategoryId' in req.body) {
      const productCategory = await ProductCategory.findByPk(Number(req.body.productCategoryId));
      if (!productCategory) {
        return res.status(404).json({ message: 'Categoria informada nao existe.' });
      }
      updateData.productCategoryId = Number(req.body.productCategoryId);
    }

    await product.update(updateData);

    return res.status(200).json({
      message: 'Produto atualizado com sucesso',
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Erro ao atualizar produto' });
  }
});

router.delete('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ where: { id: Number(id) } });

    if (!product) {
      return res.status(404).json({ message: 'Produto nao encontrado' });
    }

    await product.destroy();

    return res.status(200).json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao deletar produto' });
  }
});

module.exports = router;
