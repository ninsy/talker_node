//require("dotenv").config();

import dev from "./dev";
import prod from './prod';

const ENVS = {
    dev,
    prod,
};

let config = ((env = 'dev') => {

    let options = ENVS[env.toLowerCase()] || {};
    {
        let {
            port = process.env.PORT || 5000,
            expireTime = 24 * 60 * 10,
            databaseName = process.env.DB_NAME,
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
                databaseOptions,
            },
        };
    };

    return options;

})(process.env.NODE_ENV);

export default config;