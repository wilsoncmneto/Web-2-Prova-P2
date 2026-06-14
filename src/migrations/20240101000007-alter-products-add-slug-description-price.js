'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'slug', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: 'produto-sem-slug',
    });
	
    await queryInterface.addColumn('products', 'description', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    });

    await queryInterface.addColumn('products', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'price');
    await queryInterface.removeColumn('products', 'description');
    await queryInterface.removeColumn('products', 'slug');
  },
};
