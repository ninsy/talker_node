let WebSocket = require('ws');
let connectionController = require('./controllers/connectionController');

// TODO: in future, refactor into websocket-rpc boilerplate, preferably based on TS ( with both JSON/Protobuf )

let instance = null;
let ID = 0;

class App {
    constructor(CONFIG) {
        if(instance) {
            return instance;
        }
        instance = this;

        this.CONFIG = CONFIG;
        this.clients = {};
        this.ctx = new WebSocket.Server({
            port: this.CONFIG.port,
            clientTracking: true,
        });
        this.spawnConn = this.spawnConn.bind(this);
        this.ctx.on('connection', this.spawnConn);
        console.log(`server running on port: ${this.CONFIG.port}`);
    }
    spawnConn(ws) {
        let newConn = new connectionController(ws, ID++);
        this.clients[newConn.id] = newConn;
    }
    checkTimeout() {
        setInterval(() => {
            this.clients.forEach((client) => {
                if(!client.isAlive) {
                    client.onTimeoutHandler();
                    delete this.clients[client.id];
                }

                client.onTimeoutPrevention();
            })
        }, 1000 * 30)
    }
    broadcast(message) {
        Object.entries(this.clients).forEach(([id, client]) => {
            if(client.connection.readyState === WebSocket.OPEN) {
                client.onSendHandler(message);
            }
        });
    }
}

module.exports = App;