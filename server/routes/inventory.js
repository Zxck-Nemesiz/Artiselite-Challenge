const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all inventory items or filter by search query
router.get('/', (req, res) => {
    const { search } = req.query;
    let query = 'SELECT *, CONCAT(category, ", ", supplier) AS tags FROM inventory';
    const queryParams = [];

    if (search) {
        query += ' WHERE name LIKE ? OR category LIKE ? OR supplier LIKE ?';
        queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Add a new product
router.post('/', (req, res) => {
    const { product_name, quantity, category, supplier } = req.body;
    db.query('INSERT INTO inventory (product_name, quantity, category, supplier) VALUES (?, ?, ?, ?)', 
        [product_name, quantity, category, supplier], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Product added to inventory successfully' });
    });
});

// Update a product
router.put('/:id', (req, res) => {
    const { product_name, quantity, category, supplier } = req.body;
    db.query('UPDATE inventory SET product_name = ?, quantity = ?, category = ?, supplier = ? WHERE id = ?', 
        [product_name, quantity, category, supplier, req.params.id], (err, results) => {
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
