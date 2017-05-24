import userController from './userController';

export default class userEntityController {
    constructor(userEntity, token) {
        this.userEntity = userEntity;
        this.token = token;
    }
};