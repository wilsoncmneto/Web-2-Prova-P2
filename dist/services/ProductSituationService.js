"use strict";
// @ts-nocheck
const { ProductSituation } = require('../models');
const PaginationService = require('./PaginationService');
const ProductSituationEntity = require('../entities/ProductSituationEntity');
class ProductSituationService {
    async findAll(page, limit) {
        const { limit: lim, offset } = PaginationService.paginate(page, limit);
        const { rows, count } = await ProductSituation.findAndCountAll({ limit: lim, offset, order: [['id', 'ASC']] });
        const data = rows.map((s) => new ProductSituationEntity(s.toJSON()));
        return PaginationService.formatResponse(data, count, page, lim);
    }
    async findById(id) {
        const s = await ProductSituation.findByPk(id);
        return s ? new ProductSituationEntity(s.toJSON()) : null;
    }
    async create(body) {
        const s = await ProductSituation.create(body);
        return new ProductSituationEntity(s.toJSON());
    }
    async update(id, body) {
        const s = await ProductSituation.findByPk(id);
        if (!s)
            return null;
        await s.update(body);
        return new ProductSituationEntity(s.toJSON());
    }
    async delete(id) {
        const s = await ProductSituation.findByPk(id);
        if (!s)
            return false;
        await s.destroy();
        return true;
    }
}
module.exports = new ProductSituationService();
