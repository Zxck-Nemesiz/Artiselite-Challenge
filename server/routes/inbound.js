const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper function to generate reference
const generateReference = (id) => `INBOUND${id.toString().padStart(3, '0')}`;

// Helper function to generate the current date in the format: DDMMYYHHMM
const generateDateReceived = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(2); // Last 2 digits of the year
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}${month}${year}${hours}${minutes}`;
};

// Get all inbound products
router.get('/', (req, res) => {
    db.query('SELECT * FROM inbound', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Add a new inbound product
router.post('/', (req, res) => {
    const { product_sku, quantity, location } = req.body; // Location provided by manager
    const date_received = generateDateReceived();
    const reference = generateReference(Date.now() % 1000); // Based on current timestamp for uniqueness

    db.query('INSERT INTO inbound (product_sku, quantity, reference, date_received, location) VALUES (?, ?, ?, ?, ?)', 
        [product_sku, quantity, reference, date_received, location], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Inbound product added successfully' });
    });
});

// Update an existing inbound product
router.put('/:id', (req, res) => {
    const { product_sku, quantity, location } = req.body;
    db.query('UPDATE inbound SET product_sku = ?, quantity = ?, location = ? WHERE id = ?', 
        [product_sku, quantity, location, req.params.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Inbound product updated successfully' });
    });
});

// Delete an inbound product
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM inbound WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Inbound product deleted successfully' });
    });
});

module.exports = router;
