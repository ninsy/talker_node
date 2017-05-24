import Models from '../models/db';
import _ from 'lodash';
import sequelize from 'sequelize';

export default class friendshipService {
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
};