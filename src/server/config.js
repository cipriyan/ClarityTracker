'use strict';
var config = {
    db: {
        prod: {
            host: 'localhost',
            port: 5432,
            database: 'ClarityTracker',
            user: 'postgres',
            password: 'password-1'
        },
        dev: {
            host: 'localhost',
            port: 5432,
            database: 'ClarityTracker',
            user: 'postgres',
            password: 'password-1'
        }
    }
};
module.exports = config;