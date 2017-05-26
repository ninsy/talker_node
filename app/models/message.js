"use strict";

let Sequelize  = require("sequelize");
let Models  = require("./db");

module.exports = function(sequelize, DataTypes) {
    var Message = sequelize.define('Message', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        userId: {
            type: Sequelize.INTEGER,
        },
        groupChatId: {
            type: Sequelize.INTEGER,
        },
        imageId: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        content: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        dateCreated: {
            type: Sequelize.DATE,
        },
    }, {
        hooks: {
            beforeCreate: function (message, options) {
                message.dateCreated = Sequelize.NOW;
            },
        },
        classMethods: {
            associate: function(Models) {
                Message.belongsTo(Models.User, {
                    foreignKey: 'userId',
                });
                Message.belongsTo(Models.GroupChat, {
                    foreignKey: 'groupChatId',
                });
                Message.belongsTo(Models.Image, {
                    foreignKey: 'imageId',
                })
            }
        }
    });

    return Message;
}