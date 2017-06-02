"use strict";

let Sequelize = require("sequelize");
let Models = require('./db');

module.exports = function (sequelize, DataTypes) {
    var Friendship = sequelize.define('Friendship', {
        personInitiatorId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        personReceiverId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM,
            values: ['pending', 'accepted', 'rejected'],
        }
    }, {
        hooks: {},
        classMethods: {
            associate: function (Models) {
                Friendship.belongsTo(Models.User, {
                    as: 'initiator',
                    foreignKey: 'personInitiatorId',
                });
                Friendship.belongsTo(Models.User, {
                    as: 'receiver',
                    foreignKey: 'personReceiverId',
                });

            }
        }
    });

    return Friendship;
}