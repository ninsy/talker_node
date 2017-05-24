import groupChatService from '../services/groupChatService';
import messageService from '../services/messageService';
import friendshipService from '../services/friendshipService';
import socialGroupService from '../services/socialGroupService';
import privilegeService from '../services/privilegeService';

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