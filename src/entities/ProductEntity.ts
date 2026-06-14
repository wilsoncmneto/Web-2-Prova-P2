// @ts-nocheck
class ProductEntity {
  constructor({ id, name, slug, description, price, productSituationId, productCategoryId, situation, category, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.price = price;
    this.productSituationId = productSituationId;
    this.productCategoryId = productCategoryId;
    this.situation = situation || null;
    this.category = category || null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = ProductEntity;
