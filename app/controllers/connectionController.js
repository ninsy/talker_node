let EventEmitter = require('events').EventEmitter;
let userController = require('./userController');

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

            // CUSTOM, SELF-DEFINED SCOPES
            .on('user', this.onUserScope.bind(this))
            .on('message', this.onMessageScope.bind(this))
            .on('friendship', this.onFrendshipScope.bind(this))
            .on('social', this.onSocialScope.bind(this))
            .on('groupChat', this.onGroupChatScope.bind(this))

    }
    onMessageHandler(message) {

        /**
         *  REQUESTS
         *
         *  {
         *      procedure: {
         *          scope: 'user',
         *          method: 'register'
         *      },
         *      meta: {
         *          jwt: '',
         *      },
         *      payload: {
         *
         *      }
         *  }
         *
         */

        let event = JSON.parse(message);
        this.emit(event.procedure.scope, {
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
    onSendHandler({target, status, payload}) {
        // TODO: determine if proper target, by id.
        /**
         *      *  RESPONSES
         *
         *  {
         *      status: 200,
         *      meta: {
         *      },
         *      payload: {
         *          message: "whatever"
         *      }
         *  }
         *
         */
        if(target.id === this.assignedUser.id || target.id === this.id) {
            this.connection.send(JSON.stringify({status, payload}));
        }
    }
    assignUser(user) {
        this.assignedUser = user;
    }
    onUserScope({method, payload, metadata}) {
        let userCtrl = new userController();
        userCtrl.handleRequest(this.assignedUser, {method, metadata, payload});
    }

}

module.exporst = ConnectionController;