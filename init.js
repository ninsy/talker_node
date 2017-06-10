let db = require('./app/models/db');
let privilegeService = require('./app/services/privilegeService');


db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(function(){
        return db.sequelize.sync({force: true});
    })
    .then(function(){
        return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
    })
    .then(_ => {
        new privilegeService();
    });



