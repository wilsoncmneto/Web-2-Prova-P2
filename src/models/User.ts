// @ts-nocheck
'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      recoverPassword: { type: DataTypes.STRING(255), allowNull: true },
      situationId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: 'users',
    }
  );

  return User;
};
