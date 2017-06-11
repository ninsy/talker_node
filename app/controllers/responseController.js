let App = require('../app');

let instance = null;


let requiredParam = () => {
    throw `Missing required parameter`;
};

class responseController {
    constructor() {
        if(!instance) {
            instance = this;
            instance.clients = [];
        }
        return instance;
    }
    addClientTuple({ websocket, assignedUser}) {
        this.clients.push({websocket, assignedUser});
    }
    emitResponseByUsedIds({procedure, status, payload},  ...targetsIds ) {
        //let conns = new App().getConnections(...targets);


        this.clients.filter(client => targetsIds.find(id => id === client.assignedUser.id)).forEach(client => {
            client.websocket.emit('send', {
                procedure,
                status,
                payload,
            })
        });
    }
    emitResponse({procedure, status, payload},  ...targets ) {
        if(procedure === undefined || targets === undefined || !targets.length ||( status === undefined && payload === undefined)) {
            return;
        }
        console.log("Emitting: ");
        console.log(status);
        console.log(procedure);
        console.log(payload);
        targets.forEach((target) => {
            target.connection.emit('send', {
                procedure,
                status,
                payload,
            });
        });
    }
    emitError({procedure, status, payload}, target = requiredParam()) {
        if(procedure === undefined || target === undefined) {
            return;
        }
        console.log("Emitting: ");
        console.log(status);
        console.log(procedure);
        console.log(payload);
        target.connection.emit('appError', {
            procedure,
            status,
            payload,
        });

    }
}

module.exports = responseController;