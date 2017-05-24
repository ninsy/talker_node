import jwt from 'jsonwebtoken';
import config from '../../config/config';
import Models from '../models/db'
import {EventEmitter} from 'events';

class Auth extends EventEmitter {
    static verifyToken({message}) {
        let token = message.token;
        if(!token) {
            // TODO: replace with response packet
            this.emit({status: 400, message: 'Unauthorized'});
        } else {
            jwt.verify(token, config.secrets.jwt, (err, decoded) => {
                if(err) {
                    this.emit({status: 400, message: 'Unauthorized'});
                } else {
                    message.user = decoded;
                }
            })
        }
    }
    static verifyUser({message}) {
        if(!message.email || !message.password) {
            this.emit({status: 400, message: 'You need to provide both email and password'});
        }
        Models.User.findAll({where: {email: message.email}}).then(function(users) {

            var user = users[0];
            if(!user || !user.authenticate(message.password)) {
                this.emit({ status: 401, message: 'Unauthorized'});
            } else {
                message.user = user;
            }
        }).catch(function(error) {
            this.emit({status: 500, message: error.message});
        })

    }
    static getFreshUser({message}) {
        Models.User.findById(req.user.id).then(function(user) {
            if(!user) {
                this.emit({status: 401, message: "Unauthorized"});
            } else {
                req.user = user;
                next();
            }
        }).catch(function(err) {
            next(err);
        })
    }
    static signToken(id) {
        return jwt.sign(
            {id: message.id},
            config.secrets.jwt,
            {expiresIn: config.expireTime}
        );
    }
}

export default Auth;