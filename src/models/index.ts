// @ts-nocheck
'use strict';
const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'mysql';
const defaultPort = dialect === 'postgres' ? 5432 : 3306;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || defaultPort),
    dialect,
    logging: false,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Situation = require('./Situation')(sequelize, Sequelize.DataTypes);
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.ProductCategory = require('./ProductCategory')(sequelize, Sequelize.DataTypes);
db.ProductSituation = require('./ProductSituation')(sequelize, Sequelize.DataTypes);
db.Product = require('./Product')(sequelize, Sequelize.DataTypes);

// Associations
db.Situation.hasMany(db.User, { foreignKey: 'situationId', as: 'users' });
db.User.belongsTo(db.Situation, { foreignKey: 'situationId', as: 'situation' });

db.ProductCategory.hasMany(db.Product, { foreignKey: 'productCategoryId', as: 'products' });
db.Product.belongsTo(db.ProductCategory, { foreignKey: 'productCategoryId', as: 'category' });

db.ProductSituation.hasMany(db.Product, { foreignKey: 'productSituationId', as: 'products' });
db.Product.belongsTo(db.ProductSituation, { foreignKey: 'productSituationId', as: 'situation' });

module.exports = db;
