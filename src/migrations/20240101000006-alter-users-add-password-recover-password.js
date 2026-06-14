'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'password', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: '123456',
    });

    await queryInterface.addColumn('users', 'recoverPassword', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'recoverPassword');
    await queryInterface.removeColumn('users', 'password');
  },
};
