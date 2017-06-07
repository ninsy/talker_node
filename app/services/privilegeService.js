let Models  = require('../models/db');
let _  = require('lodash');
let sequelize  = require('sequelize');

let instance = null;

/**
 * priviledges in form of [ READ, WRITE, EXECUTE ]
 */


function basicSetup(privileges) {
    let promiseArr = [];
    for(let key in Object.ownKeys(privileges)) {
        promiseArr.push(Models.Privilege.create({
            name: key,
            canRead: privileges[key][0],
            canWrite: privileges[key][1],
            canExecute: privileges[key][2],
        }));
    }
    return Promise.all(promiseArr);
}

class privilegeService {
    constructor() {
        if(!instance) {
            instance = this;
            instance.ROLES = {
                OWNER: [true, true, true],
                MOD: [true, true, true],
                PARTICIPANT: [true, true, false],
            };
            return Models.Privilege.findAll({
                where: {
                    name: {
                        $or: [
                            'OWNER', 'PARTICIPANT', 'MOD'
                        ]
                    }
                }
            }).then(basicRoles => {
                if(!basicRoles || basicRoles.length !== Object.keys(instance.ROLES).length) {
                    return basicSetup(instance.ROLES).then(_ => instance)
                } else {
                    return instance;
                }
            })
        }
        return instance;
    }
    getRole(name) {
        return Models.Privilege.find({
            where: {
                name,
            }
        })
    }
    addCustomRole(roleName, actionArray) {
        if(roleName && actionArray.every(action => Object.prototype.toString.call(canRead) === '[object Boolean]' )) {
            instance.ROLES[roleName] = actionArray;
        }
    }
    setRole() {

    }
}

module.exports = privilegeService;