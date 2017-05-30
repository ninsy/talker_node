let Models = require('../models/db');
let _ = require('lodash');
let sequelize = require('sequelize');

class userService {
    static getOne({id}) {
        return Models.User.findById(id);
    }
    static update({current, data}) {
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
};

module.exports = userService;