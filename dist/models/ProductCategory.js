// @ts-nocheck
'use strict';
module.exports = (sequelize, DataTypes) => {
    const ProductCategory = sequelize.define('ProductCategory', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
    }, { tableName: 'product_categories' });
    return ProductCategory;
};
