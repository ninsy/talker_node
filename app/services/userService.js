let Models = require('../models/db');
let _ = require('lodash');
let sequelize = require('sequelize');

class userService {
    static update(currentUser, { user }) {
        _.merge(currentUser, user);
        return currentUser.save();
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