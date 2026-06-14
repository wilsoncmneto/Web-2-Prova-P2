'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const products = [
      {
        name: 'Smartphone X',
        slug: 'smartphone-x',
        description: 'Smartphone com tela grande e bom desempenho.',
        price: 1999.90,
        productSituationId: 1,
        productCategoryId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Notebook Pro',
        slug: 'notebook-pro',
        description: 'Notebook para estudos, trabalho e programação.',
        price: 4599.90,
        productSituationId: 1,
        productCategoryId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Camiseta Básica',
        slug: 'camiseta-basica',
        description: 'Camiseta básica de algodão.',
        price: 49.90,
        productSituationId: 2,
        productCategoryId: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Arroz Integral',
        slug: 'arroz-integral',
        description: 'Pacote de arroz integral.',
        price: 21.90,
        productSituationId: 1,
        productCategoryId: 3,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const slugs = products.map((product) => product.slug);
    const [existingProducts] = await queryInterface.sequelize.query(
      'SELECT slug FROM products WHERE slug IN (:slugs)',
      { replacements: { slugs } }
    );

    const existingSlugs = new Set(existingProducts.map((product) => product.slug));
    const newProducts = products.filter((product) => !existingSlugs.has(product.slug));

    if (newProducts.length > 0) {
      await queryInterface.bulkInsert('products', newProducts);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', {
      slug: ['smartphone-x', 'notebook-pro', 'camiseta-basica', 'arroz-integral'],
    });
  },
};
