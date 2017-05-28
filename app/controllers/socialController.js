let socialGroupService = require('../services/socialGroupService');

let instance = null;

class socialController {
    constructor() {
        if(!instance) {
            instance = this;
        }
        return instance;
    }
    createGroup() {

    }
    inviteMember() {

    }
    getMembersList() {

    }
    removeMember() {

    }
    changeGroupInfo() {

    }
    acceptInvite() {

    }
    rejectInvite() {

    }
}

export default socialController;