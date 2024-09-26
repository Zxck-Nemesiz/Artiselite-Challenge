// outbound.js
const express = require('express');
const runQuery = require('./helpers/runQuery'); // Helper function for query execution
const router = express.Router();

// Get all outbound records
router.get('/', (req, res) => runQuery('SELECT * FROM outbound', [], res));

// Add a new outbound record
router.post('/', (req, res) => {
    const { product_name, customer, quantity } = req.body;
    runQuery('INSERT INTO outbound (product_name, customer, quantity) VALUES (?, ?, ?)', [product_name, customer, quantity], res);
});

module.exports = router;
