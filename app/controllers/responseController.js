let instance = null;
class responseController {
    constructor() {
        if(!instance) {
            instance = this;
        }
        return instance;
    }
    emitResponse({status, payload},  ...targets) {
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
    emitError({status, payload}, target) {
        if(target === undefined || !target.length ||( status === undefined && payload === undefined)) {
            return;
        }
        target.emit('error', {
            status,
            payload,
        });
    }
}

module.exports = responseController;