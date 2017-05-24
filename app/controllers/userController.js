import userService from '../services/userService';
import imageService from '../services/imageService';
import responseController from "./responseController";
import Auth from "../auth/auth";


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

    register({username, email, password,}) {
        return userService.register({username, password, email})
            .then((freshUser) =>  Auth.signToken(freshUser.id));
    }

    signin({email, password}) {
        return Auth.verifyUser({email, password})
            .then((verifiedUser) => Auth.signToken(verifiedUser.id));
    }
    getInfo() {
    }
    updateInfo(requester, {payload, metadata}) {
        return Auth.verifyToken(metadata)
            .then((decodedUser) => {
                if (decodedUser.id !== requester.id) {
                    return Promise.reject({status: 401});
                }
                else {
                    return userService.update(decodedUser, payload);
                }
            })
    }
    handleRequest(connection, {method, metadata, payload}) {
        switch (method) {
            case 'register': {
                this.register(payload).then((token) => {
                    this.responseCtrl.emitResponse({
                        status: err.status || 200,
                        payload: {
                            token
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
            case 'updateInfo': {
                this.updateInfo(connection.assignedUser, {payload, metadata}).then((updatedUser) => {
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

export default userController;