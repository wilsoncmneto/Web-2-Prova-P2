"use strict";
// @ts-nocheck
const { Router } = require('express');
const { Op } = require('sequelize');
const { ProductSituation } = require('../models');
const PaginationService = require('../services/PaginationService');
const { normalizeText, sendValidationError, schemas, validateYupSchema, } = require('../utils/validation');
const router = Router();
router.get('/situacoes-produto', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { limit: lim, offset } = PaginationService.paginate(page, limit);
        const { rows, count } = await ProductSituation.findAndCountAll({
            limit: lim,
            offset,
            order: [['id', 'ASC']],
        });
        return res.status(200).json(PaginationService.formatResponse(rows, count, page, lim));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao listar situacoes de produto' });
    }
});
router.get('/situacoes-produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const productSituation = await ProductSituation.findOne({ where: { id: Number(id) } });
        if (!productSituation) {
            return res.status(404).json({ message: 'Situacao de produto nao encontrada' });
        }
        return res.status(200).json(productSituation);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar situacao de produto' });
    }
});
router.post('/situacoes-produto', async (req, res) => {
    try {
        const errors = await validateYupSchema(schemas.nameCreate, req.body);
        if (errors.length > 0)
            return sendValidationError(res, errors);
        const name = normalizeText(req.body.name);
        const productSituationExists = await ProductSituation.findOne({ where: { name } });
        if (productSituationExists) {
            return res.status(409).json({ message: 'Ja existe uma situacao de produto cadastrada com este nome.' });
        }
        const productSituation = await ProductSituation.create({ name });
        return res.status(201).json({
            message: 'Situacao de produto criada com sucesso',
            data: productSituation,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Erro ao criar situacao de produto' });
    }
});
router.put('/situacoes-produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const productSituation = await ProductSituation.findOne({ where: { id: Number(id) } });
        if (!productSituation) {
            return res.status(404).json({ message: 'Situacao de produto nao encontrada' });
        }
        const errors = await validateYupSchema(schemas.nameUpdate, req.body);
        if (errors.length > 0)
            return sendValidationError(res, errors);
        const updateData = {};
        if ('name' in req.body) {
            const name = normalizeText(req.body.name);
            const productSituationExists = await ProductSituation.findOne({
                where: {
                    name,
                    id: { [Op.ne]: Number(id) },
                },
            });
            if (productSituationExists) {
                return res.status(409).json({ message: 'Ja existe outra situacao de produto cadastrada com este nome.' });
            }
            updateData.name = name;
        }
        await productSituation.update(updateData);
        return res.status(200).json({
            message: 'Situacao de produto atualizada com sucesso',
            data: productSituation,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Erro ao atualizar situacao de produto' });
    }
});
router.delete('/situacoes-produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const productSituation = await ProductSituation.findOne({ where: { id: Number(id) } });
        if (!productSituation) {
            return res.status(404).json({ message: 'Situacao de produto nao encontrada' });
        }
        await productSituation.destroy();
        return res.status(200).json({ message: 'Situacao de produto deletada com sucesso' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao deletar situacao de produto' });
    }
});
module.exports = router;
