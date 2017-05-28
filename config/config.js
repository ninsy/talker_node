//require("dotenv").config();

let development = require("./dev");
let production = require('./prod');

const ENVS = {
    development,
    production,
};

let config = ((env = 'development') => {

    let options = ENVS[env.toLowerCase()] || {};
    {
        let {
            port = process.env.PORT || 5000,
            expireTime = 24 * 60 * 10,
            databaseName = process.env.DB_NAME,
            databasePass = process.env.DB_PASS,
            databaseOptions = {
                dialect: "mysql",
                host: process.env.DB_HOST,
                password: process.env.DB_PASS,
                user: process.env.DB_USER,
                logging: console.log,
                pool: {
                    max: 4,
                    min: 1,
                    idle: 10000
                }
            },
            secrets = {
                jwt: process.env.JWT || "secret123",
            }
            //transports: [ consoleTransport = 'console'] = [],
        } = options;

        options = {
            port,
            expireTime,
            secrets,
            sequelizeOptions: {
                databaseName,
                databasePass,
                databaseOptions,
            },
        };
    };

    return options;

})(process.env.NODE_ENV);

module.exports = config;