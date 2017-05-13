"use strict";

import Sequelize from "sequelize";
import Models from "./db";

export default function(sequelize, DataTypes) {
    var UserToSocial = sequelize.define('UserToSocial', {
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        socialId: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, {
        hooks: {
            beforeCreate: function (message, options) {

            },
        },
        classMethods: {
            associate: function(Models) {
                UserToSocial.belongsTo(Models.User, {
                    foreignKey: 'userId',
                });
                UserToSocial.belongsTo(Models.Social, {
                    foreignKey: 'socialId',
                })
            }
        }
    });

    return UserToSocial;
}