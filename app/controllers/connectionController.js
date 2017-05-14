import { EventEmitter } from 'events';

/**
 * Each instance represents WebSocket connection between NodeJS backend and AndroidApp
 * type: [ message, response, close, authenticate ] payload: [ code: [1-7][0-9], ...rest of stuff }
  */
class ConnectionController {
    constructor(connection) {
        this.connection = connection;
        // TODO: eventify
    }
    onMessageHandler({message}) {
        // TODO: detect code, call appropriate controller
    }
    onCloseHandler() {

    }
    onTimeoutHandler() {

    }
    onAuthenticateHandler() {

    }
}