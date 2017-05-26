let friendshipService = require('../services/friendshipService');

let instance = null;

/**
 *  All methods
 */

class friendshipController {
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
    acceptFriendshipInvite() {

    }
    rejectFriendshipInvite() {

    }
    getInvitesList() {

    }
}

export default friendshipController;