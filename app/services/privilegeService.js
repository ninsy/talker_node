let Models  = require('../models/db');
let _  = require('lodash');
let sequelize  = require('sequelize');

let instance = null;

/**
 * priviledges in form of [ READ, WRITE, EXECUTE ]
 */

// instance.ROLES = {
//     OWNER: [true, true, true],
//     MOD: [true, true, true],
//     PARTICIPANT: [true, true, false],
// };

function basicSetup(privileges) {
    let promiseArr = [];
    Object.entries(privileges).forEach(([key, values]) => {
        promiseArr.push(Models.Privilege.create({
            name: key,
            canRead: values[0],
            canWrite: values[1],
            canExecute: values[2],
        }));
    });
    return Promise.all(promiseArr).then(_ => {
        console.log(_);
    })
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
            instance.init();
        }
        return instance;
    }
    init() {
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
                return basicSetup(instance.ROLES);
            }
        })
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