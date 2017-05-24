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
        if(!instance) {
            instance = this;
            this.responseCtrl = new responseController();
        }
        return instance;
    }
    register({username, email, password, }) {
        return userService.register({username, password, email})
            .then((freshUser) => {
                let token =  Auth.signToken(freshUser.id);
                this.responseCtrl.emitResponse(-1, {
                    status: 200,
                    payload: {
                        token
                    }
                })
            })
    }
    signin({email, password}) {
        return Auth.verifyUser({email, password})
            .then((verifiedUser) => {
                let token = Auth.signToken(verifiedUser.id);
                this.responseCtrl.emitResponse(-1, {
                    status: 200,
                    payload: {
                        token,
                    }
                })
            });
    }
    getInfo() {

    }
    handleRequest({method, metadata, payload}) {
        switch(method) {
            case 'register': {
                this.register(payload);
                break;
            }
            case 'signin': {
                this.signin(payload);
                break;
            }
            case 'getInfo': {
                this.getInfo(payload);
                break;
            }
            default: {
                this.responseCtrl.emitResponse(-1, {
                    status: 400,
                    payload: {
                        message: `Method ${method} doesn't exist in user context.`
                    }
                })
            }
        }

    }
}

export default userController;