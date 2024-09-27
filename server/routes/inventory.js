const express = require('express');
const router = express.Router();
const db = require('../db'); // Directly import your database connection

// Get all inventory items
router.get('/', (req, res) => {
    db.query('SELECT * FROM inventory', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Add a new product
router.post('/', (req, res) => {
    const { product_name, quantity } = req.body;
    db.query('INSERT INTO inventory (product_name, quantity) VALUES (?, ?)', [product_name, quantity], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Product added to inventory successfully' });
    });
});

// Update a product
router.put('/:id', (req, res) => {
    const { product_name, quantity } = req.body;
    db.query('UPDATE inventory SET product_name = ?, quantity = ? WHERE id = ?', [product_name, quantity, req.params.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Product updated successfully' });
    });
});

// Delete a product
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM inventory WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

module.exports = router;
