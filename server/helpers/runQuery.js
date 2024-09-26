// helpers/runQuery.js
const db = require('../db');

const runQuery = (query, params, res) => {
    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

module.exports = runQuery;