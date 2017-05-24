"use strict";

import Sequelize from "sequelize";
import Models from './db';

export default function(sequelize, DataTypes) {
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
            type: Sequelize.ENUM('pending', 'accepted', 'rejected')
        }
    }, {
        hooks: {

        },
        classMethods: {
            associate: function(Models) {
                Friendship.belongsTo(Models.User, {
                    foreignKey: 'personInitiatorId',
                });
                Friendship.belongsTo(Models.User, {
                    foreignKey: 'personReceiverId',
                });
            }
        }
    });

    return Friendship;
}