let authService = require('./authService');
let responseCtrl = require('../controllers/responseController');

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
                return this.authService.signin({payload})
                    .then((token) => {
                        new responseCtrl().emitResponse({
                            status: 200,
                            payload: {
                                token
                            }
                        }, connection);
                    }).catch((err) => {
                        new responseCtrl().emitError({
                            status: err.status || 400,
                            payload: {
                                message: err.message || err,
                            }
                        }, connection)
                    })
            }
            case 'register': {
                return this.authService.register({payload})
                    .then((token) => {
                        new responseCtrl().emitResponse({
                            status: 200,
                            payload: {
                                token
                            }
                        }, connection);
                    }).catch((err) => {
                        if(err.message === 'SequelizeUniqueConstraintError') {
                            err.status = 409;
                            err.message = `User with provided credentials already exists.`
                        }
                        new responseCtrl().emitError({
                            status: err.status || 400,
                            payload: {
                                message: err.message || err,
                            }
                        }, connection)
                    });
            }
            default: {
                return new responseCtrl().emitError({
                    status: 400,
                    payload: {
                        message: `Method ${method} doesn't exist in user context.`
                    }
                }, connection);
            }
        }
    }
}

module.exports = Auth;