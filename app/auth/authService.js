let instance = null;

let jwt = require('jsonwebtoken');
let config = require('../../config/config');
let Models = require('../models/db');

let userService = require('../services/userService');

class AuthService {
    constructor() {
        if(!instance) {
            instance = this;
        }
    }
    signToken(id) {
        return jwt.sign(
            {id: id},
            config.secrets.jwt,
            {expiresIn: config.expireTime}
        );
    }
    verifyToken({metadata}) {
        return new Promise((resolve, reject) => {
            let token = metadata.token;
            if (!token) {
                // TODO: replace with response packet
                reject({status: 401, message: 'Unauthorized'});
            } else {
                jwt.verify(token, config.secrets.jwt, (err, decoded) => {
                    if (err) {
                        reject({status: 401, message: 'Unauthorized'});
                    } else {
                        resolve(decoded);
                    }
                })
            }
        });
    };
    verifyUser({email, password}) {
        if (!email || !password) {
            return Promise.reject({status: 400, message: 'You need to provide both email and password'});
        }
        return Models.User.findAll({where: {email: email}}).then(function (users) {
            let user = users[0];
            if (!user || !user.authenticate(password)) {
                return {status: 401, message: 'Unauthorized'};
            } else {
                return user;
            }
        }).catch(function (error) {
            return {status: 500, message: error.message};
        })

    };
    signin({email, password}) {
        return this.verifyUser({email, password})
            .then((verifiedUser) => {
                return {
                    token: this.signToken(verifiedUser.id),
                    verifiedUser,
                }
            });
    }

    register({payload}) {
        if(!payload.email || !payload.password) {
            return Promise.reject({status: 400, message: 'You need to provide both email and password'})
        }
        return userService.register(payload)
            .then((freshUser) =>  {
                return {
                    token: this.signToken(freshUser.id),
                    freshUser,
                }
            })

    };
}

module.exports = AuthService;