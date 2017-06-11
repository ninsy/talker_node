let authService = require('./authService');
let responseCtrl = require('../controllers/responseController');

let groupChatService = require('../services/groupChatService');

let instance = null;

class Auth {
    constructor() {
        if(!instance) {
            instance = this;
            instance.authService = new authService();
        }
        return instance;
    };
    handleRequest(connection, {method, metadata, payload}) {
        switch(method) {
            case 'signin': {
                return this.authService.signin(payload)
                    .then(({token, verifiedUser}) => {
                        return groupChatService.loggedUserChatRooms({userId: verifiedUser.id})
                            .then(chatRooms => {
                                new responseCtrl().emitResponse({
                                    procedure: {method, scope: 'auth'},
                                    status: 200,
                                    payload: token
                                }, connection);
                                chatRooms = chatRooms ? chatRooms : [];
                                return Promise.resolve({user: verifiedUser, chatRooms });
                            });
                    }).catch((err) => {
                        new responseCtrl().emitError({
                            procedure: {method, scope: 'auth'},
                            status: err.status || 400,
                            payload: err.message || err,
                        }, connection)
                    });
            }
            case 'register': {
                return this.authService.register({payload})
                    .then(({token, freshUser}) => {
                          new responseCtrl().emitResponse({
                             procedure: {method, scope: 'auth'},
                             status: 200,
                             payload: token,
                        }, connection);
                        return Promise.resolve({user: freshUser, chatRooms: []});
                    }).catch((err) => {
                        if(err.name === 'SequelizeUniqueConstraintError') {
                            err.status = 409;
                            err.message = `User with provided credentials already exists.`
                        }
                        new responseCtrl().emitError({
                            procedure: {method, scope: 'auth'},
                            status: err.status || 400,
                            payload: err.message || err,
                        }, connection)
                    });
            }
            default: {
                new responseCtrl().emitError({
                    procedure: {method, scope: 'auth'},
                    status: 400,
                    payload: `Method ${method} doesn't exist in user context.`
                }, connection);
            }
        }
    }
}

module.exports = Auth;