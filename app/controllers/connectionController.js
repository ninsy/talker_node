import { EventEmitter } from 'events';


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

            // CUSTOM, SELF-DEFINED EVENTS - might be converted into regular service calls.
            .on('auth', this.onAuthenticateHandler.bind(this))
            .on('send', this.onSendHandler.bind(this))

    }
    onMessageHandler(message) {

        /**
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
         */

        let event = JSON.parse(message);
        this.emit(event.procedure, {
            method: event.procedure.method,
            payload: event.payload,
            metadata: event.metadata,
        });
    }
    onSendHandler(message) {
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
    onAuthenticateHandler() {

    }
}

export default ConnectionController;