"use strict";

let Sequelize  = require("sequelize");
let Models  = require("./db");

module.exports = function(sequelize, DataTypes) {
    var UserToSocial = sequelize.define('UserToSocial', {
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        socialId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        status: {
            type:   Sequelize.ENUM,
            values: ['pending', 'accepted', 'rejected'],
        }
    }, {
        hooks: {
            beforeCreate: function (message, options) {

            },
        },
        classMethods: {
            associate: function(models) {
                UserToSocial.belongsTo(models.User, {
                    foreignKey: 'userId',
                });
                UserToSocial.belongsTo(models.Social, {
                    foreignKey: 'socialId',
                })
            }
        }
    });

    return UserToSocial;
}