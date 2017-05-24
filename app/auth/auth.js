import jwt from 'jsonwebtoken';
import config from '../../config/config';
import Models from '../models/db'

class Auth {
    static verifyToken({metadata}) {
        return new Promise((resolve, reject) => {
            let token = metadata.token;
            if (!token) {
                // TODO: replace with response packet
                reject({status: 400, message: 'Unauthorized'});
            } else {
                jwt.verify(token, config.secrets.jwt, (err, decoded) => {
                    if (err) {
                        reject({status: 400, message: 'Unauthorized'});
                    } else {
                        resolve(decoded);
                    }
                })
            }
        });
    }
    static verifyUser({message}) {
        if (!message.email || !message.password) {
            return Promise.reject({status: 400, message: 'You need to provide both email and password'});
        }
        return Models.User.findAll({where: {email: message.email}}).then(function (users) {
            let user = users[0];
            if (!user || !user.authenticate(message.password)) {
                return {status: 401, message: 'Unauthorized'};
            } else {
                return user;
            }
        }).catch(function (error) {
            return {status: 500, message: error.message};
        })
    }
    static signToken(id) {
        return jwt.sign(
            {id: id},
            config.secrets.jwt,
            {expiresIn: config.expireTime}
        );
    }
}

export default Auth;