let userController = require('./userController');

export default class userEntityController {
    constructor(userEntity, token) {
        this.userEntity = userEntity.dataValues;
        this.token = token;
    }
};