"use strict";
// @ts-nocheck
const { Product, ProductCategory, ProductSituation } = require('../models');
const PaginationService = require('./PaginationService');
const ProductEntity = require('../entities/ProductEntity');
class ProductService {
    async findAll(page, limit) {
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
        const data = rows.map((p) => new ProductEntity(p.toJSON()));
        return PaginationService.formatResponse(data, count, page, lim);
    }
    async findById(id) {
        const product = await Product.findByPk(id, {
            include: [
                { model: ProductCategory, as: 'category' },
                { model: ProductSituation, as: 'situation' },
            ],
        });
        if (!product)
            return null;
        return new ProductEntity(product.toJSON());
    }
    async create(body) {
        const product = await Product.create(body);
        return new ProductEntity(product.toJSON());
    }
    async update(id, body) {
        const product = await Product.findByPk(id);
        if (!product)
            return null;
        await product.update(body);
        return new ProductEntity(product.toJSON());
    }
    async delete(id) {
        const product = await Product.findByPk(id);
        if (!product)
            return false;
        await product.destroy();
        return true;
    }
}
module.exports = new ProductService();
