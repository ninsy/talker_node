"use strict";

import Sequelize from "sequelize";
import Models from "./db";

export default function(sequelize, DataTypes) {
    var GroupChat = sequelize.define('GroupChat', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
    }, {
        hooks: {
            afterCreate: function (tableRow, options) {

            },
            afterUpdate: function(tableRow, options) {

            },
            afterDestroy: function(tableRow, options) {

            },
        },
        classMethods: {
            associate: function(Models) {

            }
        }
    });

    return GroupChat;
}