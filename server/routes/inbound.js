const express = require('express');
const router = express.Router();
const db = require('../db'); // Directly import your database connection

// Get all inbound records
router.get('/', (req, res) => {
    db.query('SELECT * FROM inbound', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Add new inbound record
router.post('/', (req, res) => {
    const { product_name, supplier, quantity } = req.body;
    db.query('INSERT INTO inbound (product_name, supplier, quantity) VALUES (?, ?, ?)', [product_name, supplier, quantity], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Inbound record added successfully' });
    });
});

module.exports = router;
