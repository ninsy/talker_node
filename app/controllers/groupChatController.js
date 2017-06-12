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
    constructor(existingChat, creator, ...initialParticipants) {
        this.SCOPE = 'groupChat';

        if(existingChat) {
            this.creator = existingChat.GroupChatMembers.find(member => member.Privilege.name === 'OWNER' );
            this.participants = existingChat.GroupChatMembers.filter(member => member.Privilege.name !== 'OWNER');
            this.room = existingChat;
        } else {
            this.creator = creator;
            this.participants = initialParticipants;
        }

        this.privilegeService = new privilegeService();
        this.responseCtrl = new responseCtrl();

    }
    init() {
        return groupChatService.createChatRoom()
            .then(chatRoom => {
                this.room = chatRoom;
                return groupChatService.addMembers(this.room.id, Object.keys(this.privilegeService.ROLES).find(n => n === 'OWNER'), this.creator.id)
                    .then(_ => {
                        if(this.participants.length) {
                            return groupChatService.addMembers(this.room.id, Object.keys(this.privilegeService.ROLES).find(n => n === 'PARTICIPANT'), ...this.participants)
                                .then(_ => {

                                    let members = [];
                                    members.push(...this.participants);
                                    members.push(this.creator.id);

                                    let emitObj = Object.assign({}, this.room.dataValues);
                                    emitObj.members = members;

                                    this.responseCtrl.emitResponseByUsedIds({
                                        procedure: {
                                            scope: this.SCOPE,
                                            method: 'chatJoinRequest',
                                        },
                                        status: 200,
                                        payload: emitObj,
                                    }, ...this.participants);
                                    return this;
                                });
                        }
                        else return this;
                    });
            })
    }
    inviteUser(_, {invitees}) {
        return groupChatService
            .addMembers(this.room.id,
                Object.keys(this.privilegeService.ROLES).find(n => n === 'PARTICIPANT'),
            ...invitees)
            .then(_ => groupChatService.chatRoomById(this.room.id))
            .then(room => {
                this.room = room;
                this.participants = this.room.GroupChatMembers.map(member => member.User.id).filter(id => id !== this.creator.id);
                this.responseCtrl.emitResponseByUsedIds({
                    procedure: {
                        scope: this.SCOPE,
                        method: 'chatJoinRequest',
                    },
                    status: 200,
                    payload: this.room,
                }, ...invitees);
                return {
                    status: 200,
                    payload: this.room
                }
            });
    }
    newMessage(requester, payload) {
        return messageService
            .newMessage({userId: requester.id, groupChatId: this.room.id, content: payload.content })
            .then(msg => {
                let targets = [...this.participants, this.creator.id].filter(id => id !== requester.id);
                this.responseCtrl.emitResponseByUsedIds({
                    procedure: {
                        scope: this.SCOPE,
                        method: 'newMessage',
                    },
                    status: 201,
                    payload: msg,
                }, ...targets);
                return {
                    status: 201,
                    payload: msg
                }
            });
    }
    setPrivilege() {

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
    buildChatRoomResponseObject() {
        let members = [];
        members.push(...this.participants);
        members.push(this.creator.id);

        let emitObj = Object.assign({}, this.room.dataValues);
        emitObj.members = members;
        return emitObj;
    }
}

module.exports = groupChatController;