let instance = null;

let requiredConnectionParamEmitError = () => {
    throw `Method emitError must receive target [ connectionController ] parameter!`;
};

class responseController {
    constructor() {
        if(!instance) {
            instance = this;
        }
        return instance;
    }
    emitResponse({status, payload},  ...targets ) {
        if(targets === undefined || !targets.length ||( status === undefined && payload === undefined)) {
            return;
        }
        targets.forEach((target) => {
            target.connection.emit('send', {
                status,
                payload,
            });
        });
    }
    emitError({status, payload}, target = requiredConnectionParamEmitError()) {
        if(target === undefined) {
            return;
        }
        target.connection.emit('appError', {
            status,
            payload,
        });
    }
}

module.exports = responseController;