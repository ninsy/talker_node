let Models  = require('../models/db');
let _  = require('lodash');
let sequelize  = require('sequelize');

let privilegeService = require('./privilegeService');

class groupChatService {
    static loggedUserChatRooms({userId}) {
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
    static chatRoomById(id) {
        return Models.GroupChat.findById(id, {
            include: [
                {
                    model: Models.GroupChatMember,
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
        }).then(chatRoom => {
            chatRoom.GroupChatMembers.forEach(member => {
                member.User = member.User.sanitize();
            });
            return chatRoom;
        })
    }
    static createChatRoom() {
        return Models.GroupChat.create();
    }
    static addMembers(groupChatId, participantPrivilegeName, ...memberIds) {
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