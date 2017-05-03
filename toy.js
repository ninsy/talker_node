var websocket = require("ws");

const ws = new websocket('ws://talker-node.herokuapp.com');

ws.on('open', function open() {
    ws.send('ping');
});

ws.on('message', function incoming(data, flags) {
    // flags.binary will be set if a binary data is received.
    // flags.masked will be set if the data was masked.
    console.log(data);
    console.log(flags);
});

ws.on('close', function(data) {

});