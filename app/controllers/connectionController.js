import { EventEmitter } from 'events';

/**
 * Each instance represents WebSocket connection between NodeJS backend and AndroidApp
 * type: [ message, response, close, authenticate ] payload: [ code: [1-7][0-9], ...rest of stuff }
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

            // CUSTOM, SELF-DEFINED EVENTS - might be converted into regular service calls.
            .on('auth', this.onAuthenticateHandler.bind(this))
            .on('send', this.onSendHandler.bind(this))

    }
    onMessageHandler(message) {
        let event = JSON.parse(message);
        /***
        switch(true) {
            case /^(1[0-9]{2})$/.test(event.code): {
                // test purposes
                break;
            }
            case /^(2[0-9]{2})$/.test(event.code): {
                // responses from client
                break;
            }
            case /^(3[0-9]{2})$/.test(event.code): {
                // group chat / messages related
                break;
            }
            case /^(4[0-9]{2})$/.test(event.code): {
                // social / friendship related
                break;
            }
            case /^(5[0-9]{2})$/.test(event.code): {
                // user related
                break;
            }
            case /^(6[0-9]{2})$/.test(event.code): {
                // authentication related
                break;
            }
        }
         ****/
        this.emit(event.type, event.payload);
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