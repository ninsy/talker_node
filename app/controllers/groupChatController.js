let groupChatService = require('../services/groupChatService');
let messageService = require('../services/messageService');
let friendshipService = require('../services/friendshipService');
let socialGroupService = require('../services/socialGroupService');
let privilegeService = require('../services/privilegeService');

let responseCtrl = require('./responseController');
let common = require('../common/common');

/**
 * Each instance of it represents separate groupChat
 */


class groupChatController {
    constructor(creator, ...initialParticipants) {
        this.SCOPE = 'groupChat';

        this.creator = creator;
        this.participants = initialParticipants;

        this.privilegeService = new privilegeService();
        this.groupChatService = new groupChatService();

        return this.groupChatService.createChatRoom()
            .then(chatRoom => {
                return this.groupChatService.addMembers(chatRoom.id, this.privilegeService.ROLES.OWNER, this.creator.id)
                    .then(_ => {
                        return this.groupChatService.addMembers(chatRoom.id, this.privilegeService.ROLES.PARTICIPANT, ...this.participants.map(p => p.id))
                            .then(_ => chatRoom);
                    });
            })
    }
    setPrivilege() {

    }
    sendMessage() {

    }
    inviteUser() {

    }
    kickUser() {

    }
    joinChat() {

    }
    leaveChat() {

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

module.exports = groupChatController;