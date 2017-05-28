let userService = require('../services/userService');
let imageService = require('../services/imageService');
let responseController = require("./responseController");

/**
 * Just a facade between connection and service - singleton fits here.
 *
 *  // TODO: rather refactor this stuff into representation of user entity, which will be used
 *  // TODO:    as a link between connection entity and chatMemberEntity - both of them will use same object
 *  // TODO:    instead of
 *
 */

let instance = null;
class userController {
    constructor() {
        if (!instance) {
            instance = this;
            this.responseCtrl = new responseController();
        }
        return instance;
    }
    getInfo() {
    }
    update(requester, {payload}) {
        return userService.update(requester, payload);
    }
    handleRequest(connection, {method, metadata, payload}) {
        switch (method) {
            case 'signin': {
                this.signin(payload).then((token) => {
                    this.responseCtrl.emitResponse({
                        status: 200,
                        payload: {
                            token,
                        }
                    }, connection);
                }).catch((err) => {
                    this.responseCtrl.emitError({
                        status: err.status || 400,
                        payload: {
                            message: err,
                        }
                    }, connection)
                });
                break;
            }
            case 'getInfo': {
                this.getInfo(payload);
                break;
            }
            case 'update': {
                this.update(connection.assignedUser, {payload, metadata}).then((updatedUser) => {
                    this.responseCtrl.emitResponse({
                        status: 200,
                        payload: {
                            updatedUser,
                        }
                    }, connection);
                }).catch((err) => {
                    this.responseCtrl.emitError({
                        status: err.status || 400,
                        payload: {
                            message: err,
                        }
                    }, connection)
                });
                break;
            }
            default: {
                this.responseCtrl.emitError({
                    status: 400,
                    payload: {
                        message: `Method ${method} doesn't exist in user context.`
                }
                }, connection)
            }
        }
    }
}

module.exports = userController;