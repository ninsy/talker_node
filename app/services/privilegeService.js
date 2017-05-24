import Models from '../models/db';
import _ from 'lodash';
import sequelize from 'sequelize';

let instance = null;

/**
 * priviledges in form of [ READ, WRITE, EXECUTE ]
 */

export default class privilegeService {
    constructor() {
        if(!instance) {
            instance = this;
            instance.ROLES = {
                OWNER: [true, true, true],
                MOD: [true, true, true],
                PARTICIPANT: [true, true, false],
            }
        }
        return instance;
    }
    addCustomRole(roleName, actionArray) {
        if(roleName && actionArray.every(action => Object.prototype.toString.call(canRead) === '[object Boolean]' )) {
            instance.ROLES[roleName] = actionArray;
        }
    }
}