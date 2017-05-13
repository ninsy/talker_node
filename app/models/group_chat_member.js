"use strict";

import Sequelize from "sequelize";
import Models from "./db";

export default function(sequelize, DataTypes) {
    var GroupChatMember = sequelize.define('GroupChatMember', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        groupChatId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        privilegeId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            /*
            defaultValue: function() {
               return Models.Privilege.find({
                   where: {
                       name: 'PARTICIPANT'
                   }
               })
            }
            */
        },
        messageOffset: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        dateJoined: {
            type: Sequelize.DATE,
        }
    }, {
        hooks: {
            // TODO: websocket notifications
            afterCreate: function (tableRow, options) {
                tableRow.dateJoined = Sequelize.NOW;
            },
            afterUpdate: function(tableRow, options) {

            },
            afterDestroy: function(tableRow, options) {

            },
        },
        classMethods: {
            associate: function(Models) {
                GroupChatMember.belongsTo(Models.User, {
                    foreignKey: 'userId',
                });
                GroupChatMember.belongsTo(Models.GroupChat, {
                    foreignKey: 'groupChatId',
                });
                GroupChatMember.belongsTo(Models.Privilege, {
                    foreignKey: 'privilegeId',
                });
            }
        }
    });

    return GroupChatMember;
}