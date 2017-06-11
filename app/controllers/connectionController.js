let EventEmitter = require('events').EventEmitter;
let authService = require('../auth/authService');

let authCtrl = require('../auth/authController');
let responseController = require('./responseController');
let userController = require('./userController');
let friendshipController = require('./friendshipController');
let groupChatCtrl = require('./groupChatController');
let groupChatService = require('../services/groupChatService');


/**
 * Represents single connection
 */
class ConnectionController extends EventEmitter {
    constructor(connection, id) {
        super();
        this.connection = connection;
        this.id = id;
        this.isAlive = true;
        this.authCtrl = new authCtrl();
        this.chatRooms = {};
        // TODO: what should be contained in 'type' exactly? scope of action / remote procedure call ?
        //
        this.connection
        // WebSocket Events
            .on('message', this.onMessageHandler.bind(this))
            .on('close', this.onCloseHandler.bind(this))
            .on('pong', this.onPongHandler.bind(this))
            .on('timeout', this.onTimeoutHandler.bind(this))

            // Server mechanisms
            .on('send', this.onSendHandler.bind(this))
            .on('appError', this.onAppErrorHandler.bind(this))

            // SIGNIN / REGISTER STUFF
            .on('auth', this.onAuthScope.bind(this))

            // CUSTOM, SELF-DEFINED SCOPES - ASSUMING THAT AT THIS POINT USER HAS BEEN AUTHORIZED
            .on('user', this.onUserScope.bind(this))
            .on('friendship', this.onFrendshipScope.bind(this))
            .on('social', this.onSocialScope.bind(this))
            .on('groupChat', this.onGroupChatScope.bind(this))

    }

    onAuthScope({method, payload, metadata}) {
        this.authCtrl.handleRequest(this, {method, payload, metadata})
            .then((freshUser) => {
                this.assignedUser = freshUser.sanitize();
                new responseController().addClientTuple({websocket: this.connection, assignedUser: this.assignedUser});
            })
    }

    onMessageHandler(message) {
        console.log(message);
        let event = JSON.parse(message);
        if (event.procedure.scope !== 'auth') {
            return new authService().verifyToken({metadata: event.meta})
                .then(({id}) => {
                    return this.assignedUser
                        ? Promise.resolve()
                        : new userController().getOne({id})
                })
                .then((user) => {
                    if (user) {
                        this.assignedUser = user.sanitize();
                    }
                    this.connection.emit(event.procedure.scope, {
                        method: event.procedure.method,
                        payload: event.payload,
                        metadata: event.metadata,
                    });
                })
                .catch((err) => {
                    this.connection.emit('appError', {
                        procedure: {
                            scope: event.procedure.scope,
                            method: event.procedure.method,
                        },
                        status: 403,
                        payload: 'Forbidden',
                    });
                });
        }
        this.connection.emit(event.procedure.scope, {
            method: event.procedure.method,
            payload: event.payload,
            metadata: event.metadata,
        });
    }

    onPongHandler() {
        this.isAlive = true;
    }

    onCloseHandler() {

    }

    onTimeoutPrevention() {
        this.isAlive = false;
        this.connection.ping('', false, true);
    }

    onTimeoutHandler() {
        this.connection.terminate();
    }

    onSendHandler(data) {
        this.connection.send(JSON.stringify(data));
    }

    onAppErrorHandler({procedure, status = 500, payload = {message: 'Something went wrong'}}) {
        this.connection.send(JSON.stringify({procedure, status, payload}));
    }

    onUserScope({method, payload, metadata}) {
        let userCtrl = new userController();
        userCtrl.handleRequest(this, {method, metadata, payload});
    }

    onFrendshipScope({method, payload, metadata}) {
        return new friendshipController().handleRequest(this, {method, payload});
    }

    onSocialScope({method, payload, metadata}) {

    }

    onGroupChatScope({method, payload, metadata}) {

        if (method === 'newRoom') {

            return new groupChatCtrl(this.assignedUser, ...payload.invitees)
                .then(chatRoom => {
                    this.chatRooms[chatRoom.id] = chatRoom;
                    this.connection.emit('send', {
                        procedure: {
                            scope: 'groupChat',
                            method,
                        },
                        status: 200,
                        payload: chatRoom,
                    });
                });

        }
        else if(method === 'myChatRooms') {
            return new groupChatService().loggedUserChatRooms({userId: this.assignedUser.id})
                .then(chatRooms => {
                    chatRooms.forEach(chatRoom => this.chatRooms[chatRoom.id] = chatRoom);
                    new responseController().emitResponse({
                        procedure: {
                            scope: 'groupChat',
                            method: 'myChatRooms',
                        },
                        status: 200,
                        payload: chatRooms,
                    }, this);
                });
        } else {
            let room = Object.keys(this.chatRooms).find(r => r.id === payload.roomId);
            room.handleRequest(this, {method, payload})

        }

    }
}


module.exports = ConnectionController;