var websocket = require("ws");

let heroku = `talker-node.herokuapp.com`;
let local = `localhost:5000`;

const ws = new websocket(`ws://${local}`);

    var msg = {
        scope: 'user',
        action: 'register',
        jwt: '12345',
        payload: { token: 'XXX' }
    };

    ws.on('open', function open() {
        ws.send(JSON.stringify(msg));
    });

ws.on('message', function incoming(data, flags) {
    // flags.binary will be set if a binary data is received.
    // flags.masked will be set if the data was masked.
    console.log('Incoming: ');
    console.log(data);
    console.log(flags);
    if(data.payload) {
        console.log(data.payload.message);
    }
});

ws.on('close', function(data) {

});