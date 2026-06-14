// @ts-nocheck
'use strict';
module.exports = (sequelize, DataTypes) => {
    const ProductSituation = sequelize.define('ProductSituation', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
    }, { tableName: 'product_situations' });
    return ProductSituation;
};
