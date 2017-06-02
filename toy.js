var websocket = require("ws");

let heroku = `talker-node.herokuapp.com`;
let local = `localhost:5000`;

let token = null,
    me = null;

const ws = new websocket(`ws://${heroku}`);


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

function login() {
    return {
        procedure: {
            scope: 'auth',
            method: 'signin',
        },
        payload: {
            email: 'a@a.pl',
            password: 'admin',
        },
    };
}

function getSelf(token) {
    return {
        procedure: {
            scope: 'user',
            method: 'me',
        },
        meta: {
            token,
        },
        payload: {}
    }
}

function tryModify(token, id) {
    return {
        procedure: {
            scope: 'user',
            method: 'update',
        },
        meta: {
            token
        },
        payload: {
            id,
            data: {
                username: 'admin123',
                password: 'admin123',
                email: 'a@a.pl',
            }
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

    if(data.procedure.method === 'register') {
        token = data.payload;
        ws.send(JSON.stringify(login()));
    }
    else if(data.procedure.method === 'signin') {
        ws.send(JSON.stringify(getSelf(token)));
    }
    else if(data.procedure.scope === 'user' && data.procedure.method === 'me') {
        me = data.payload;
        ws.send(JSON.stringify(tryModify(token, me.id)));
    }
});

ws.on('error', (data) => {
    console.error("ERROR OCCURRED!");
    //data = JSON.parse(data);
    console.log(data);
});

ws.on('close', function(data) {

});