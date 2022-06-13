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


//Insert
// const sqlInsert = "INSERT INTO customer (name, address) VALUES ('Đỗ Tiến Thành', 'Phú Thọ')";
// connection.query(sqlInsert, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
// });
const sqlUpdate = "UPDATE customer SET address = 'Hải Dương' WHERE name = 'Codegym'";
connection.query(sqlUpdate, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
});

const sqlSelect = 'SELECT * FROM customer';
connection.query(sqlSelect, (err, results, fields) => {
    if (err) throw err;
    console.log(results)
});


