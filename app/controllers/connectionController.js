let EventEmitter = require('events').EventEmitter;
let userController = require('./userController');
let responseController = require('./responseController');
let authService = require('../auth/authService');
let authCtrl = require('../auth/authController');

/**
 * Represents single connection
 */
class ConnectionController extends EventEmitter {
    constructor(connection, id) {
        super();
        this.connection = connection;
        this.id = id;
        this.isAlive = true;
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
            .on('login', this.assignUser.bind(this))

            // SIGNIN / REGISTER STUFF
            .on('auth', this.onAuthScope.bind(this))

            // CUSTOM, SELF-DEFINED SCOPES - ASSUMING THAT AT THIS POINT USER HAS BEEN AUTHORIZED
            .on('user', this.onUserScope.bind(this))
            .on('chatMessage', this.onMessageScope.bind(this))
            .on('friendship', this.onFrendshipScope.bind(this))
            .on('social', this.onSocialScope.bind(this))
            .on('groupChat', this.onGroupChatScope.bind(this))

    }
    onAuthScope({method, payload, metadata}) {
        new authCtrl().handleRequest({method, payload, metadata}).then((user) => {
            this.assignedUser = user;
        });
    }
    onMessageHandler(message) {
        let event = JSON.parse(message);
        console.log(`${event.procedure.scope} being emitted`);

        if(event.procedure.scope !== 'auth') {
            new authService().verifyToken({metadata: event.metadata})
                .then(() => {
                    this.connection.emit(event.procedure.scope, {
                        method: event.procedure.method,
                        payload: event.payload,
                        metadata: event.metadata,
                    });
                })
                .catch(() => {
                    return new responseController().emitError({
                        status: 403,
                        payload: {
                            message: 'Unauthorized',
                        }
                    })
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
    onTimeoutHandler()  {
        this.connection.terminate();
    }
    onSendHandler({status, payload}) {
        this.connection.send(JSON.stringify({status, payload}));
    }
    assignUser(user) {
        this.assignedUser = user;
    }
    onUserScope({method, payload, metadata}) {
        let userCtrl = new userController();
        userCtrl.handleRequest(this, {method, metadata, payload});
    }
    onMessageScope({method, payload, metadata}) {

    }
    onFrendshipScope({method, payload, metadata}) {

    }
    onSocialScope({method, payload, metadata}) {

    }
    onGroupChatScope({method, payload, metadata}) {

    }
}

module.exports = ConnectionController;