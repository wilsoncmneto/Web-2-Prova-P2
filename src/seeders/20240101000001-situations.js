'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const situations = ['Ativo', 'Inativo', 'Pendente'];

    const [existingSituations] = await queryInterface.sequelize.query(
      'SELECT "nameSituation" FROM "situations" WHERE "nameSituation" IN (:situations)',
      { replacements: { situations } }
    );

    const existingNames = new Set(existingSituations.map((situation) => situation.nameSituation));
    const newSituations = situations
      .filter((nameSituation) => !existingNames.has(nameSituation))
      .map((nameSituation) => ({ nameSituation, createdAt: now, updatedAt: now }));

    if (newSituations.length > 0) {
      await queryInterface.bulkInsert('situations', newSituations);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('situations', {
      nameSituation: ['Ativo', 'Inativo', 'Pendente'],
    });
  },
};
