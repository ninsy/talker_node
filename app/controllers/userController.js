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

    getOne({id}) {
        return userService.getOne({id});
    }

    me({assignedUser}) {
        return userService.getOne({id: assignedUser.id})
    }

    getList() {
        return userService.getList(payload);
    }

    update({id, data}) {
        return userService
            .getOne({id})
            .then((current) => userService.update({current, data}))
    }

    handleRequest(connection, {method, metadata, payload}) {
        switch (method) {
            case 'me': {
                this.me({assignedUser: connection.assignedUser}).then((self) => {
                    this.responseCtrl.emitResponse({
                        procedure: {method, scope: 'user'},
                        status: 200,
                        payload: self,
                    }, connection);
                });
                break;
            }
            case 'getOne': {
                this.getOne(payload).then((user) => {
                    this.responseCtrl.emitResponse({
                        procedure: {method, scope: 'user'},
                        status: 200,
                        payload: user,
                    });
                }).catch((err) => {
                    this.responseCtrl.emitError({
                        procedure: {method, scope: 'user'},
                        status: 400,
                        payload: err,
                    })
                });
                break;
            }
            case 'list': {
                this.getList(payload).then((userList) => {
                    this.responseCtrl.emitResponse({
                        procedure: {method, scope: 'user'},
                        status: 200,
                        payload: userList,
                    });
                }).catch((err) => {
                    this.responseCtrl.emitError({
                        procedure: {method, scope: 'user'},
                        status: 400,
                        payload: err,
                    })
                });
                break;
            }
            case 'update': {
                this.update(payload).then((updatedUser) => {
                    this.responseCtrl.emitResponse({
                        procedure: {method, scope: 'user'},
                        status: 200,
                        payload: updatedUser,
                    }, connection);
                }).catch((err) => {
                    this.responseCtrl.emitError({
                        procedure: {method, scope: 'user'},
                        status: err.status || 400,
                        payload: err,
                    }, connection)
                });
                break;
            }
            default: {
                this.responseCtrl.emitError({
                    procedure: {method, scope: 'user'},
                    status: 400,
                    payload: `Method ${method} doesn't exist in user context.`
                }, connection);
            }
        }
    }
}

module.exports = userController;