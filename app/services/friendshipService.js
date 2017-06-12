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

        let promieArr = [
            Models.Friendship.findAll({
                where: {
                    status: 'accepted',
                    $or: {
                        personInitiatorId: personId,
                        personReceiverId: personId,
                    }
                },
            }),
            Models.User.findAll({
                where: {
                    $not: {
                        id: personId
                    }
                }
            })
        ];

        return Promise.all(promieArr)
            .then(results => {

                let folks = [];
                let [ friendShips, users] = results;
                friendShips.forEach(friendShip => {
                    let person = users.find(u => u.id === friendShip.personReceiverId || u.id === friendShip.personInitiatorId);
                    if(person) {
                        folks.push(person);
                    }
                });
                return folks;
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
        return Models.User.findAll({
            where: {
                id: {
                    $not: personReceiverId,
                },
            },
            include: [
                {
                    model: Models.Friendship,
                    as: 'initiator',
                    where: {
                        personInitiatorId: Models.sequelize.col("User.id"),
                        status: 'pending'
                    },
                    required: true,
                }
            ]
        });
    };
};

module.exports = friendshipService;