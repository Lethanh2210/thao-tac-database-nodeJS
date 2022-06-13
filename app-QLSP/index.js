const mysql = require('mysql');
const http = require('http');

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

const sqlSelect = 'SELECT * FROM products';
connection.query(sqlSelect, (err, results, fields) => {
    if (err) throw err;
    console.log(results)
});

const server = http.createServer(async (req, res) => {
    try {
        if (req.url === "/product/create" && req.method === 'POST') {
            const buffers = [];
            for await (const chunk of req) {
                buffers.push(chunk);
            }
            const data = Buffer.concat(buffers).toString();
            const product = JSON.parse(data);
            const sqlCreate = `INSERT INTO products(name, price) VALUES ('${product.name}', '${product.price}');`;
            connection.query(sqlCreate, (err, results, fields) => {
                if (err) throw err;
                res.end(JSON.stringify(product))
            });
        }

    } catch (err) {
        return res.end(err.message);
    }
});

server.listen(8080, function () {
    console.log('server running at localhost:8080 ')
});