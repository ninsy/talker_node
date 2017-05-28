"use strict";

let Sequelize  = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    var Social = sequelize.define('Social', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, {
        hooks: {
            beforeCreate: function (message, options) {

            },
        },
        classMethods: {
            // associate: function(models) {
            //     User.hasMany(models.UserChosenDelivery);
            // }
        }
    });

    return Social;
}