// @ts-nocheck
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Situation = sequelize.define('Situation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nameSituation: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
        tableName: 'situations',
    });
    return Situation;
};
