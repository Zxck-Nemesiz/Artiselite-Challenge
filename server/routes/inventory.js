// inventory.js
const express = require('express');
const db = require('../db');
const router = express.Router();

// Helper function for query execution
const runQuery = (query, params, res) => {
    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Get all inventory items
router.get('/', (req, res) => runQuery('SELECT * FROM inventory', [], res));

// Add a new product
router.post('/', (req, res) => {
    const { product_name, quantity } = req.body;
    runQuery('INSERT INTO inventory (product_name, quantity) VALUES (?, ?)', [product_name, quantity], res);
});

// Update a product
router.put('/:id', (req, res) => {
    const { product_name, quantity } = req.body;
    runQuery('UPDATE inventory SET product_name = ?, quantity = ? WHERE id = ?', [product_name, quantity, req.params.id], res);
});

// Delete a product
router.delete('/:id', (req, res) => runQuery('DELETE FROM inventory WHERE id = ?', [req.params.id], res));

module.exports = router;
