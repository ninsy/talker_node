let Models = require('../models/db');
let _  = require('lodash');
let sequelize  = require('sequelize');

class friendshipService {
    static inviteFriend({personInitiatorId, personReceiverId}) {
        return Models.Friendship.create({
            personInitiatorId,
            personReceiverId,
            status: 'pending'
        });
    }
    static getFriendsList({personId}) {
        return Models.Friendship.findAll({
            where: {
                $or: {
                    personInitiatorId: personId,
                    personReceiverId: personId,
                },
                status: {
                    $or: ['pending','accepted']
                }
            }
        });
    }
    static removeFriend({removerId, removeeId}) {
        return Models.Friendship.update({status: 'rejected'}, {
            where: {
                $or: [
                    {personInitiatorId: removerId, personReceiverId: removeeId},
                    {personInitiatorId: removeeId, personReceiverId: removerId},
                ],
                status: 'accepted'
            }
        });
    }
    static acceptFriendshipInvite({personReceiverId, personInitiatorId}) {
        return Models.Friendship.update({status: 'accepted'}, {
            where: {
                personInitiatorId,
                personReceiverId,
                status: 'pending',
            }
        }).then(() => {
            return Models.User.findById(personInitiatorId);
        });
    }
    static rejectFriendshipInvite({personReceiverId, personInitiatorId}) {
        return Models.Friendship.update({status: 'rejected'}, {
            where: {
                personInitiatorId,
                personReceiverId,
                status: 'pending',
            }
        });
    }
    static getInvites({personReceiverId}) {
        return Models.Friendship.findAll({
            where: {
                personReceiverId,
                status: 'pending',
            },
            include: [
                {
                    model: Models.User,
                    where: {
                        id: Models.sequelize.col("Friendship.personInitiatorId")
                    },
                    required: true
                }
            ]
        }).then((results) => {
            return results.map(result => result.User)
        });
    };
};

module.exports = friendshipService;