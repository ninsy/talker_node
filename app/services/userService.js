import Models from '../models/db';
import _ from 'lodash';
import sequelize from 'sequelize';

export default class userService {
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