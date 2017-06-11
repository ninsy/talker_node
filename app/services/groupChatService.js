let Models  = require('../models/db');
let _  = require('lodash');
let sequelize  = require('sequelize');

let privilegeService = require('./privilegeService');

let instance = null;
class groupChatService {
    constructor() {
        if(!instance) {
            instance = this;
        }
        return instance;
    }
    loggedUserChatRooms({userId}) {
        return Models.GroupChat.findAll({
            include: [
                {
                    model: Models.GroupChatMember,
                    where: {
                        userId
                    },
                    include: [Models.User, Models.Privilege],
                },
                {
                    model: Models.Message,
                    where: {
                        groupChatId: Models.sequelize.col("GroupChat.id")
                    },
                    required: false,
                }
            ],
        }).then(chatRooms => {
            chatRooms.forEach(room => {
                room.GroupChatMembers.forEach(member => {
                    member.User = member.User.sanitize();
                });
            });
            return chatRooms;
        })
    }
    createChatRoom() {
        return Models.GroupChat.create();
    }
    addMembers(groupChatId, participantPrivilegeName, ...memberIds) {
        return new privilegeService().getRole(participantPrivilegeName)
            .then(privilege => {
                let promiseArr = memberIds.map(memberId => Models.GroupChatMember.create({
                    groupChatId,
                    privilegeId: privilege.id,
                    userId: memberId,
                }));
                return Promise.all(promiseArr);
            });
    }
}

module.exports = groupChatService;