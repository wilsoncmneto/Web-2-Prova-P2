'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const categories = ['Eletrônicos', 'Roupas', 'Alimentos'];

    const [existingCategories] = await queryInterface.sequelize.query(
      'SELECT name FROM product_categories WHERE name IN (:categories)',
      { replacements: { categories } }
    );

    const existingNames = new Set(existingCategories.map((category) => category.name));
    const newCategories = categories
      .filter((name) => !existingNames.has(name))
      .map((name) => ({ name, createdAt: now, updatedAt: now }));

    if (newCategories.length > 0) {
      await queryInterface.bulkInsert('product_categories', newCategories);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('product_categories', {
      name: ['Eletrônicos', 'Roupas', 'Alimentos'],
    });
  },
};
