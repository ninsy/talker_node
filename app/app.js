import WebSocket from 'ws';

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
}

export default App;