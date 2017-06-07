let Models = require('../models/db');
let _ = require('lodash');
let sequelize = require('sequelize');

class socialGroupService {
    static invite(socialId, ...personReceiverIds) {
        let invitePromiseArr = personReceiverIds.map((userId) => Models.UserToSocial.create({where: {socialId, userId}}));
        return Promise.all(invitePromiseArr).then(() => {
            personReceiverIds.forEach((userId) => {
               // NotificationService.notify('actionName', userId);
            });
        })

    }
    static getSocialGroupList({personInitiatorId}) {
        return Models.Friendship.findAll({
            where: {
                personInitiatorId,
                status: {
                    $or: ['pending','accepted']
                }
            }
        });
    }
    static getSocialGroupMemberList({socialGroupId}) {

    }
    static removeMember(personInitiatorId, ...personReceiverIds) {
        return Models.Friendship.update({status: 'rejected'}, {
            where: {
                personInitiatorId,
                personReceiverId,
                status: 'accepted'
            }
        });
    }
    static acceptGroupInvite({personInitiatorId, personReceiverId}) {
        return Models.Friendship.update({status: 'accepted'}, {
            where: {
                personInitiatorId,
                personReceiverId,
                status: 'pending',
            }
        });
    }
    static rejectGroupInvite({personInitiatorId, personReceiverId}) {
        return Models.Friendship.update({status: 'rejected'}, {
            where: {
                personInitiatorId,
                personReceiverId,
                status: 'pending',
            }
        });
    }
};

module.exports = socialGroupService;