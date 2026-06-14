"use strict";
// @ts-nocheck
class ProductCategoryEntity {
    constructor({ id, name, createdAt, updatedAt }) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
module.exports = ProductCategoryEntity;
