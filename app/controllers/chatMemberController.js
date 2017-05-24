/**
 * Represents sole chat member user
 */

export default class chatMemberController {
    constructor(UserInstance) {
        this.id = UserInstance.dataValues.id;
        this.username = UserInstance.dataValues.username;
    }
    sendMessage(content) {

    }
    quitRoom() {

    }

}