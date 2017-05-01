var websocket = require('ws');
var config = require('./config/config');

var server;

module.exports = function() {
    if(!server ){
        server = new websocket.Server({
            port: config.port,
            clientTracking: true,
        });
    }
    server.on('connection', function(conn) {
        conn.on('close', function() {
            console.log(`Connection closed.`);
        });
        conn.on('message', function(msg) {
            console.log(`Received message: ${msg}`);
            server.clients.forEach(function each(client) {
                if (client.readyState === websocket.OPEN) {
                    client.send("PONG");
                }
            });
        })
    });
    server.on('close', function() {

    });
    console.log("server running on port: " + config.port);
    return server;
};