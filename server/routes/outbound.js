const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all outbound products
router.get('/', (req, res) => {
    db.query('SELECT * FROM outbound', [], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Add a new outbound product
router.post('/', (req, res) => {
    const { product_sku, destination, quantity } = req.body;
    const date_shipped = generateDateShipped();
    
    db.query('INSERT INTO outbound (product_sku, destination, quantity, date_shipped) VALUES (?, ?, ?, ?)', 
    [product_sku, destination, quantity, date_shipped], 
    (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        const newProductId = results.insertId;
        const reference = generateReference(newProductId);

        // Update reference based on the product ID
        db.query('UPDATE outbound SET reference = ? WHERE id = ?', 
        [reference, newProductId], 
        (updateErr) => {
            if (updateErr) {
                console.error('Database error during reference update:', updateErr);
                return res.status(500).json({ error: 'Reference update failed' });
            }
            res.json({ message: 'Product added successfully', product_id: newProductId });
        });
    });
});

// Edit an outbound product
router.put('/:id', (req, res) => {
    const { product_sku, destination, quantity } = req.body;
    db.query('UPDATE outbound SET product_sku = ?, destination = ?, quantity = ? WHERE id = ?', 
    [product_sku, destination, quantity, req.params.id], 
    (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Product updated successfully' });
    });
});

// Delete an outbound product
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM outbound WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

// Helper functions to generate date_shipped and reference
const generateDateShipped = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const year = String(now.getFullYear()).slice(-2);
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    
    return `${day}${month}${year}${hour}${minute}`; // Format: DDMMYYHHMM
};

module.exports = router;
