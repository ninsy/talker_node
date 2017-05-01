//require("dotenv").config();

var config = {
    dev: "dev",
    prod: "prod",
    port: process.env.PORT || 5000,
    expireTime: 24 * 60 * 10,
    secrets: {
        jwt: process.env.JWT || "secret123"
    }
};

config.env = process.env.NODE_ENV || config.dev;
config.databaseName = process.env.DB_NAME;
config.databaseOptions = {
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
};

module.exports = Object.assign(config, require("./" + config.env));