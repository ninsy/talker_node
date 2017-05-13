"use strict";

import Sequelize from "sequelize";

export default function(sequelize, DataTypes) {
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