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
    emitResponse({procedure, status, payload},  ...targets ) {
        if(procedure === undefined || targets === undefined || !targets.length ||( status === undefined && payload === undefined)) {
            return;
        }
        targets.forEach((target) => {
            target.connection.emit('send', {
                procedure,
                status,
                payload,
            });
        });
    }
    emitError({procedure, status, payload}, target = requiredConnectionParamEmitError()) {
        if(procedure === undefined || target === undefined) {
            return;
        }
        target.connection.emit('appError', {
            procedure,
            status,
            payload,
        });
    }
}

module.exports = responseController;