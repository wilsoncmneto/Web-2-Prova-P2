'use strict';

require('ts-node/register');
const { hashPassword } = require('../utils/password');

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Admin',
          email: 'admin@email.com',
          password: hashPassword('123456'),
          recoverPassword: null,
          situationId: 1,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'João Silva',
          email: 'joao@email.com',
          password: hashPassword('123456'),
          recoverPassword: null,
          situationId: 1,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Maria Souza',
          email: 'maria@email.com',
          password: hashPassword('123456'),
          recoverPassword: null,
          situationId: 2,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {
        ignoreDuplicates: true,
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      email: ['admin@email.com', 'joao@email.com', 'maria@email.com'],
    });
  },
};
