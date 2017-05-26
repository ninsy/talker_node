"use strict";

let Sequelize  = require("sequelize");

module.exports = function(sequelize, DataTypes) {

    var Privilege = sequelize.define('Privilege', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        name: {
            type: Sequelize.STRING,
        },
        canRead: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        canWrite: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        canExecute: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
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
    return Privilege;
}