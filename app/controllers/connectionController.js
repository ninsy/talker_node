import { EventEmitter } from 'events';
import userController from './userController';

/**
 * Represents single connection
 */
class ConnectionController extends EventEmitter {
    constructor(connection, id) {
        super();
        this.connection = connection;
        this.isAlive = true;

        // TODO: what should be contained in 'type' exactly? scope of action / remote procedure call ?
        //

        this.connection
            // WebSocket Events
            .on('message', this.onMessageHandler.bind(this))
            .on('close', this.onCloseHandler.bind(this))
            .on('pong', this.onPongHandler.bind(this))

            // CUSTOM, SELF-DEFINED EVENTS - might be converted into regular service calls.
            .on('login', this.assignUser.bind(this))
            .on('user', this.onUserHandler.bind(this))
            .on('send', this.onSendHandler.bind(this))

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
         *  RESPONSES
         *
         *  {
         *      status: 200,
         *      meta: {
         *          target: target.id
         *      },
         *      payload: {
         *          message: "whatever"
         *      }
         *  }
         *
         */

        let event = JSON.parse(message);
        this.emit(event.procedure.user, {
            method: event.procedure.method,
            payload: event.payload,
            metadata: event.metadata,
        });
    }
    onSendHandler(message) {
        // TODO: determine if proper target, by id.
        this.connection.send(JSON.stringify(message));
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
    onUserHandler({method, payload, metadata}) {
        let userCtrl = new userController();
        userCtrl.handleRequest({method, metadata, payload});
    }
    assignUser({user, token}) {
        this.assignedUser = user;
        this.assignedToken = token;
    }
}

export default ConnectionController;