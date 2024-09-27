const express = require('express');
const router = express.Router();
const db = require('../db'); // Directly import your database connection

// Get all outbound records
router.get('/', (req, res) => {
    db.query('SELECT * FROM outbound', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Add a new outbound record
router.post('/', (req, res) => {
    const { product_name, customer, quantity } = req.body;
    db.query('INSERT INTO outbound (product_name, customer, quantity) VALUES (?, ?, ?)', [product_name, customer, quantity], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Outbound record added successfully' });
    });
});

module.exports = router;
