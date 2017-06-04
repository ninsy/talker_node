let Models  = require('../models/db');
let _  = require('lodash');
let sequelize  = require('sequelize');

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
                    }
                }
            ],
        });
    }
    createChatRoom() {
        return Models.GroupChat.create();
    }
    addMembers(groupChatId, participantPrivilegeId, ...memberIds) {
        let promiseArr = memberIds.map(memberId => Models.GroupChatMember.create({
            groupChatId,
            privilegeId: participantPrivilegeId,
            userId: memberId,
        }));
        return Promise.all(promiseArr);
    }
}

module.exports = groupChatService;