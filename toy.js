var websocket = require("ws");

let heroku = `talker-node.herokuapp.com`;
let local = `localhost:5000`;

let token = null;

const ws = new websocket(`ws://${local}`);

function registerMsg() {
    return {
        procedure: {
            scope: 'auth',
            method: 'register',
        },
        meta: {

        },
        payload: {
            username: 'admin',
            password: 'admin',
            email: 'a@a.pl',
        },
    };
}

function tryModify(token) {
    return {
        procedure: {
            scope: 'user',
            method: 'update',
        },
        meta: {
            token
        },
        payload: {
            username: 'admin123',
            password: 'admin123',
            email: 'a@a.pl',
        },
    };
}

ws.on('open', function open() {
        ws.send(JSON.stringify(registerMsg()));
    });

ws.on('message', function incoming(data, flags) {
    // flags.binary will be set if a binary data is received.
    // flags.masked will be set if the data was masked.
    console.log('Incoming: ');
    console.log(flags);

    data = JSON.parse(data);
    console.log(data);

    if(data.payload.token) {
        token = data.payload.token;
        ws.send(JSON.stringify(tryModify(token)));
    }
});

ws.on('error', (data) => {
    console.error("ERROR OCCURRED!");
    //data = JSON.parse(data);
    console.log(data);
});

ws.on('close', function(data) {

});