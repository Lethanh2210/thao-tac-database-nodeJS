const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Anhyeuem.123',
    database: 'dbTest',
    charset: 'utf8_general_ci'
});

connection.connect(function (err) {
    if (err) {
        throw err.stack;
    }
    else {
        console.log("connect success");
    }
});

const sqlInsert = "INSERT INTO customer(name,address) values ('CodeGym2','ThaiNguyen')"
connection.query(sqlInsert, (err, results, fields) => {
    if (err) throw err;
});

const sqlSelect = 'SELECT * FROM customer';
connection.query(sqlSelect, (err, results, fields) => {
    if (err) throw err;
    console.log(results)
});

const sqlWhere = "SELECT * FROM customer WHERE address = 'ThanhXuan'";
connection.query(sqlWhere, (err, results, fields) => {
    if (err) throw err;
    console.log(results, "where");
});

const sqlLimit = "SELECT * FROM customer LIMIT 2";
connection.query(sqlLimit, (err, results, fields) => {
    if (err) throw err;
    console.log(results, "limit");
});