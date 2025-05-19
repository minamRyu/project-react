const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'test1234',
    database: 'sample2' 
});

const promisePool = pool.promise();
module.exports = promisePool;