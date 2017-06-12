let Models  = require('../models/db');
let _  = require('lodash');
let sequelize  = require('sequelize');

class messageService {
    static newMessage({userId, groupChatId, content}) {
        return Models.Message.create({
            userId,
            groupChatId,
            content
        })
    }
    static getMessages({groupChatId}) {
        return Models.Message.findAll({
            where: {
                groupChatId,
            }
        });
    }
};

module.exports = messageService;