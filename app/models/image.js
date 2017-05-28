"use strict";

let Sequelize  = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    var Image = sequelize.define('Image', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        bytes: {
            type: Sequelize.BLOB('long')
        }
    }, {
        hooks: {},
        classMethods: {}
    });

    return Image;
}