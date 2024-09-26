// inbound.js
const express = require('express');
const db = require('../db');
const router = express.Router();
const runQuery = require('../helpers/runQuery'); // Use the helper for running queries

// Get all inbound records
router.get('/', (req, res) => runQuery('SELECT * FROM inbound', [], res));

// Add new inbound record
router.post('/', (req, res) => {
    const { product_name, supplier, quantity } = req.body;
    runQuery('INSERT INTO inbound (product_name, supplier, quantity) VALUES (?, ?, ?)', [product_name, supplier, quantity], res);
});

module.exports = router;
