const mysql = require('mysql');
const http = require('http');
const fs = require('fs');
const qs = require('qs');
const url = require('url');
let db = [];

let editButton = (obj) => {
    return `<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo" onclick='getEditButton(${obj})'>Edit</button>`;
}

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Anhyeuem.123',
    database: 'dbTest',
    charset: 'utf8_general_ci'
});

connection.connect(function (err) {
    if (err) {
        throw err.stack;
    } else {
        console.log("connect success");
    }
});

function showListUser(res) {
    const selectProduct = `SELECT * FROM products`;
    connection.query(selectProduct, (err, results, fields) => {
        if (err) throw err;
        db = Object.values(JSON.parse(JSON.stringify(results)))
    });
    fs.readFile('./index.html', 'utf-8', function (err, data) {
        if (err) {
            throw new Error(err.message)
        }
        let html = '';
        for (let i = 0; i < db.length; i++) {
            html += '<tr>';
            html += `<td>${db[i].id}</td>`
            html += `<td>${db[i].name}</td>`
            html += `<td>${db[i].price}</td>`
            html += `<td>
                    <a href="/delete?id=${db[i].id}" class="btn btn-danger">Delete</a>
                    ${editButton(JSON.stringify(db[i]))}
                </td>`
            html += '</tr>';
        }
        data = data.replace('{list}', html)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });

}


const server = http.createServer( async(req, res) => {
    let parseUrl = url.parse(req.url, true);
    let path = parseUrl.pathname;
    let trimPath = path.replace(/^\/+|\/+$/g, '');
    let chosenHandler = (typeof (router[trimPath]) !== 'undefined') ? router[trimPath] : handlers.notFound;
    chosenHandler(req, res);


});

server.listen(8081, function () {
    console.log('server running at localhost:8081')
});

let handlers = {};
// products page


handlers.home = function (req, res) {
    if (req.method === 'GET') {
        showListUser(res);
    } else {
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            const product = qs.parse(data);
            const sqlCreate = `INSERT INTO products(name, price) VALUES ('${product.name}', '${product.price}');`;
            connection.query(sqlCreate, (err, results, fields) => {
                if (err) throw err;
                res.writeHead(301, {
                    Location: "http://localhost:8081/home"
                })
                res.end();
            });
        })
    }
};

handlers.delete = function (req, res) {
    const urlPath = url.parse(req.url, true);
    let queryString = urlPath.query;
    let index = Number(queryString.id);
    const sqlCreate = `DELETE FROM products WHERE id = ${index}`;
    connection.query(sqlCreate, (err, results, fields) => {
        if (err) throw err;
        res.writeHead(301, {
            Location: "http://localhost:8081/home"
        })
        res.end();
    });



}


handlers.edit = function (req, res) {
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            const product = qs.parse(data);
            const sqlCreate = `UPDATE products SET name = '${product.editName}', price = '${product.editPrice}' WHERE id = ${product.editId}`;
            connection.query(sqlCreate, (err, results, fields) => {
                if (err) throw err;
                res.writeHead(301, {
                    Location: "http://localhost:8081/home"
                })
                res.end();
            });
        })

};

handlers.notFound = function (req, res) {
    res.end('404')
};

let router = {
    'delete': handlers.delete,
    'edit': handlers.edit,
    'home': handlers.home
}