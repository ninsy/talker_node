import WebSocket from 'ws';
import { EventEmitter } from 'events';

class App {
    constructor(CONFIG) {
        this.CONFIG = CONFIG;
        this.ctx = new WebSocket.Server({
            port: this.CONFIG.port,
            clientTracking: true,
        });

        this.handleConn = this.handleConn.bind(this);
        this.ctx.on('connection', this.handleConn);

        console.log(`server running on port: ${this.CONFIG.port}`);
    }
    handleConn(incomingConn) {
        incomingConn.on('close', () => {
            console.log(`Connection closed.`);
        });
        incomingConn.on('message', (msg) => {
            console.log(`Received message: ${msg}`);
            this.ctx.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send("PONG");
                }
            });
        })
    }
    toEvent(message) {
        let event = JSON.parse(message);
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
    }
}

export default App;