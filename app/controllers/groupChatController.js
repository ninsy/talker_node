let groupChatService = require('../services/groupChatService');
let messageService = require('../services/messageService');
let friendshipService = require('../services/friendshipService');
let socialGroupService = require('../services/socialGroupService');
let privilegeService = require('../services/privilegeService');

/**
 * Each instance of it represents separate groupChat
 */

class groupChatController {
    constructor(creator, ...initialParticipants) {
        this.creator = creator;
        this.participants = [];

        privilegeService.setRole(privilegeService.ROLES.OWNER, this.creator.id);
    }
    setPrivilege() {

    }
    onMessageRequest() {

    }
    onBroadcastRequest() {

    }
    onUserJoin() {

    }
    onUserQuit() {

    }
}

export default  groupChatController;