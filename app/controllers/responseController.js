let EventEmitter = require('events').EventEmitter;

let instance = null;

class responseController extends EventEmitter {
    constructor() {
        if(!instance) {
            super();
            instance = this;
        }
        return instance;
    }
    emitResponse({status, payload},  ...targets) {
        if(targets === undefined || !targets.length ||( status === undefined && payload === undefined)) {
            return;
        }
        targets.forEach((target) => {
            this.emit('send', {
                status,
                target,
                payload,
            });
        });
    }
    emitError({status, payload}, target) {
        if(targets === undefined || !targets.length ||( status === undefined && payload === undefined)) {
            return;
        }
        this.emit('error', {
            status,
            target,
            payload,
        })
    }
}

module.exports = responseController;