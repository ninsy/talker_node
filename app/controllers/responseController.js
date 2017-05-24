import { EventEmitter } from 'events';

let instance = null;

export default class responseController extends EventEmitter {
    constructor() {
        if(!instance) {
            super();
            instance = this;
        }
        return instance;
    }
    emitResponse(targetArr ,{status, metadata, payload}) {
        if(target === undefined || ( status === undefined && metadata === undefined && payload === undefined)) {
            return;
        }
        // TODO: if target === -1 - return to self ( person who requested )
        targetArr.forEach((target) => {
            this.emit(status, {
                metadata: {
                    target: target.id
                }
            });
        });
    }
}