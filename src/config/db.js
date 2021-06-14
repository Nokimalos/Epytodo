require('dotenv').config()
const mysql = require('mysql2');
const db_connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    dateStrings:true
});

db_connection.connect(function(error) {
    if (!!error) {
        console.log(error)
    } else {
        console.log('DB: OK!');
    }
});

module.exports = db_connection;