let Models = require('../models/db');
let _  = require('lodash');
let sequelize  = require('sequelize');

class friendshipService {
    static invieFriend({personInitiatorId, personReceiverId}) {
        return Models.Friendship.create({
            personInitiatorId,
            personReceiverId,
            status: 'pending'
        });
    }
    static getFriendsList({personInitiatorId}) {
        return Models.Friendship.findAll({
            where: {
                personInitiatorId,
                status: {
                    $or: ['pending','accepted']
                }
            }
        });
    }
    static removeFriend({personInitiatorId, personReceiverId}) {
        return Models.Friendship.update({status: 'rejected'}, {
            where: {
                personInitiatorId,
                personReceiverId,
                status: 'accepted'
            }
        });
    }
    static acceptFriendshipInvite({personInitiatorId, personReceiverId}) {
        return Models.Friendship.update({status: 'accepted'}, {
            where: {
                personInitiatorId,
                personReceiverId,
                status: 'pending',
            }
        });
    }
    static rejectFriendshipInvite({personInitiatorId, personReceiverId}) {
        return Models.Friendship.update({status: 'rejected'}, {
            where: {
                personInitiatorId,
                personReceiverId,
                status: 'pending',
            }
        });
    }
    static getInvites({personInitiatorId}) {

    };
};

module.exports = friendshipService;