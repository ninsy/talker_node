import friendshipService from '../services/friendshipService';

let instance = null;

/**
 *  All methods
 */

class socialController {
    constructor() {
        if(!instance) {
            instance = this;
        }
        return instance;
    }
    invieFriend({id}) {

    }
    getFriendsList({id}) {

    }
    removeFriend({id}) {

    }
}

export default socialController;