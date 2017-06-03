let common = require('../common/common');
let friendshipService = require('../services/friendshipService');
let responseCtrl = require('./responseController');

let instance = null;
class friendshipController {
    constructor() {
        if(!instance) {
            instance = this;
            instance.SCOPE = 'friendship';
        }
        return instance;
    }
    inviteFriend(requester, {id}) {
        return friendshipService
            .inviteFriend({personInitiatorId: requester.id, personReceiverId: id})
            .then(() => {
                return { status: 200, payload: `User with id ${id} invited`};
            })
            .catch((err) => {

            });
    }
    getFriendsList(requester) {
        return friendshipService
            .getFriendsList({personId: requester.id})
            .then((friendsList) => {
                return { status: 200, payload: friendsList };
            })
            .catch((err) => {

            });
    }
    removeFriend(requester, {id}) {
        return friendshipService
            .removeFriend({removerId: requester.id, removeeId: id})
            .then((removedFriend) => {
                return { status: 200, payload: removedFriend};
            })
            .catch((err) => {

            });
    }
    acceptFriendshipInvite(requester, {id}) {
        return friendshipService
            .acceptFriendshipInvite({personReceiverId: requester.id, personInitiatorId: id})
            .then((newFriend) => {
                return { status: 200, payload: newFriend};
            })
            .catch((err) => {

            });
    }
    rejectFriendshipInvite(requester, {id}) {
        return friendshipService
            .rejectFriendshipInvite({personReceiverId: requester.id, personInitiatorId: id})
            .then(() => {
                return { status: 200, payload: `Rejected invite from user with id ${id}`};
            })
            .catch((err) => {

            });
    }
    getInvitesList(requester) {
        return friendshipService
            .getInvites({personReceiverId: requester.id})
            .then((invites) => {
                return { status: 200, payload: invites};
            })
            .catch((err) => {
                return err;
            });
    }
    handleRequest(connection, {method, payload}) {
        let selfMethods = common.getOwnFields(this);
        if(selfMethods.indexOf(method) === -1) {
            return new responseCtrl().emitError({
                procedure: {method, scope: this.SCOPE},
                status: 400,
                payload: `Method ${method} doesn't exist in user context.`
            }, connection);
        }
        return this[method](connection.assignedUser, payload)
            .then(({status, payload}) => {
                return new responseCtrl().emitResponse({
                    procedure: {method, scope: this.SCOPE },
                    status,
                    payload,
                }, connection);
            }).catch(err => {
                return new responseCtrl().emitError({
                    procedure: {method, scope: this.SCOPE},
                    status: err.status || 400,
                    payload: err,
                }, connection);
            });
    }
}

module.exports = friendshipController;