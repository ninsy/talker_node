let Models = require('../models/db');
let _ = require('lodash');
let sequelize = require('sequelize');

class userService {
    static getOne({id}) {
        return Models.User.findById(id)
            .then(user => {
                return !user
                    ? Promise.reject({status: 404, message: `User with id ${id} doesn't exist.`})
                    : user;
            })
    }
    static update({current, data}) {
        if(!current) {
           return Promise.reject({status: 400, message: 'Missing data object'});
        }
        _.merge(current, data);
        return current.save();
    }
    static register({username, password, email}) {
        return Models.User.create({
            username,
            password,
            email,
        });
    }
    static getList(payload) {
        let searchObj = {};
        if(payload) {

            if(payload.username) {
                searchObj.where = {
                    $and: {
                        username: {
                            $like: `%${payload.username}%`
                        }
                    }
                }
            }
        }

        return Models.User.findAll();
    }
};

module.exports = userService;