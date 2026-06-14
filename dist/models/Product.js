// @ts-nocheck
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
        slug: { type: DataTypes.STRING(255), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        productSituationId: { type: DataTypes.INTEGER, allowNull: false },
        productCategoryId: { type: DataTypes.INTEGER, allowNull: false },
    }, {
        tableName: 'products',
    });
    return Product;
};
