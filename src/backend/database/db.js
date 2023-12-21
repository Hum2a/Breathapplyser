const promise = require('bluebird');
const initOptions = {
    promiseLib: promise
};
const pgp = require('pg-promise')(initOptions);

// Database connection details
const dbConfig = {
    host: '127.0.0.1',
    port: 5432,
    database: 'breathappdb',
    user: 'postgres',
    password: 'Dinorex1711#'
};

const db = pgp(dbConfig);

module.exports = db;
;
