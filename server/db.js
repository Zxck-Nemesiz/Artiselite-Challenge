const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zakuan2002',
    database: 'warehouse_db'
})

db.connect(err => {
    if (err) {
        console.error('Error connecting to databse:', err);
        return;
    }
    console.log('Connected successfully');
})

module.exports = db;