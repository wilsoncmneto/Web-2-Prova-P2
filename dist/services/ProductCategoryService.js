"use strict";
// @ts-nocheck
const { ProductCategory } = require('../models');
const PaginationService = require('./PaginationService');
const ProductCategoryEntity = require('../entities/ProductCategoryEntity');
class ProductCategoryService {
    async findAll(page, limit) {
        const { limit: lim, offset } = PaginationService.paginate(page, limit);
        const { rows, count } = await ProductCategory.findAndCountAll({ limit: lim, offset, order: [['id', 'ASC']] });
        const data = rows.map((c) => new ProductCategoryEntity(c.toJSON()));
        return PaginationService.formatResponse(data, count, page, lim);
    }
    async findById(id) {
        const c = await ProductCategory.findByPk(id);
        return c ? new ProductCategoryEntity(c.toJSON()) : null;
    }
    async create(body) {
        const c = await ProductCategory.create(body);
        return new ProductCategoryEntity(c.toJSON());
    }
    async update(id, body) {
        const c = await ProductCategory.findByPk(id);
        if (!c)
            return null;
        await c.update(body);
        return new ProductCategoryEntity(c.toJSON());
    }
    async delete(id) {
        const c = await ProductCategory.findByPk(id);
        if (!c)
            return false;
        await c.destroy();
        return true;
    }
}
module.exports = new ProductCategoryService();
