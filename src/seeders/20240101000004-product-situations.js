'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const situations = ['Disponível', 'Esgotado', 'Descontinuado'];

    const [existingSituations] = await queryInterface.sequelize.query(
      'SELECT name FROM product_situations WHERE name IN (:situations)',
      { replacements: { situations } }
    );

    const existingNames = new Set(existingSituations.map((situation) => situation.name));
    const newSituations = situations
      .filter((name) => !existingNames.has(name))
      .map((name) => ({ name, createdAt: now, updatedAt: now }));

    if (newSituations.length > 0) {
      await queryInterface.bulkInsert('product_situations', newSituations);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('product_situations', {
      name: ['Disponível', 'Esgotado', 'Descontinuado'],
    });
  },
};
