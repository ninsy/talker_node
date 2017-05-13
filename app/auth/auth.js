var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('../config/config');
var checkToken = expressJwt({ secret: config.secrets.jwt });
var User = require('../models/db').User;


import jwt from 'jsonwebtoken';
import config from '../../config/config';
import Models from '../models/db'

class Auth {
    static verifyToken(info, cb) {
        let token = info.req.headers.token;
        if(!token) {
            // TODO: replace with response packet
            cb(false, 401, 'Unauthorized');
        } else {
            jwt.verify(token, config.secrets.jwt, (err, decoded) => {
                if(err) {
                    cb(false, 401, 'Unauthorized');
                } else {
                    info.req.user = decoded;
                    cb(true);
                }
            })
        }
    }
    static verifyUser({email, password}) {
        if(!email || !password) {
            return {status: 400, message: 'You need to provide both email and password'};
        }
        Models.User.findById({where: { email: email}}).then(function())
    }
    static signUser(id) {
        return jwt.sign(
            {id: id},
            config.secrets.jwt,
            {expiresIn: config.expireTime}
        );
    }
}

export default Auth;

exports.decodeToken = function() {
    return function(req, res, next) {
        if(req.query && req.query.hasOwnProperty("access_token")) {
            req.headers.authorization = `Bearer ${req.query.access_token}`;
        }
        checkToken(req, res, next);
    }
};

exports.getFreshUser = function() {
    return function(req, res, next) {
        console.log(`USER ID: ${req.user.id}`);
        User.findById(req.user.id).then(function(user) {
            if(!user) {
                res.status(401).json({message: "Unauthorized"});
            } else {
                req.user = user;
                next();
            }
        }).catch(function(err) {
            next(err);
        })
    }
};

exports.verifyUser = function() {
    return function(req, res, next) {
        var email = req.body.email;
        var password = req.body.password;

        if(!email || !password) {
            res.status(400).json({message: "You need to provide both email and password"});
            return;
        }

        User.findAll({where: {email: email}}).then(function(users) {

            var user = users[0];

            if(!user || !user.authenticate(password)) {
                res.status(401).json({message: "Wrong password."});
            } else {
                req.user = user;
                next();
            }
        }).catch(function(error) {
            next(error);
        })
    }
};

exports.signToken = function(id) {
    return jwt.sign(
        {id: id},
        config.secrets.jwt,
        {expiresIn: config.expireTime}
    );
};